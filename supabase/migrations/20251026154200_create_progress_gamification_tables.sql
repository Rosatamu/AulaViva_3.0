/*
  # Sistema de Progreso y Gamificación

  1. Propósito
    - Rastrear progreso de actividades físicas y nutricionales
    - Sistema de logros y gamificación
    - Estadísticas semanales
    - Todo accesible para usuarios anónimos (estudiantes con codigo_estudiante)

  2. Tablas Creadas
    - `user_progress` - Progreso general del usuario
    - `completed_activities` - Actividades físicas completadas
    - `completed_capsules` - Cápsulas educativas completadas
    - `nutrition_logs` - Registro de comidas
    - `achievements` - Logros obtenidos
    - `weekly_stats` - Estadísticas semanales

  3. Seguridad
    - Acceso COMPLETO para usuarios anónimos (lectura y escritura)
    - Permite a estudiantes usar el sistema sin autenticación
    - Usuarios autenticados mantienen acceso completo
*/

-- ============================================
-- TABLA: user_progress
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  current_level integer DEFAULT 1,
  total_points integer DEFAULT 0,
  activities_completed integer DEFAULT 0,
  capsules_completed integer DEFAULT 0,
  nutrition_logs_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read own progress"
  ON user_progress FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert own progress"
  ON user_progress FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update own progress"
  ON user_progress FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all progress"
  ON user_progress FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TABLA: completed_activities
-- ============================================
CREATE TABLE IF NOT EXISTS completed_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  activity_id text NOT NULL,
  activity_name text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  duration_minutes integer,
  calories_burned integer,
  notes text
);

CREATE INDEX IF NOT EXISTS idx_completed_activities_user_id ON completed_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_activities_completed_at ON completed_activities(completed_at);

ALTER TABLE completed_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read activities"
  ON completed_activities FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert activities"
  ON completed_activities FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update activities"
  ON completed_activities FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all activities"
  ON completed_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TABLA: completed_capsules
-- ============================================
CREATE TABLE IF NOT EXISTS completed_capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  capsule_id text NOT NULL,
  capsule_title text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  score integer,
  time_spent_seconds integer
);

CREATE INDEX IF NOT EXISTS idx_completed_capsules_user_id ON completed_capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_capsules_completed_at ON completed_capsules(completed_at);

ALTER TABLE completed_capsules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read capsules"
  ON completed_capsules FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert capsules"
  ON completed_capsules FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update capsules"
  ON completed_capsules FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all capsules"
  ON completed_capsules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TABLA: nutrition_logs
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  meal_type text NOT NULL, -- breakfast, lunch, dinner, snack
  meal_name text NOT NULL,
  calories integer,
  protein_grams numeric,
  carbs_grams numeric,
  fat_grams numeric,
  logged_at timestamptz DEFAULT now(),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_logged_at ON nutrition_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_meal_type ON nutrition_logs(meal_type);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read nutrition logs"
  ON nutrition_logs FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert nutrition logs"
  ON nutrition_logs FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update nutrition logs"
  ON nutrition_logs FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all nutrition logs"
  ON nutrition_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TABLA: achievements
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  achievement_type text NOT NULL, -- activity, nutrition, learning, special
  achievement_name text NOT NULL,
  achievement_description text,
  points_awarded integer DEFAULT 0,
  earned_at timestamptz DEFAULT now(),
  icon text
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read achievements"
  ON achievements FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert achievements"
  ON achievements FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can manage all achievements"
  ON achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TABLA: weekly_stats
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,
  activities_count integer DEFAULT 0,
  total_exercise_minutes integer DEFAULT 0,
  total_calories_burned integer DEFAULT 0,
  nutrition_logs_count integer DEFAULT 0,
  capsules_completed integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX IF NOT EXISTS idx_weekly_stats_user_id ON weekly_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_stats_week_start ON weekly_stats(week_start_date);

ALTER TABLE weekly_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read weekly stats"
  ON weekly_stats FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert weekly stats"
  ON weekly_stats FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update weekly stats"
  ON weekly_stats FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all weekly stats"
  ON weekly_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
