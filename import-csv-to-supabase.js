#!/usr/bin/env node

/**
 * Script de importación de CSV a Supabase
 *
 * USO:
 * 1. Descarga el CSV de Google Drive
 * 2. Colócalo en el mismo directorio que este script con nombre: rml_datos.csv
 * 3. Ejecuta: node import-csv-to-supabase.js
 *
 * Este script:
 * - Lee el CSV línea por línea
 * - Transforma los datos al formato de la tabla rml_datos
 * - Inserta en batch a Supabase
 * - Muestra progreso y maneja errores
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (desde .env)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ouwjnpvjyguvvevkbkqv.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d2pucHZqeWd1dnZldmtia3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTI2OTIsImV4cCI6MjA3NjAyODY5Mn0.tahtTcW-UiLz6EQIddBX03bIDEANpDdIHRqeAppydNo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Archivo CSV a importar
const CSV_FILE = './rml_datos.csv';

/**
 * Parse CSV manualmente (simple parser)
 */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};

    headers.forEach((header, index) => {
      let value = values[index] || '';
      value = value.trim().replace(/^"|"$/g, '');

      // Convertir números
      if (!isNaN(value) && value !== '') {
        row[header] = parseFloat(value);
      } else {
        row[header] = value || null;
      }
    });

    data.push(row);
  }

  return data;
}

/**
 * Transformar datos del CSV al formato de rml_datos
 */
function transformData(csvData) {
  return csvData.map(row => {
    // Generar un ID único para id_estudiante si no existe
    const idEstudiante = row.id_estudiante ||
                         row.ID ||
                         row.id ||
                         `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id_estudiante: idEstudiante.toString(),
      nombres: row.nombres || row.Nombres || row.nombre || '',
      nombre_usuario: row.nombre_usuario || row.usuario || row.nombres || '',
      grado: row.grado || row.Grado || '',
      sexo: parseInt(row.sexo) || null,
      sexo_letra: row.sexo_letra || row.Sexo || 'M',
      grado_num: parseInt(row.grado_num) || parseInt(row.grado) || 0,
      edad_estimada: parseInt(row.edad_estimada) || parseInt(row.edad) || 14,

      // Datos antropométricos PRE
      peso_pre: parseFloat(row.peso_pre) || parseFloat(row.peso) || 0,
      talla_pre: parseFloat(row.talla_pre) || parseFloat(row.talla) || 0,
      imc_pre: parseFloat(row.imc_pre) || parseFloat(row.imc) || 0,

      // Datos antropométricos POST
      peso_post: parseFloat(row.peso_post) || 0,
      talla_post: parseFloat(row.talla_post) || 0,
      imc_post: parseFloat(row.imc_post) || 0,

      // Tests físicos PRE
      leger_pre: parseFloat(row.leger_pre) || 0,
      fuerza_pre: parseFloat(row.fuerza_pre) || 0,
      flex_pre: parseFloat(row.flex_pre) || 0,
      vo2max_pre: parseFloat(row.vo2max_pre) || 0,
      vo2max_pre_cat: row.vo2max_pre_cat || '',

      // Tests físicos POST
      leger_post: parseFloat(row.leger_post) || 0,
      fuerza_post: parseFloat(row.fuerza_post) || 0,
      flex_post: parseFloat(row.flex_post) || 0,
      vo2max_post: parseFloat(row.vo2max_post) || 0,
      vo2max_post_cat: row.vo2max_post_cat || '',

      // Diferencias y cambios
      vo2max_dif: parseFloat(row.vo2max_dif) || 0,
      vo2max_porcambio: parseFloat(row.vo2max_porcambio) || 0,
      leger_dif: parseFloat(row.leger_dif) || 0,
      leger_porcambio: parseFloat(row.leger_porcambio) || 0,
      fuerza_dif: parseFloat(row.fuerza_dif) || 0,
      fuerza_porcambio: parseFloat(row.fuerza_porcambio) || 0,
      flex_dif: parseFloat(row.flex_dif) || 0,
      flex_porcambio: parseFloat(row.flex_porcambio) || 0
    };
  });
}

/**
 * Importar datos a Supabase en batches
 */
async function importData() {
  try {
    console.log('📂 Leyendo archivo CSV...');

    if (!fs.existsSync(CSV_FILE)) {
      console.error(`❌ ERROR: No se encuentra el archivo ${CSV_FILE}`);
      console.log('\n📝 INSTRUCCIONES:');
      console.log('1. Descarga el CSV de Google Drive');
      console.log('2. Renómbralo a "rml_datos.csv"');
      console.log('3. Colócalo en el mismo directorio que este script');
      console.log('4. Ejecuta de nuevo: node import-csv-to-supabase.js\n');
      process.exit(1);
    }

    const csvText = fs.readFileSync(CSV_FILE, 'utf-8');
    console.log('✅ Archivo leído correctamente\n');

    console.log('🔄 Parseando CSV...');
    const csvData = parseCSV(csvText);
    console.log(`✅ ${csvData.length} registros encontrados\n`);

    console.log('🔄 Transformando datos...');
    const transformedData = transformData(csvData);
    console.log('✅ Datos transformados\n');

    console.log('📤 Importando a Supabase...');
    console.log('⏳ Esto puede tomar unos segundos...\n');

    // Importar en batches de 50 registros
    const batchSize = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('rml_datos')
        .upsert(batch, {
          onConflict: 'id_estudiante',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error(`❌ Error en batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} registros importados`);
      }
    }

    console.log('\n📊 RESUMEN DE IMPORTACIÓN:');
    console.log(`   ✅ Importados: ${imported}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📝 Total procesados: ${transformedData.length}\n`);

    // Verificar importación
    console.log('🔍 Verificando datos en Supabase...');
    const { count, error: countError } = await supabase
      .from('rml_datos')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`✅ Total de registros en tabla rml_datos: ${count}\n`);
    }

    console.log('🎉 ¡IMPORTACIÓN COMPLETADA!\n');

  } catch (error) {
    console.error('❌ ERROR FATAL:', error);
    process.exit(1);
  }
}

// Ejecutar importación
console.log('🚀 INICIANDO IMPORTACIÓN DE DATOS\n');
console.log('═'.repeat(50));
console.log('\n');

importData().then(() => {
  console.log('═'.repeat(50));
  console.log('✨ Proceso finalizado exitosamente');
  process.exit(0);
}).catch(err => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
