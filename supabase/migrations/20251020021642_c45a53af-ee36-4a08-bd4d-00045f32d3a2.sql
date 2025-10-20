-- Criar tabela de configurações WhatsApp
CREATE TABLE public.whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  
  -- Tipo de API
  api_type TEXT NOT NULL CHECK (api_type IN ('official', 'unofficial')),
  
  -- Configurações API Oficial (WhatsApp Business API)
  whatsapp_business_account_id TEXT,
  phone_number_id TEXT,
  access_token_secret TEXT,
  webhook_verify_token TEXT,
  
  -- Configurações API Não Oficial (Venom/Baileys)
  venom_session_name TEXT,
  venom_webhook_url TEXT,
  
  -- Integração Chatwoot
  chatwoot_url TEXT,
  chatwoot_account_id TEXT,
  chatwoot_inbox_id TEXT,
  chatwoot_api_key_secret TEXT,
  
  -- Status e Configurações
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'qr_pending')),
  qr_code TEXT,
  last_connection TIMESTAMPTZ,
  
  -- Templates e Mensagens
  template_saudacao TEXT,
  template_followup TEXT,
  auto_reply_enabled BOOLEAN DEFAULT false,
  
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de mensagens WhatsApp
CREATE TABLE public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Dados da Mensagem
  whatsapp_id TEXT,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  type TEXT CHECK (type IN ('text', 'image', 'document', 'audio', 'video')),
  content TEXT,
  media_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  
  -- Metadata
  from_number TEXT,
  to_number TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de templates WhatsApp
CREATE TABLE public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  
  -- Template Info
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('marketing', 'utility', 'authentication')),
  language TEXT DEFAULT 'pt_BR',
  
  -- Conteúdo
  header_type TEXT CHECK (header_type IN ('text', 'image', 'document', 'video')),
  header_content TEXT,
  body_content TEXT NOT NULL,
  footer_content TEXT,
  
  -- Variáveis suportadas
  variables JSONB DEFAULT '[]',
  
  -- Status API Oficial
  whatsapp_template_id TEXT,
  approval_status TEXT DEFAULT 'pending',
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies para whatsapp_config
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver configs de suas campanhas"
ON public.whatsapp_config FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar configs"
ON public.whatsapp_config FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar configs de suas campanhas"
ON public.whatsapp_config FOR UPDATE
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar configs de suas campanhas"
ON public.whatsapp_config FOR DELETE
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- RLS Policies para whatsapp_messages
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver mensagens de suas campanhas"
ON public.whatsapp_messages FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Sistema pode inserir mensagens"
ON public.whatsapp_messages FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- RLS Policies para whatsapp_templates
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver templates de suas campanhas"
ON public.whatsapp_templates FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar templates"
ON public.whatsapp_templates FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar templates de suas campanhas"
ON public.whatsapp_templates FOR UPDATE
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar templates de suas campanhas"
ON public.whatsapp_templates FOR DELETE
USING (
  campanha_id IN (
    SELECT c.id FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- Trigger para atualizar data de atualização
CREATE TRIGGER update_whatsapp_config_updated_at
BEFORE UPDATE ON public.whatsapp_config
FOR EACH ROW
EXECUTE FUNCTION public.update_data_atualizacao_column();