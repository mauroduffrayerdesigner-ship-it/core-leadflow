-- Criar tabela de campanhas
CREATE TABLE public.campanhas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'finalizada')),
  tema_id INTEGER REFERENCES public.temas_landing(id) DEFAULT 1,
  headline TEXT DEFAULT 'Transforme sua empresa com nossa solução',
  subtitulo TEXT DEFAULT 'Descubra como podemos ajudar você a alcançar seus objetivos',
  texto_cta TEXT DEFAULT 'Quero saber mais',
  logo_url TEXT,
  webhook_url TEXT,
  dominio_personalizado TEXT,
  configuracoes JSONB DEFAULT '{}'::jsonb,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para campanhas
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas campanhas"
  ON public.campanhas FOR SELECT
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem criar campanhas"
  ON public.campanhas FOR INSERT
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar suas campanhas"
  ON public.campanhas FOR UPDATE
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem deletar suas campanhas"
  ON public.campanhas FOR DELETE
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- Adicionar campanha_id à tabela leads
ALTER TABLE public.leads ADD COLUMN campanha_id UUID REFERENCES public.campanhas(id) ON DELETE SET NULL;

-- Criar índice para performance
CREATE INDEX idx_leads_campanha_id ON public.leads(campanha_id);

-- Criar tabela de métricas por campanha
CREATE TABLE public.metricas_campanha (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  data_metrica DATE DEFAULT CURRENT_DATE,
  total_leads INTEGER DEFAULT 0,
  leads_formulario INTEGER DEFAULT 0,
  leads_manual INTEGER DEFAULT 0,
  leads_csv INTEGER DEFAULT 0,
  leads_n8n INTEGER DEFAULT 0,
  leads_qualificados INTEGER DEFAULT 0,
  leads_convertidos INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campanha_id, data_metrica)
);

-- Adicionar RLS para metricas_campanha
ALTER TABLE public.metricas_campanha ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver métricas das suas campanhas"
  ON public.metricas_campanha FOR SELECT
  USING (campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

CREATE POLICY "Sistema pode inserir métricas"
  ON public.metricas_campanha FOR INSERT
  WITH CHECK (campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

CREATE POLICY "Sistema pode atualizar métricas"
  ON public.metricas_campanha FOR UPDATE
  USING (campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  ));

-- Migrar dados existentes: criar campanha padrão para cada cliente
INSERT INTO public.campanhas (cliente_id, nome, descricao, status, tema_id, headline, subtitulo, texto_cta, logo_url, webhook_url, dominio_personalizado, configuracoes)
SELECT 
  id as cliente_id,
  'Campanha Principal' as nome,
  'Campanha padrão migrada automaticamente' as descricao,
  'ativa' as status,
  tema_id,
  headline,
  subtitulo,
  texto_cta,
  logo_url,
  webhook_url,
  dominio_personalizado,
  configuracoes
FROM public.clientes;

-- Vincular todos os leads existentes à campanha padrão do seu cliente
UPDATE public.leads l
SET campanha_id = (
  SELECT c.id 
  FROM public.campanhas c 
  WHERE c.cliente_id = l.cliente_id 
  ORDER BY c.criado_em ASC 
  LIMIT 1
)
WHERE campanha_id IS NULL;

-- Criar view pública para landing pages por campanha
CREATE OR REPLACE VIEW public.landing_page_campanha_public AS
SELECT 
  c.id,
  c.nome,
  c.tema_id,
  c.headline,
  c.subtitulo,
  c.texto_cta,
  c.logo_url,
  c.webhook_url,
  c.dominio_personalizado,
  cl.lp_publica
FROM public.campanhas c
JOIN public.clientes cl ON c.cliente_id = cl.id
WHERE cl.lp_publica = true;

-- Criar trigger para atualizar data_atualizacao em campanhas
CREATE TRIGGER update_campanhas_updated_at
  BEFORE UPDATE ON public.campanhas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_data_atualizacao_column();

-- Criar função para atualizar métricas por campanha
CREATE OR REPLACE FUNCTION public.atualizar_metricas_campanha()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  campanha_row public.campanhas%ROWTYPE;
BEGIN
  -- Buscar dados da campanha
  SELECT * INTO campanha_row FROM public.campanhas WHERE id = COALESCE(NEW.campanha_id, OLD.campanha_id);
  
  IF campanha_row.id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Inserir ou atualizar métricas do dia
  INSERT INTO public.metricas_campanha (
    campanha_id, 
    data_metrica, 
    total_leads, 
    leads_formulario, 
    leads_manual, 
    leads_csv, 
    leads_n8n, 
    leads_qualificados, 
    leads_convertidos
  )
  SELECT 
    campanha_row.id,
    CURRENT_DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE origem = 'formulario'),
    COUNT(*) FILTER (WHERE origem = 'manual'),
    COUNT(*) FILTER (WHERE origem = 'csv'),
    COUNT(*) FILTER (WHERE origem = 'n8n'),
    COUNT(*) FILTER (WHERE status = 'qualificado'),
    COUNT(*) FILTER (WHERE status = 'convertido')
  FROM public.leads 
  WHERE campanha_id = campanha_row.id 
  AND DATE(data_criacao) = CURRENT_DATE
  ON CONFLICT (campanha_id, data_metrica) 
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
$$;

-- Criar trigger para atualizar métricas quando lead for inserido/atualizado
CREATE TRIGGER trigger_atualizar_metricas_campanha
  AFTER INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_metricas_campanha();