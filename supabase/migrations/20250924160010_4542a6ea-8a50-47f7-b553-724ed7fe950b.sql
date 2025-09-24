-- Adicionar coluna para controlar se a landing page é pública
ALTER TABLE public.clientes 
ADD COLUMN lp_publica BOOLEAN DEFAULT TRUE;

-- Criar política para permitir acesso público às landing pages
CREATE POLICY "Landing pages públicas podem ser visualizadas" 
ON public.clientes 
FOR SELECT 
USING (lp_publica = TRUE);

-- Comentário: Esta política permite que qualquer pessoa (incluindo usuários anônimos) 
-- visualize dados de clientes que tenham lp_publica = TRUE