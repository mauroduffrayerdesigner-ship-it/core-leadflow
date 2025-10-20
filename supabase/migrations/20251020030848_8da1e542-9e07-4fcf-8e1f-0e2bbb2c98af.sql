-- Criar tabela de conversas do WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Status da conversa
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  
  -- Última interação
  last_message_at TIMESTAMPTZ,
  last_message_content TEXT,
  last_message_direction TEXT CHECK (last_message_direction IN ('inbound', 'outbound')),
  
  -- Contadores
  unread_count INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  -- Metadata
  assigned_to UUID,
  tags TEXT[],
  notes TEXT,
  
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(campanha_id, lead_id)
);

-- Habilitar RLS
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para whatsapp_conversations
CREATE POLICY "Usuários podem ver conversas de suas campanhas"
ON public.whatsapp_conversations
FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar conversas"
ON public.whatsapp_conversations
FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar conversas de suas campanhas"
ON public.whatsapp_conversations
FOR UPDATE
USING (
  campanha_id IN (
    SELECT c.id
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar conversas de suas campanhas"
ON public.whatsapp_conversations
FOR DELETE
USING (
  campanha_id IN (
    SELECT c.id
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- Atualizar tabela whatsapp_messages
ALTER TABLE public.whatsapp_messages 
ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_campanha ON public.whatsapp_conversations(campanha_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_lead ON public.whatsapp_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_status ON public.whatsapp_conversations(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_whatsapp_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_conversations_updated_at
BEFORE UPDATE ON public.whatsapp_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_whatsapp_conversation_updated_at();

-- Habilitar Realtime para whatsapp_messages e whatsapp_conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_conversations;