-- Adicionar políticas RLS faltantes para a tabela clientes
-- Permitir INSERT para usuários autenticados criarem seus próprios clientes
CREATE POLICY "Usuários podem criar seus próprios clientes" 
ON public.clientes 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permitir UPDATE para usuários editarem seus próprios clientes
CREATE POLICY "Usuários podem editar seus próprios clientes" 
ON public.clientes 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permitir DELETE para usuários excluírem seus próprios clientes
CREATE POLICY "Usuários podem excluir seus próprios clientes" 
ON public.clientes 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Garantir que user_id seja obrigatório (não nullable) para segurança
ALTER TABLE public.clientes ALTER COLUMN user_id SET NOT NULL;