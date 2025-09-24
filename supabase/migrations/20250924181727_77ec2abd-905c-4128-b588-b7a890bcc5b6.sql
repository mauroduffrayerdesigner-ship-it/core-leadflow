-- Drop and recreate the view with proper syntax
DROP VIEW IF EXISTS public.landing_page_public;

-- Create the view for public landing page access that excludes sensitive data
CREATE VIEW public.landing_page_public AS
SELECT 
  id,
  nome,
  logo_url,
  tema_id,
  webhook_url,
  dominio_personalizado,
  headline,
  subtitulo,
  texto_cta,
  lp_publica
FROM public.clientes
WHERE lp_publica = true;

-- Grant public access to the view
GRANT SELECT ON public.landing_page_public TO anon;
GRANT SELECT ON public.landing_page_public TO authenticated;