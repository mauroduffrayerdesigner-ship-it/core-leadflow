-- Add FK so PostgREST can join leads -> clientes
DO $$ BEGIN
  ALTER TABLE public.leads
  ADD CONSTRAINT leads_cliente_id_fkey
  FOREIGN KEY (cliente_id)
  REFERENCES public.clientes(id)
  ON DELETE SET NULL
  NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Optional: validate later if data is consistent
-- ALTER TABLE public.leads VALIDATE CONSTRAINT leads_cliente_id_fkey;

-- Index for better filtering by cliente_id
CREATE INDEX IF NOT EXISTS idx_leads_cliente_id ON public.leads(cliente_id);
