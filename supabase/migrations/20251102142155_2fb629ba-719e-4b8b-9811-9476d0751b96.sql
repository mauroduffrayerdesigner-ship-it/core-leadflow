-- Criar tabela para landing pages customizadas
CREATE TABLE IF NOT EXISTS public.landing_pages_custom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id uuid REFERENCES public.campanhas(id) ON DELETE CASCADE,
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  html_content text NOT NULL,
  css_content text,
  js_content text,
  ativo boolean DEFAULT true,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now(),
  CONSTRAINT landing_pages_custom_campanha_or_cliente CHECK (
    (campanha_id IS NOT NULL AND cliente_id IS NULL) OR 
    (campanha_id IS NULL AND cliente_id IS NOT NULL)
  )
);

-- RLS policies
ALTER TABLE public.landing_pages_custom ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas landing pages custom"
  ON public.landing_pages_custom
  FOR SELECT
  USING (
    (campanha_id IN (
      SELECT c.id FROM campanhas c
      JOIN clientes cl ON c.cliente_id = cl.id
      WHERE cl.user_id = auth.uid()
    )) OR
    (cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Usuários podem criar landing pages custom"
  ON public.landing_pages_custom
  FOR INSERT
  WITH CHECK (
    (campanha_id IN (
      SELECT c.id FROM campanhas c
      JOIN clientes cl ON c.cliente_id = cl.id
      WHERE cl.user_id = auth.uid()
    )) OR
    (cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Usuários podem atualizar suas landing pages custom"
  ON public.landing_pages_custom
  FOR UPDATE
  USING (
    (campanha_id IN (
      SELECT c.id FROM campanhas c
      JOIN clientes cl ON c.cliente_id = cl.id
      WHERE cl.user_id = auth.uid()
    )) OR
    (cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Usuários podem deletar suas landing pages custom"
  ON public.landing_pages_custom
  FOR DELETE
  USING (
    (campanha_id IN (
      SELECT c.id FROM campanhas c
      JOIN clientes cl ON c.cliente_id = cl.id
      WHERE cl.user_id = auth.uid()
    )) OR
    (cliente_id IN (
      SELECT id FROM clientes WHERE user_id = auth.uid()
    ))
  );

-- Adicionar campo custom_landing_id nas tabelas campanhas e clientes
ALTER TABLE public.campanhas ADD COLUMN IF NOT EXISTS custom_landing_id uuid REFERENCES public.landing_pages_custom(id) ON DELETE SET NULL;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS custom_landing_id uuid REFERENCES public.landing_pages_custom(id) ON DELETE SET NULL;

-- Criar view pública para landing pages custom de campanha
CREATE OR REPLACE VIEW public.landing_page_campanha_custom_public AS
SELECT 
  lpc.id,
  lpc.html_content,
  lpc.css_content,
  lpc.js_content,
  c.id as campanha_id,
  c.nome,
  c.status
FROM public.landing_pages_custom lpc
JOIN public.campanhas c ON lpc.campanha_id = c.id
WHERE lpc.ativo = true AND c.status = 'ativa';

-- Criar view pública para landing pages custom de cliente
CREATE OR REPLACE VIEW public.landing_page_cliente_custom_public AS
SELECT 
  lpc.id,
  lpc.html_content,
  lpc.css_content,
  lpc.js_content,
  cl.id as cliente_id,
  cl.nome
FROM public.landing_pages_custom lpc
JOIN public.clientes cl ON lpc.cliente_id = cl.id
WHERE lpc.ativo = true AND cl.lp_publica = true;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_landing_custom_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_landing_custom_updated_at
  BEFORE UPDATE ON public.landing_pages_custom
  FOR EACH ROW
  EXECUTE FUNCTION public.update_landing_custom_updated_at();