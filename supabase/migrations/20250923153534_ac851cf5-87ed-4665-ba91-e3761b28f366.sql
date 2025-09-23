-- Add landing page customization fields to clients table
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS headline TEXT DEFAULT 'Transforme sua empresa com nossa solução',
ADD COLUMN IF NOT EXISTS subtitulo TEXT DEFAULT 'Descubra como podemos ajudar você a alcançar seus objetivos',
ADD COLUMN IF NOT EXISTS texto_cta TEXT DEFAULT 'Quero saber mais';

-- Update existing clients with default values if they don't have them
UPDATE public.clientes 
SET 
  headline = COALESCE(headline, 'Transforme sua empresa com nossa solução'),
  subtitulo = COALESCE(subtitulo, 'Descubra como podemos ajudar você a alcançar seus objetivos'),
  texto_cta = COALESCE(texto_cta, 'Quero saber mais')
WHERE headline IS NULL OR subtitulo IS NULL OR texto_cta IS NULL;