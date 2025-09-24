-- Corrigir problema de Security Definer removendo a função com CASCADE
DROP FUNCTION IF EXISTS public.registrar_interacao_lead() CASCADE;

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
$$ LANGUAGE plpgsql;

-- Recriar o trigger
CREATE TRIGGER trigger_registrar_interacao_lead
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_interacao_lead();