-- Inserir novos temas de landing page
INSERT INTO public.temas_landing (id, nome, descricao, preview_url) VALUES
  (6, 'VSL Video', 'Landing page focada em Video Sales Letter com player de vídeo centralizado', '/src/assets/preview-vsl-video.jpg'),
  (7, 'Gift Bonus', 'Landing page de presente/bônus exclusivo com design premium e elementos de urgência', '/src/assets/preview-gift-bonus.jpg')
ON CONFLICT (id) DO NOTHING;

-- Inserir novos temas de email
INSERT INTO public.temas_email (id, nome, descricao, html_template, variaveis_suportadas, preview_url) VALUES
  (4, 'Newsletter Profissional', 'Template de newsletter com seções estruturadas e design corporativo', 
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{assunto}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Newsletter</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Olá {{nome}},</h2>
              <div style="color: #666666; font-size: 16px; line-height: 1.6;">
                {{conteudo}}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              {{assinatura}}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Este email foi enviado para {{email}}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  ARRAY['{{nome}}', '{{email}}', '{{conteudo}}', '{{assinatura}}', '{{assunto}}'],
  '/src/assets/preview-email-newsletter.jpg')
ON CONFLICT (id) DO NOTHING;