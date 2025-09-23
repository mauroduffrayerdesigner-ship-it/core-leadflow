-- Corrigir problemas de segurança identificados pelo linter

-- Corrigir função update_data_atualizacao_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_data_atualizacao_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;