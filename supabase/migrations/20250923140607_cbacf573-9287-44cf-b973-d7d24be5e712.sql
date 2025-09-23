-- Expandir estrutura do banco para sistema SaaS completo

-- Adicionar campos para temas e domínios na tabela clientes
ALTER TABLE public.clientes 
ADD COLUMN tema_id INTEGER DEFAULT 1,
ADD COLUMN dominio_personalizado TEXT,
ADD COLUMN webhook_url TEXT,
ADD COLUMN configuracoes JSONB DEFAULT '{}';

-- Criar tabela de temas de landing pages
CREATE TABLE public.temas_landing (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preview_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir os 10 temas padrão
INSERT INTO public.temas_landing (nome, descricao) VALUES
('Moderno Minimalista', 'Design clean e moderno com foco na conversão'),
('Tech Startup', 'Visual inovador para empresas de tecnologia'),
('Corporativo Elegante', 'Design profissional para grandes empresas'),
('Criativo Colorido', 'Layout vibrante e criativo'),
('E-commerce Focus', 'Otimizado para vendas online'),
('Consultoria Premium', 'Elegante para serviços profissionais'),
('SaaS Moderno', 'Perfeito para produtos de software'),
('Saúde & Bem-estar', 'Design calmo e confiável'),
('Educação Online', 'Focado em cursos e educação'),
('Agência Digital', 'Criativo e impactante');

-- Adicionar campos de origem e status na tabela leads
ALTER TABLE public.leads 
ADD COLUMN origem TEXT DEFAULT 'formulario' CHECK (origem IN ('formulario', 'manual', 'csv', 'n8n')),
ADD COLUMN status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'convertido', 'descartado')),
ADD COLUMN notas TEXT,
ADD COLUMN data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Criar função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION public.update_data_atualizacao_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar data_atualizacao automaticamente
CREATE TRIGGER update_leads_data_atualizacao
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_data_atualizacao_column();

-- Criar tabela para estatísticas e métricas
CREATE TABLE public.metricas_cliente (
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

-- Políticas RLS para temas_landing (todos podem ler)
CREATE POLICY "Todos podem ver temas" ON public.temas_landing FOR SELECT USING (true);

-- Políticas RLS para metricas_cliente
CREATE POLICY "Usuários podem ver suas métricas" ON public.metricas_cliente 
FOR SELECT USING (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
);

CREATE POLICY "Sistema pode inserir métricas" ON public.metricas_cliente 
FOR INSERT WITH CHECK (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
);

CREATE POLICY "Sistema pode atualizar métricas" ON public.metricas_cliente 
FOR UPDATE USING (
  cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid())
);

-- Criar função para atualizar métricas automaticamente
CREATE OR REPLACE FUNCTION public.atualizar_metricas_cliente()
RETURNS TRIGGER AS $$
DECLARE
  cliente_row public.clientes%ROWTYPE;
BEGIN
  -- Buscar dados do cliente
  SELECT * INTO cliente_row FROM public.clientes WHERE id = COALESCE(NEW.cliente_id, OLD.cliente_id);
  
  -- Inserir ou atualizar métricas do dia
  INSERT INTO public.metricas_cliente (cliente_id, data_metrica, total_leads, leads_formulario, leads_manual, leads_csv, leads_n8n, leads_qualificados, leads_convertidos)
  SELECT 
    cliente_row.id,
    CURRENT_DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE origem = 'formulario'),
    COUNT(*) FILTER (WHERE origem = 'manual'),
    COUNT(*) FILTER (WHERE origem = 'csv'),
    COUNT(*) FILTER (WHERE origem = 'n8n'),
    COUNT(*) FILTER (WHERE status = 'qualificado'),
    COUNT(*) FILTER (WHERE status = 'convertido')
  FROM public.leads 
  WHERE cliente_id = cliente_row.id 
  AND DATE(data_criacao) = CURRENT_DATE
  ON CONFLICT (cliente_id, data_metrica) 
  DO UPDATE SET
    total_leads = EXCLUDED.total_leads,
    leads_formulario = EXCLUDED.leads_formulario,
    leads_manual = EXCLUDED.leads_manual,
    leads_csv = EXCLUDED.leads_csv,
    leads_n8n = EXCLUDED.leads_n8n,
    leads_qualificados = EXCLUDED.leads_qualificados,
    leads_convertidos = EXCLUDED.leads_convertidos;
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar métricas quando leads são inseridos/atualizados
CREATE TRIGGER trigger_atualizar_metricas_insert
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_metricas_cliente();

CREATE TRIGGER trigger_atualizar_metricas_update
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_metricas_cliente();