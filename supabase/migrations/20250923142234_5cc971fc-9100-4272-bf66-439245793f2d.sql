-- Corrigir função atualizar_metricas_cliente com search_path seguro
CREATE OR REPLACE FUNCTION public.atualizar_metricas_cliente()
RETURNS TRIGGER AS $$
DECLARE
  cliente_row public.clientes%ROWTYPE;
BEGIN
  -- Buscar dados do cliente
  SELECT * INTO cliente_row FROM public.clientes WHERE id = COALESCE(NEW.cliente_id, OLD.cliente_id);
  
  -- Inserir ou atualizar métricas do dia
  INSERT INTO public.metricas_cliente (cliente_id, data_metrica, total_leads, leads_formulario, leads_manual, leads_csv, leads_n8n, leads_qualificados, leads_convertidos)
  SELECT 
    cliente_row.id,
    CURRENT_DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE origem = 'formulario'),
    COUNT(*) FILTER (WHERE origem = 'manual'),
    COUNT(*) FILTER (WHERE origem = 'csv'),
    COUNT(*) FILTER (WHERE origem = 'n8n'),
    COUNT(*) FILTER (WHERE status = 'qualificado'),
    COUNT(*) FILTER (WHERE status = 'convertido')
  FROM public.leads 
  WHERE cliente_id = cliente_row.id 
  AND DATE(data_criacao) = CURRENT_DATE
  ON CONFLICT (cliente_id, data_metrica) 
  DO UPDATE SET
    total_leads = EXCLUDED.total_leads,
    leads_formulario = EXCLUDED.leads_formulario,
    leads_manual = EXCLUDED.leads_manual,
    leads_csv = EXCLUDED.leads_csv,
    leads_n8n = EXCLUDED.leads_n8n,
    leads_qualificados = EXCLUDED.leads_qualificados,
    leads_convertidos = EXCLUDED.leads_convertidos;
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;