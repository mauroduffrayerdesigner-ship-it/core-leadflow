-- Adicionar colunas em campanhas para configuração de email
ALTER TABLE public.campanhas 
ADD COLUMN IF NOT EXISTS email_provider TEXT DEFAULT 'brevo',
ADD COLUMN IF NOT EXISTS email_remetente TEXT,
ADD COLUMN IF NOT EXISTS email_nome_remetente TEXT,
ADD COLUMN IF NOT EXISTS email_auto_envio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS template_boas_vindas_id UUID REFERENCES public.email_templates(id);

-- Adicionar colunas em email_templates
ALTER TABLE public.email_templates
ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'boas_vindas',
ADD COLUMN IF NOT EXISTS campanha_id UUID REFERENCES public.campanhas(id);

-- Criar tabela de logs de email
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  destinatario_email TEXT NOT NULL,
  destinatario_nome TEXT,
  assunto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'enviado',
  provider_message_id TEXT,
  erro TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para email_logs
CREATE POLICY "Usuários podem ver logs de emails de suas campanhas"
ON public.email_logs
FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Sistema pode inserir logs de email"
ON public.email_logs
FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_email_logs_campanha ON public.email_logs(campanha_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_lead ON public.email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_criado_em ON public.email_logs(criado_em DESC);