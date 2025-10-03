-- Remove the dangerous public access policy that exposes customer emails
DROP POLICY IF EXISTS "Public landing page data access" ON public.clientes;

-- Ensure landing_page_public view exists and only exposes safe fields
-- This view already exists but we'll recreate it to be explicit about what's exposed
DROP VIEW IF EXISTS public.landing_page_public CASCADE;

CREATE VIEW public.landing_page_public AS
SELECT 
  id,
  tema_id,
  lp_publica,
  headline,
  subtitulo,
  texto_cta,
  logo_url,
  webhook_url,
  dominio_personalizado,
  nome
FROM public.clientes
WHERE lp_publica = true;

-- Grant public access to the safe view only
GRANT SELECT ON public.landing_page_public TO anon;
GRANT SELECT ON public.landing_page_public TO authenticated;