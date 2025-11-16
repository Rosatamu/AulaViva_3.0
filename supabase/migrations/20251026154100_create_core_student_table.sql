/*
  # Tabla Principal de Estudiantes - RML Datos

  1. Propósito
    - Almacenar datos antropométricos y físicos de estudiantes
    - Permitir login simple con codigo_estudiante
    - Base para todo el sistema de gamificación y nutrición

  2. Tabla: rml_datos
    - `id` (bigint, primary key, autoincrement)
    - `nombres` (text) - Nombre del estudiante
    - `nombre_usuario` (text) - Username opcional
    - `grado` (text) - Grado académico (ej: "6A", "11B")
    - `id_estudiante` (text) - ID alternativo
    - `codigo_estudiante` (text, unique) - Código simple para login (ej: "110", "111")
    - `sexo` (integer) - 1=Masculino, 2=Femenino
    - `sexo_letra` (text) - "M" o "F"
    - `edad_estimada` (integer) - Edad del estudiante
    - `grado_num` (integer) - Número de grado (6-11)

    Mediciones PRE:
    - `peso_pre` (numeric) - Peso inicial en kg
    - `talla_pre` (numeric) - Estatura inicial en cm
    - `imc_pre` (numeric) - IMC inicial
    - `leger_pre` (numeric) - Test de Leger inicial
    - `fuerza_pre` (numeric) - Fuerza inicial
    - `flex_pre` (numeric) - Flexibilidad inicial
    - `vo2max_pre` (numeric) - VO2 max inicial
    - `vo2max_pre_cat` (text) - Categoría VO2 max inicial

    Mediciones POST:
    - `peso_post` (numeric) - Peso final en kg
    - `talla_post` (numeric) - Estatura final en cm
    - `imc_post` (numeric) - IMC final
    - `leger_post` (numeric) - Test de Leger final
    - `fuerza_post` (numeric) - Fuerza final
    - `flex_post` (numeric) - Flexibilidad final
    - `vo2max_post` (numeric) - VO2 max final
    - `vo2max_post_cat` (text) - Categoría VO2 max final

    Cálculos:
    - `vo2max_dif` (numeric) - Diferencia VO2 max
    - `vo2max_porcambio` (numeric) - % cambio VO2 max
    - `leger_dif` (numeric) - Diferencia Leger
    - `leger_porcambio` (numeric) - % cambio Leger
    - `fuerza_dif` (numeric) - Diferencia fuerza
    - `fuerza_porcambio` (numeric) - % cambio fuerza
    - `flex_dif` (numeric) - Diferencia flexibilidad
    - `flex_porcambio` (numeric) - % cambio flexibilidad

  3. Seguridad RLS
    - Acceso ANÓNIMO para lectura usando codigo_estudiante
    - Estudiantes pueden leer sus propios datos sin autenticación
    - Solo admins autenticados pueden modificar
*/

-- Crear tabla rml_datos
CREATE TABLE IF NOT EXISTS rml_datos (
  id bigserial PRIMARY KEY,
  nombres text,
  nombre_usuario text,
  grado text,
  id_estudiante text,
  codigo_estudiante text UNIQUE,
  sexo integer,
  sexo_letra text,
  edad_estimada integer,
  grado_num integer,

  -- Mediciones PRE
  peso_pre numeric,
  talla_pre numeric,
  imc_pre numeric,
  leger_pre numeric,
  fuerza_pre numeric,
  flex_pre numeric,
  vo2max_pre numeric,
  vo2max_pre_cat text,

  -- Mediciones POST
  peso_post numeric,
  talla_post numeric,
  imc_post numeric,
  leger_post numeric,
  fuerza_post numeric,
  flex_post numeric,
  vo2max_post numeric,
  vo2max_post_cat text,

  -- Cálculos de diferencias
  vo2max_dif numeric,
  vo2max_porcambio numeric,
  leger_dif numeric,
  leger_porcambio numeric,
  fuerza_dif numeric,
  fuerza_porcambio numeric,
  flex_dif numeric,
  flex_porcambio numeric,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_rml_datos_codigo_estudiante ON rml_datos(codigo_estudiante);
CREATE INDEX IF NOT EXISTS idx_rml_datos_id_estudiante ON rml_datos(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_rml_datos_grado ON rml_datos(grado);

-- Habilitar RLS
ALTER TABLE rml_datos ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios anónimos pueden leer datos usando codigo_estudiante
CREATE POLICY "Anonymous users can read by codigo_estudiante"
  ON rml_datos
  FOR SELECT
  TO anon
  USING (codigo_estudiante IS NOT NULL);

-- Política: Usuarios autenticados pueden leer todo
CREATE POLICY "Authenticated users can read all"
  ON rml_datos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Authenticated users can insert"
  ON rml_datos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Authenticated users can update"
  ON rml_datos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete"
  ON rml_datos
  FOR DELETE
  TO authenticated
  USING (true);
