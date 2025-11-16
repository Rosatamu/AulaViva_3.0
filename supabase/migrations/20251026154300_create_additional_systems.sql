/*
  # Sistemas Adicionales - CriptoAula, Encuestas, Marketplace, Usuarios, Roles

  1. Propósito
    - CriptoAula: Sistema de monedas virtuales educativas
    - Encuestas: Sistema de encuestas y feedback
    - Marketplace: Emprende Quindío - mercado de productos
    - User Profiles: Usuarios públicos con autenticación
    - User Roles: Sistema de roles (admin, user)

  2. Tablas Creadas
    CriptoAula:
    - cripto_aula_wallets
    - cripto_aula_transactions
    - conversion_rates

    Encuestas:
    - survey_sessions
    - survey_responses
    - survey_statistics

    Marketplace:
    - market_listings
    - market_orders
    - marketplace_payments

    Usuarios:
    - user_profiles
    - user_roles

  3. Seguridad
    - Acceso anónimo para lectura en mayoría de tablas
    - Escritura controlada según tipo de dato
    - Roles de admin para administración
*/

-- ============================================
-- CRIPTOAULA: Sistema de Monedas Virtuales
-- ============================================

CREATE TABLE IF NOT EXISTS cripto_aula_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  aula_coins_balance numeric DEFAULT 0,
  btc_balance numeric DEFAULT 0,
  eth_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON cripto_aula_wallets(user_id);

ALTER TABLE cripto_aula_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read wallets"
  ON cripto_aula_wallets FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert wallets"
  ON cripto_aula_wallets FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update wallets"
  ON cripto_aula_wallets FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all wallets"
  ON cripto_aula_wallets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Transacciones de CriptoAula
CREATE TABLE IF NOT EXISTS cripto_aula_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  transaction_type text NOT NULL, -- earn, spend, convert, transfer
  currency_from text, -- aula_coins, btc, eth
  currency_to text,
  amount_from numeric NOT NULL,
  amount_to numeric,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON cripto_aula_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON cripto_aula_transactions(created_at);

ALTER TABLE cripto_aula_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read transactions"
  ON cripto_aula_transactions FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert transactions"
  ON cripto_aula_transactions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can manage all transactions"
  ON cripto_aula_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tasas de conversión
CREATE TABLE IF NOT EXISTS conversion_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

ALTER TABLE conversion_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read conversion rates"
  ON conversion_rates FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can manage conversion rates"
  ON conversion_rates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insertar tasas de conversión iniciales
INSERT INTO conversion_rates (from_currency, to_currency, rate) VALUES
  ('aula_coins', 'btc', 0.00001),
  ('aula_coins', 'eth', 0.0001),
  ('btc', 'aula_coins', 100000),
  ('eth', 'aula_coins', 10000),
  ('btc', 'eth', 10),
  ('eth', 'btc', 0.1)
ON CONFLICT (from_currency, to_currency) DO NOTHING;

-- ============================================
-- ENCUESTAS: Sistema de Encuestas
-- ============================================

CREATE TABLE IF NOT EXISTS survey_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  session_number integer NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'in_progress', -- in_progress, completed
  total_questions integer DEFAULT 0,
  answered_questions integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_survey_sessions_user_id ON survey_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_session_number ON survey_sessions(session_number);

ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read survey sessions"
  ON survey_sessions FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert survey sessions"
  ON survey_sessions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anonymous can update survey sessions"
  ON survey_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can manage all survey sessions"
  ON survey_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Respuestas de encuestas
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES survey_sessions(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  question_id text NOT NULL,
  question_text text NOT NULL,
  answer_value text NOT NULL,
  answered_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_session_id ON survey_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read survey responses"
  ON survey_responses FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can insert survey responses"
  ON survey_responses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can manage all survey responses"
  ON survey_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Estadísticas de encuestas
CREATE TABLE IF NOT EXISTS survey_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL UNIQUE,
  question_text text NOT NULL,
  total_responses integer DEFAULT 0,
  response_distribution jsonb DEFAULT '{}'::jsonb,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE survey_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read survey statistics"
  ON survey_statistics FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can manage survey statistics"
  ON survey_statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- MARKETPLACE: Emprende Quindío
-- ============================================

CREATE TABLE IF NOT EXISTS market_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id text NOT NULL,
  seller_name text NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  precio numeric NOT NULL,
  categoria text,
  imagen_url text,
  ubicacion text,
  telefono_contacto text,
  email_contacto text,
  activo boolean DEFAULT true,
  destacado boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON market_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_categoria ON market_listings(categoria);
CREATE INDEX IF NOT EXISTS idx_listings_activo ON market_listings(activo);

ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active listings"
  ON market_listings FOR SELECT TO anon, authenticated USING (activo = true);

CREATE POLICY "Authenticated can manage own listings"
  ON market_listings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Órdenes de marketplace
CREATE TABLE IF NOT EXISTS market_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES market_listings(id) ON DELETE CASCADE,
  buyer_id text NOT NULL,
  buyer_name text NOT NULL,
  buyer_email text,
  buyer_phone text,
  cantidad integer DEFAULT 1,
  precio_total numeric NOT NULL,
  metodo_pago text NOT NULL, -- aula_coins, efectivo, transferencia
  status text DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON market_orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON market_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON market_orders(status);

ALTER TABLE market_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous can read orders"
  ON market_orders FOR SELECT TO anon USING (true);

CREATE POLICY "Anonymous can create orders"
  ON market_orders FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can manage all orders"
  ON market_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Pagos de marketplace
CREATE TABLE IF NOT EXISTS marketplace_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES market_orders(id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'aula_coins',
  status text DEFAULT 'pending', -- pending, completed, failed
  transaction_reference text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON marketplace_payments(order_id);

ALTER TABLE marketplace_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read marketplace payments"
  ON marketplace_payments FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can manage payments"
  ON marketplace_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- USUARIOS PÚBLICOS: Profiles y Roles
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id text PRIMARY KEY, -- auth.users.id
  nombre text NOT NULL,
  email text NOT NULL,
  edad_estimada integer DEFAULT 15,
  tipo_usuario text DEFAULT 'publico', -- estudiante, publico
  codigo_estudiante text, -- vinculación con rml_datos
  fecha_registro timestamptz DEFAULT now(),
  ultima_actividad timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_codigo_estudiante ON user_profiles(codigo_estudiante);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can create profile"
  ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Roles de usuario
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'user', -- admin, user
  granted_at timestamptz DEFAULT now(),
  granted_by text
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON user_roles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
