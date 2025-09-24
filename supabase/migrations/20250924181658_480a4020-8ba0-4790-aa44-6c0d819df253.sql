-- Create a secure view for public landing page access that excludes sensitive data
CREATE OR REPLACE VIEW public.landing_page_public AS
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

-- Grant public access to the view only
GRANT SELECT ON public.landing_page_public TO anon;
GRANT SELECT ON public.landing_page_public TO authenticated;