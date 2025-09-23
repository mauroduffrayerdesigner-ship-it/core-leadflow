-- Tabela de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  logo_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela de leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  interesse TEXT,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Clientes veem apenas seus dados"
ON clientes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Clientes podem inserir seus dados"
ON clientes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clientes podem atualizar seus dados"
ON clientes FOR UPDATE
USING (auth.uid() = user_id);

-- Políticas RLS para leads
CREATE POLICY "Leads do cliente"
ON leads FOR ALL
USING (auth.uid() IN (
  SELECT user_id FROM clientes WHERE id = leads.cliente_id
));