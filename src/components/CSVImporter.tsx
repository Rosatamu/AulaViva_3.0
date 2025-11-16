import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Database, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CSVImporterProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportStats {
  total: number;
  imported: number;
  errors: number;
  skipped: number;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        value = value.trim().replace(/^"|"$/g, '');

        if (!isNaN(Number(value)) && value !== '') {
          row[header] = parseFloat(value);
        } else {
          row[header] = value || null;
        }
      });

      data.push(row);
    }

    return data;
  };

  const transformData = (csvData: any[]): any[] => {
    return csvData.map((row, index) => {
      const idEstudiante = row.id_estudiante ||
                           row.ID ||
                           row.id ||
                           `student_${Date.now()}_${index}`;

      return {
        id_estudiante: idEstudiante.toString(),
        nombres: row.nombres || row.Nombres || row.nombre || '',
        nombre_usuario: row.nombre_usuario || row.usuario || row.nombres || '',
        grado: row.grado || row.Grado || '',
        sexo: parseInt(row.sexo) || null,
        sexo_letra: row.sexo_letra || row.Sexo || 'M',
        grado_num: parseInt(row.grado_num) || parseInt(row.grado) || 0,
        edad_estimada: parseInt(row.edad_estimada) || parseInt(row.edad) || 14,

        peso_pre: parseFloat(row.peso_pre) || parseFloat(row.peso) || 0,
        talla_pre: parseFloat(row.talla_pre) || parseFloat(row.talla) || 0,
        imc_pre: parseFloat(row.imc_pre) || parseFloat(row.imc) || 0,

        peso_post: parseFloat(row.peso_post) || 0,
        talla_post: parseFloat(row.talla_post) || 0,
        imc_post: parseFloat(row.imc_post) || 0,

        leger_pre: parseFloat(row.leger_pre) || 0,
        fuerza_pre: parseFloat(row.fuerza_pre) || 0,
        flex_pre: parseFloat(row.flex_pre) || 0,
        vo2max_pre: parseFloat(row.vo2max_pre) || 0,
        vo2max_pre_cat: row.vo2max_pre_cat || '',

        leger_post: parseFloat(row.leger_post) || 0,
        fuerza_post: parseFloat(row.fuerza_post) || 0,
        flex_post: parseFloat(row.flex_post) || 0,
        vo2max_post: parseFloat(row.vo2max_post) || 0,
        vo2max_post_cat: row.vo2max_post_cat || '',

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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setLogs([]);
    setProgress(0);

    try {
      addLog('Leyendo archivo CSV...');
      const text = await file.text();

      addLog('Parseando datos...');
      const csvData = parseCSV(text);
      addLog(`${csvData.length} registros encontrados`);

      addLog('Transformando datos...');
      const transformedData = transformData(csvData);
      setProgress(25);

      addLog('Iniciando importación a Supabase...');

      const batchSize = 50;
      let imported = 0;
      let errors = 0;
      let skipped = 0;

      for (let i = 0; i < transformedData.length; i += batchSize) {
        const batch = transformedData.slice(i, i + batchSize);

        const { data, error: batchError } = await supabase
          .from('rml_datos')
          .upsert(batch, {
            onConflict: 'id_estudiante',
            ignoreDuplicates: false
          })
          .select();

        if (batchError) {
          addLog(`❌ Error en batch ${Math.floor(i / batchSize) + 1}: ${batchError.message}`);
          errors += batch.length;
        } else {
          imported += batch.length;
          addLog(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} registros importados`);
        }

        const progressPercent = 25 + ((i + batchSize) / transformedData.length) * 75;
        setProgress(Math.min(progressPercent, 100));
      }

      setStats({
        total: transformedData.length,
        imported,
        errors,
        skipped
      });

      addLog('✨ Importación completada');
      setProgress(100);

      if (errors === 0) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error durante la importación: ${errorMessage}`);
      addLog(`💥 Error fatal: ${errorMessage}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Importar Datos CSV</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={importing}
          >
            ✕
          </button>
        </div>

        {!stats && (
          <div className="space-y-6">
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5" />
                <span>Instrucciones</span>
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li>Descarga el archivo CSV de Google Drive</li>
                <li>Asegúrate de que tenga las columnas correctas</li>
                <li>Selecciona el archivo usando el botón de abajo</li>
                <li>Haz clic en "Importar" y espera a que termine</li>
              </ol>
            </div>

            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />

              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
                disabled={importing}
              />

              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Seleccionar archivo CSV
              </label>

              {file && (
                <p className="mt-4 text-green-400 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{file.name}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {importing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {logs.length > 0 && (
              <div className="bg-black/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="font-semibold mb-2 text-sm">Log de importación</h4>
                <div className="space-y-1 text-xs font-mono text-gray-400">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                disabled={importing}
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importando...' : 'Importar Datos'}
              </button>
            </div>
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl font-bold mb-2">Importación Completada</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-400">Total procesados</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{stats.imported}</div>
                <div className="text-sm text-gray-400">Importados</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                <div className="text-sm text-gray-400">Errores</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.skipped}</div>
                <div className="text-sm text-gray-400">Omitidos</div>
              </div>
            </div>

            {logs.length > 0 && (
              <div className="bg-black/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="font-semibold mb-2 text-sm">Log completo</h4>
                <div className="space-y-1 text-xs font-mono text-gray-400">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVImporter;
