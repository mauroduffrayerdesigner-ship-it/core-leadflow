-- ============================================
-- SECURITY FIXES - CORE Capture SaaS (FIXED)
-- ============================================

-- 1. CREATE ROLE-BASED ACCESS CONTROL (RBAC)
-- ============================================
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'manager');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 2. FIX EMAIL_TEMPLATES RLS POLICIES
-- ============================================
-- First, associate orphan templates with first available campaign
UPDATE public.email_templates 
SET campanha_id = (SELECT id FROM public.campanhas LIMIT 1)
WHERE campanha_id IS NULL;

-- Only make NOT NULL if no orphans remain
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.email_templates WHERE campanha_id IS NULL) THEN
    ALTER TABLE public.email_templates ALTER COLUMN campanha_id SET NOT NULL;
  END IF;
END $$;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Todos podem ver templates" ON public.email_templates;
DROP POLICY IF EXISTS "Usuários podem criar templates" ON public.email_templates;
DROP POLICY IF EXISTS "Usuários podem atualizar templates" ON public.email_templates;
DROP POLICY IF EXISTS "Usuários podem deletar templates" ON public.email_templates;

-- Create restrictive ownership-based policies
CREATE POLICY "Users can view own campaign templates"
ON public.email_templates FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id FROM campanhas c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create templates for own campaigns"
ON public.email_templates FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id FROM campanhas c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own campaign templates"
ON public.email_templates FOR UPDATE
USING (
  campanha_id IN (
    SELECT c.id FROM campanhas c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own campaign templates"
ON public.email_templates FOR DELETE
USING (
  campanha_id IN (
    SELECT c.id FROM campanhas c
    JOIN clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- 3. FIX LEAD_TAGS RLS POLICIES
-- ============================================
-- Add cliente_id to track ownership
ALTER TABLE public.lead_tags 
ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE;

-- Update existing tags to associate with first client (migration safety)
UPDATE public.lead_tags 
SET cliente_id = (SELECT id FROM public.clientes LIMIT 1)
WHERE cliente_id IS NULL;

-- Only make NOT NULL if no orphans remain
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.lead_tags WHERE cliente_id IS NULL) THEN
    ALTER TABLE public.lead_tags ALTER COLUMN cliente_id SET NOT NULL;
  END IF;
END $$;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Todos podem ver tags" ON public.lead_tags;
DROP POLICY IF EXISTS "Usuários podem criar tags" ON public.lead_tags;
DROP POLICY IF EXISTS "Usuários podem atualizar tags" ON public.lead_tags;
DROP POLICY IF EXISTS "Usuários podem deletar tags" ON public.lead_tags;

-- Create restrictive ownership-based policies
CREATE POLICY "Users can view own client tags"
ON public.lead_tags FOR SELECT
USING (
  cliente_id IN (
    SELECT id FROM clientes WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tags for own clients"
ON public.lead_tags FOR INSERT
WITH CHECK (
  cliente_id IN (
    SELECT id FROM clientes WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own client tags"
ON public.lead_tags FOR UPDATE
USING (
  cliente_id IN (
    SELECT id FROM clientes WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own client tags"
ON public.lead_tags FOR DELETE
USING (
  cliente_id IN (
    SELECT id FROM clientes WHERE user_id = auth.uid()
  )
);

-- 4. DROP SECURITY DEFINER VIEWS (SECURITY RISK)
-- ============================================
DROP VIEW IF EXISTS public.landing_page_campanha_public CASCADE;
DROP VIEW IF EXISTS public.landing_page_public CASCADE;

-- Create safe views without SECURITY DEFINER - only public data, no webhook_url
CREATE VIEW public.landing_page_campanha_public AS
SELECT 
  c.id,
  c.nome,
  c.headline,
  c.subtitulo,
  c.texto_cta,
  c.logo_url,
  c.tema_id,
  c.status
FROM public.campanhas c
WHERE c.status = 'ativa';

CREATE VIEW public.landing_page_public AS
SELECT 
  cl.id,
  cl.nome,
  cl.headline,
  cl.subtitulo,
  cl.texto_cta,
  cl.logo_url,
  cl.tema_id
FROM public.clientes cl
WHERE cl.lp_publica = true;

-- 5. FIX DATABASE FUNCTIONS - ADD SEARCH_PATH
-- ============================================
CREATE OR REPLACE FUNCTION public.update_whatsapp_conversation_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.registrar_interacao_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;