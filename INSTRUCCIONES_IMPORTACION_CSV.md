# Instrucciones para Importar Datos del CSV a Supabase

Este documento explica cómo importar tus datos reales desde el archivo CSV de Google Drive a la tabla `rml_datos` en Supabase.

---

## Opción 1: Importación Visual (RECOMENDADA)

Esta es la forma más fácil y visual de importar los datos directamente desde la aplicación.

### Pasos:

1. **Descarga el CSV de Google Drive**
   - Abre el enlace: https://drive.google.com/file/d/1vrFrlN9Qz9GvDeuggXMSA0CQnE2jDdew/view?usp=sharing
   - Haz clic en "Descargar" (ícono con flecha hacia abajo)
   - Guarda el archivo en tu computadora

2. **Abre la aplicación Aula Viva**
   - Inicia sesión con tu usuario
   - Navega al Dashboard
   - Haz clic en "Gestión de Datos" (ícono de base de datos)

3. **Importa el CSV**
   - En la pantalla de Gestión de Datos, haz clic en el botón **"Importar CSV"** (botón azul con ícono de upload)
   - Se abrirá un modal de importación
   - Haz clic en "Seleccionar archivo CSV"
   - Selecciona el archivo que descargaste en el paso 1
   - Haz clic en **"Importar Datos"**
   - Espera a que el proceso termine (verás una barra de progreso)

4. **Verifica la importación**
   - Una vez completado, verás un resumen con:
     - Total de registros procesados
     - Registros importados exitosamente
     - Errores (si los hubo)
   - La tabla se actualizará automáticamente mostrando todos los estudiantes importados

### Ventajas:
- ✅ No requiere conocimientos técnicos
- ✅ Interfaz visual intuitiva
- ✅ Feedback en tiempo real del progreso
- ✅ Manejo automático de errores
- ✅ Logs detallados de la importación

---

## Opción 2: Script Node.js (Para desarrolladores)

Si prefieres un método automatizado desde la terminal.

### Pasos:

1. **Descarga el CSV**
   ```bash
   # Desde Google Drive
   # O usa este comando si tienes curl:
   curl -L "https://drive.usercontent.google.com/uc?id=1vrFrlN9Qz9GvDeuggXMSA0CQnE2jDdew&export=download" -o rml_datos.csv
   ```

2. **Coloca el archivo en el directorio del proyecto**
   ```bash
   # El archivo debe estar en la raíz del proyecto con nombre: rml_datos.csv
   ls rml_datos.csv  # Verifica que existe
   ```

3. **Ejecuta el script de importación**
   ```bash
   node import-csv-to-supabase.js
   ```

4. **Revisa el output**
   - El script mostrará progreso en tiempo real
   - Al finalizar verás un resumen completo
   - Los datos se habrán insertado en Supabase

### Ventajas:
- ✅ Automatizable
- ✅ Útil para re-importaciones frecuentes
- ✅ Importa en batches de 50 registros
- ✅ Manejo robusto de errores

---

## Formato Esperado del CSV

El archivo CSV debe tener las siguientes columnas (el orden puede variar):

### Columnas Obligatorias:
- `id_estudiante` o `ID` o `id` - Identificador único del estudiante
- `nombres` o `Nombres` o `nombre` - Nombre del estudiante

### Columnas Opcionales:
- `nombre_usuario` o `usuario` - Usuario para login
- `grado` o `Grado` - Grado académico
- `sexo` - Código numérico (1 = M, 2 = F)
- `sexo_letra` o `Sexo` - Letra (M/F)
- `edad_estimada` o `edad` - Edad en años

### Datos Antropométricos:
- `peso_pre`, `peso_post` - Peso en kg
- `talla_pre`, `talla_post` - Talla en cm
- `imc_pre`, `imc_post` - Índice de Masa Corporal

### Tests Físicos:
- `leger_pre`, `leger_post` - Test de Leger
- `fuerza_pre`, `fuerza_post` - Fuerza
- `flex_pre`, `flex_post` - Flexibilidad
- `vo2max_pre`, `vo2max_post` - VO2 Max
- `vo2max_pre_cat`, `vo2max_post_cat` - Categoría VO2 Max

### Diferencias y Cambios:
- `vo2max_dif`, `vo2max_porcambio`
- `leger_dif`, `leger_porcambio`
- `fuerza_dif`, `fuerza_porcambio`
- `flex_dif`, `flex_porcambio`

---

## Solución de Problemas

### Error: "No se encuentra el archivo CSV"
**Solución:** Asegúrate de que el archivo está en el lugar correcto:
- Para importación visual: selecciona el archivo descargado
- Para script Node.js: coloca `rml_datos.csv` en la raíz del proyecto

### Error: "Formato de archivo inválido"
**Solución:**
- Verifica que sea un archivo .csv (no .xlsx ni otro formato)
- Si es Excel, expórtalo como CSV desde Excel/Google Sheets

### Error: "Columnas no encontradas"
**Solución:**
- Abre el CSV en un editor de texto
- Verifica que la primera línea tenga los nombres de las columnas
- Asegúrate de que incluye al menos: `id_estudiante` y `nombres`

### Error: "ID duplicado"
**Solución:**
- El sistema hace un `upsert` (actualiza si existe, crea si no)
- Si hay IDs duplicados, se actualizará el registro existente

### No se ven los datos importados
**Solución:**
1. Refresca la página (F5)
2. Verifica en Gestión de Datos que aparezcan los estudiantes
3. Revisa el log de importación para ver si hubo errores

---

## Verificación Post-Importación

Después de importar, verifica que todo esté correcto:

1. **Cantidad de registros**
   - Ve a "Gestión de Datos"
   - Verifica que el número de estudiantes sea el esperado

2. **Calidad de datos**
   - Revisa algunos registros aleatorios
   - Verifica que los nombres, grados y datos físicos se hayan importado correctamente

3. **Prueba de login**
   - Cierra sesión
   - Intenta loguearte con algún `id_estudiante` del CSV
   - Verifica que muestre sus datos correctamente

---

## Contacto y Soporte

Si tienes problemas con la importación:

1. Revisa los logs en la consola del navegador (F12)
2. Toma captura del error
3. Verifica que las credenciales de Supabase en `.env` sean correctas

---

## Backup y Seguridad

**IMPORTANTE:** Antes de importar, considera:

1. **Hacer un backup** de los datos actuales en Supabase
2. **Probar primero** con un CSV pequeño (5-10 registros)
3. **Verificar la importación** antes de hacer una importación masiva completa

---

Última actualización: Octubre 2025
Autor: Equipo Aula Viva
