-- Criar tabela de temas de email
CREATE TABLE IF NOT EXISTS public.temas_email (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  html_template TEXT NOT NULL,
  preview_url TEXT,
  variaveis_suportadas TEXT[] DEFAULT ARRAY['{{nome}}', '{{email}}', '{{conteudo}}', '{{assinatura}}'],
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de assinaturas de email
CREATE TABLE IF NOT EXISTS public.assinaturas_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES public.campanhas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  telefone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  redes_sociais JSONB DEFAULT '{}',
  template_html TEXT NOT NULL,
  ativa BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar coluna tema_email_id em campanhas
ALTER TABLE public.campanhas
ADD COLUMN IF NOT EXISTS tema_email_id INTEGER REFERENCES public.temas_email(id);

-- Adicionar coluna assinatura_email_id em campanhas
ALTER TABLE public.campanhas
ADD COLUMN IF NOT EXISTS assinatura_email_id UUID REFERENCES public.assinaturas_email(id);

-- Habilitar RLS
ALTER TABLE public.temas_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas_email ENABLE ROW LEVEL SECURITY;

-- Políticas para temas de email (público para leitura)
CREATE POLICY "Todos podem ver temas de email"
ON public.temas_email
FOR SELECT
USING (true);

-- Políticas para assinaturas de email
CREATE POLICY "Usuários podem ver assinaturas de suas campanhas"
ON public.assinaturas_email
FOR SELECT
USING (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar assinaturas"
ON public.assinaturas_email
FOR INSERT
WITH CHECK (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar assinaturas de suas campanhas"
ON public.assinaturas_email
FOR UPDATE
USING (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar assinaturas de suas campanhas"
ON public.assinaturas_email
FOR DELETE
USING (
  campanha_id IN (
    SELECT c.id 
    FROM public.campanhas c
    JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE cl.user_id = auth.uid()
  )
);

-- Inserir temas de email padrão
INSERT INTO public.temas_email (nome, descricao, html_template, variaveis_suportadas) VALUES
(
  'Profissional Limpo',
  'Design minimalista e profissional com fundo branco',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Olá, {{nome}}!</h1>
              <div style="color: #666666; font-size: 16px; line-height: 1.6;">
                {{conteudo}}
              </div>
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                {{assinatura}}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  ARRAY['{{nome}}', '{{email}}', '{{conteudo}}', '{{assinatura}}']
),
(
  'Moderno Colorido',
  'Design moderno com gradiente e cores vibrantes',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px;">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Olá, {{nome}}!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                {{conteudo}}
              </div>
              <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #667eea;">
                {{assinatura}}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  ARRAY['{{nome}}', '{{email}}', '{{conteudo}}', '{{assinatura}}']
),
(
  'Elegante Corporativo',
  'Design corporativo elegante com tons azuis',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f8f9fa;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 2px solid #1e3a8a;">
          <tr>
            <td style="background-color: #1e3a8a; padding: 20px 30px;">
              <h1 style="color: #ffffff; font-size: 26px; margin: 0; font-weight: normal;">{{nome}},</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="color: #1f2937; font-size: 16px; line-height: 1.8;">
                {{conteudo}}
              </div>
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                {{assinatura}}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f3f4f6; padding: 20px 30px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">Este é um email profissional</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  ARRAY['{{nome}}', '{{email}}', '{{conteudo}}', '{{assinatura}}']
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_assinaturas_email_campanha ON public.assinaturas_email(campanha_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_email_ativa ON public.assinaturas_email(ativa);