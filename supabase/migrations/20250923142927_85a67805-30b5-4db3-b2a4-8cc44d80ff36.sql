-- Criar foreign key entre clientes e temas_landing
ALTER TABLE public.clientes 
ADD CONSTRAINT fk_clientes_tema 
FOREIGN KEY (tema_id) REFERENCES public.temas_landing(id);