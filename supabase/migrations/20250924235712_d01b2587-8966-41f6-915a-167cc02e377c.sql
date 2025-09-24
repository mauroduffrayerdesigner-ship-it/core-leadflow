-- Criar tabela para tags de leads
CREATE TABLE public.lead_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  cor TEXT NOT NULL DEFAULT '#3B82F6',
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para relacionamento entre leads e tags
CREATE TABLE public.lead_tag_relations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lead_id, tag_id)
);

-- Criar tabela para histórico de interações com leads
CREATE TABLE public.lead_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  tipo TEXT NOT NULL, -- 'status_change', 'email_sent', 'note_added', 'tag_added', 'tag_removed'
  descricao TEXT NOT NULL,
  dados_extras JSONB,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  criado_por UUID
);

-- Criar tabela para templates de email
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  assunto TEXT NOT NULL,
  corpo TEXT NOT NULL,
  variaveis TEXT[] DEFAULT ARRAY['{{nome}}', '{{email}}', '{{telefone}}'],
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para lead_tags
CREATE POLICY "Todos podem ver tags" ON public.lead_tags FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar tags" ON public.lead_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar tags" ON public.lead_tags FOR UPDATE USING (true);
CREATE POLICY "Usuários podem deletar tags" ON public.lead_tags FOR DELETE USING (true);

-- Políticas para lead_tag_relations
CREATE POLICY "Ver relações de tags dos próprios leads" ON public.lead_tag_relations 
FOR SELECT USING (
  lead_id IN (
    SELECT leads.id FROM leads 
    INNER JOIN clientes ON leads.cliente_id = clientes.id 
    WHERE clientes.user_id = auth.uid()
  )
);

CREATE POLICY "Criar relações de tags para próprios leads" ON public.lead_tag_relations 
FOR INSERT WITH CHECK (
  lead_id IN (
    SELECT leads.id FROM leads 
    INNER JOIN clientes ON leads.cliente_id = clientes.id 
    WHERE clientes.user_id = auth.uid()
  )
);

CREATE POLICY "Deletar relações de tags dos próprios leads" ON public.lead_tag_relations 
FOR DELETE USING (
  lead_id IN (
    SELECT leads.id FROM leads 
    INNER JOIN clientes ON leads.cliente_id = clientes.id 
    WHERE clientes.user_id = auth.uid()
  )
);

-- Políticas para lead_interactions
CREATE POLICY "Ver interações dos próprios leads" ON public.lead_interactions 
FOR SELECT USING (
  lead_id IN (
    SELECT leads.id FROM leads 
    INNER JOIN clientes ON leads.cliente_id = clientes.id 
    WHERE clientes.user_id = auth.uid()
  )
);

CREATE POLICY "Criar interações para próprios leads" ON public.lead_interactions 
FOR INSERT WITH CHECK (
  lead_id IN (
    SELECT leads.id FROM leads 
    INNER JOIN clientes ON leads.cliente_id = clientes.id 
    WHERE clientes.user_id = auth.uid()
  )
);

-- Políticas para email_templates
CREATE POLICY "Todos podem ver templates" ON public.email_templates FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar templates" ON public.email_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar templates" ON public.email_templates FOR UPDATE USING (true);
CREATE POLICY "Usuários podem deletar templates" ON public.email_templates FOR DELETE USING (true);

-- Inserir algumas tags padrão
INSERT INTO public.lead_tags (nome, cor) VALUES 
('Quente', '#EF4444'),
('Morno', '#F59E0B'),
('Frio', '#3B82F6'),
('Interessado', '#10B981'),
('Não Interessado', '#6B7280'),
('Follow-up', '#8B5CF6');

-- Inserir alguns templates de email padrão
INSERT INTO public.email_templates (nome, assunto, corpo) VALUES 
('Primeira Abordagem', 'Olá {{nome}}, vamos conversar?', 'Olá {{nome}},\n\nObrigado pelo seu interesse em nossos serviços!\n\nGostaria de agendar uma conversa para entender melhor suas necessidades?\n\nAguardo seu retorno!\n\nAtenciosamente'),
('Follow-up', 'Re: Nossa conversa - {{nome}}', 'Olá {{nome}},\n\nEspero que esteja bem!\n\nGostaria de dar continuidade à nossa conversa sobre nossos serviços.\n\nTem alguns minutos para conversarmos?\n\nAguardo seu retorno!\n\nAtenciosamente'),
('Proposta Enviada', 'Proposta Comercial - {{nome}}', 'Olá {{nome}},\n\nConforme conversamos, segue nossa proposta comercial em anexo.\n\nEstou à disposição para esclarecer qualquer dúvida.\n\nAguardo seu retorno!\n\nAtenciosamente');

-- Função para registrar interações automaticamente
CREATE OR REPLACE FUNCTION public.registrar_interacao_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Registrar mudança de status
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.lead_interactions (lead_id, tipo, descricao, dados_extras)
    VALUES (
      NEW.id, 
      'status_change', 
      'Status alterado de "' || OLD.status || '" para "' || NEW.status || '"',
      jsonb_build_object('status_anterior', OLD.status, 'status_novo', NEW.status)
    );
  END IF;
  
  -- Registrar adição de notas
  IF TG_OP = 'UPDATE' AND (OLD.notas IS NULL OR OLD.notas = '') AND NEW.notas IS NOT NULL AND NEW.notas != '' THEN
    INSERT INTO public.lead_interactions (lead_id, tipo, descricao)
    VALUES (NEW.id, 'note_added', 'Nota adicionada');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para registrar interações
CREATE TRIGGER trigger_registrar_interacao_lead
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_interacao_lead();