-- Expandir estrutura do banco para sistema SaaS completo (verificando existência)

-- Verificar e adicionar campos na tabela clientes se não existirem
DO $$ 
BEGIN
  -- Adicionar tema_id se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'tema_id') THEN
    ALTER TABLE public.clientes ADD COLUMN tema_id INTEGER DEFAULT 1;
  END IF;
  
  -- Adicionar dominio_personalizado se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'dominio_personalizado') THEN
    ALTER TABLE public.clientes ADD COLUMN dominio_personalizado TEXT;
  END IF;
  
  -- Adicionar webhook_url se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'webhook_url') THEN
    ALTER TABLE public.clientes ADD COLUMN webhook_url TEXT;
  END IF;
  
  -- Adicionar configuracoes se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'configuracoes') THEN
    ALTER TABLE public.clientes ADD COLUMN configuracoes JSONB DEFAULT '{}';
  END IF;
END $$;

-- Criar tabela de temas de landing pages se não existir
CREATE TABLE IF NOT EXISTS public.temas_landing (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preview_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir os 10 temas padrão se a tabela estiver vazia
INSERT INTO public.temas_landing (nome, descricao) 
SELECT * FROM (VALUES
  ('Moderno Minimalista', 'Design clean e moderno com foco na conversão'),
  ('Tech Startup', 'Visual inovador para empresas de tecnologia'),
  ('Corporativo Elegante', 'Design profissional para grandes empresas'),
  ('Criativo Colorido', 'Layout vibrante e criativo'),
  ('E-commerce Focus', 'Otimizado para vendas online'),
  ('Consultoria Premium', 'Elegante para serviços profissionais'),
  ('SaaS Moderno', 'Perfeito para produtos de software'),
  ('Saúde & Bem-estar', 'Design calmo e confiável'),
  ('Educação Online', 'Focado em cursos e educação'),
  ('Agência Digital', 'Criativo e impactante')
) AS t(nome, descricao)
WHERE NOT EXISTS (SELECT 1 FROM public.temas_landing);

-- Verificar e adicionar campos na tabela leads se não existirem
DO $$ 
BEGIN
  -- Adicionar origem se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'origem') THEN
    ALTER TABLE public.leads ADD COLUMN origem TEXT DEFAULT 'formulario' CHECK (origem IN ('formulario', 'manual', 'csv', 'n8n'));
  END IF;
  
  -- Adicionar status se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
    ALTER TABLE public.leads ADD COLUMN status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'convertido', 'descartado'));
  END IF;
  
  -- Adicionar notas se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notas') THEN
    ALTER TABLE public.leads ADD COLUMN notas TEXT;
  END IF;
  
  -- Adicionar data_atualizacao se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'data_atualizacao') THEN
    ALTER TABLE public.leads ADD COLUMN data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Criar função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION public.update_data_atualizacao_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar data_atualizacao automaticamente se não existir
DROP TRIGGER IF EXISTS update_leads_data_atualizacao ON public.leads;
CREATE TRIGGER update_leads_data_atualizacao
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_data_atualizacao_column();

-- Criar tabela para estatísticas e métricas se não existir
CREATE TABLE IF NOT EXISTS public.metricas_cliente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_metrica DATE DEFAULT CURRENT_DATE,
  total_leads INTEGER DEFAULT 0,
  leads_formulario INTEGER DEFAULT 0,
  leads_manual INTEGER DEFAULT 0,
  leads_csv INTEGER DEFAULT 0,
  leads_n8n INTEGER DEFAULT 0,
  leads_qualificados INTEGER DEFAULT 0,
  leads_convertidos INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cliente_id, data_metrica)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.temas_landing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_cliente ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS se não existirem
DO $$
BEGIN
  -- Política para temas_landing
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'temas_landing' AND policyname = 'Todos podem ver temas') THEN
    CREATE POLICY "Todos podem ver temas" ON public.temas_landing FOR SELECT USING (true);
  END IF;
  
  -- Políticas para metricas_cliente
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metricas_cliente' AND policyname = 'Usuários podem ver suas métricas') THEN
    CREATE POLICY "Usuários podem ver suas métricas" ON public.metricas_cliente 
    FOR SELECT USING (
      cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metricas_cliente' AND policyname = 'Sistema pode inserir métricas') THEN
    CREATE POLICY "Sistema pode inserir métricas" ON public.metricas_cliente 
    FOR INSERT WITH CHECK (
      cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'metricas_cliente' AND policyname = 'Sistema pode atualizar métricas') THEN
    CREATE POLICY "Sistema pode atualizar métricas" ON public.metricas_cliente 
    FOR UPDATE USING (
      cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
    );
  END IF;
END $$;