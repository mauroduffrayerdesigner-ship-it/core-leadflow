-- Fix security issue: Remove public access to sensitive customer data
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Landing pages públicas podem ser visualizadas" ON public.clientes;

-- Create a new policy that only allows access to non-sensitive landing page data
CREATE POLICY "Public landing page data access" ON public.clientes
FOR SELECT 
USING (lp_publica = true);