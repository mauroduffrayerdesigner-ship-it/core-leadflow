-- Remover views SECURITY DEFINER problemáticas e recriar sem SECURITY DEFINER
DROP VIEW IF EXISTS public.landing_page_campanha_custom_public;
DROP VIEW IF EXISTS public.landing_page_cliente_custom_public;

-- Recriar as views SEM SECURITY DEFINER
CREATE VIEW public.landing_page_campanha_custom_public 
WITH (security_invoker = true) AS
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

CREATE VIEW public.landing_page_cliente_custom_public 
WITH (security_invoker = true) AS
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