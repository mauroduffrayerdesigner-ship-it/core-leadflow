import { z } from 'zod';

export const whatsappOfficialConfigSchema = z.object({
  whatsapp_business_account_id: z.string()
    .min(1, 'Business Account ID é obrigatório')
    .max(100, 'Business Account ID muito longo'),
  phone_number_id: z.string()
    .min(1, 'Phone Number ID é obrigatório')
    .max(100, 'Phone Number ID muito longo'),
  access_token_secret: z.string()
    .min(10, 'Access Token muito curto')
    .max(500, 'Access Token muito longo'),
  webhook_verify_token: z.string()
    .min(5, 'Webhook Token muito curto')
    .max(100, 'Webhook Token muito longo'),
});

export const whatsappVenomConfigSchema = z.object({
  venom_session_name: z.string()
    .min(3, 'Nome da sessão muito curto')
    .max(50, 'Nome da sessão muito longo')
    .regex(/^[a-z0-9-_]+$/, 'Use apenas letras minúsculas, números, hífen e underscore'),
  venom_webhook_url: z.string()
    .url('URL inválida')
    .startsWith('http', 'URL deve começar com http ou https'),
});

export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(4096, 'Mensagem muito longa (máx 4096 caracteres)'),
  type: z.enum(['text', 'image', 'document']).default('text'),
  media_url: z.string().url().optional(),
});

export const sendBulkMessageSchema = z.object({
  templateId: z.string().uuid('Template ID inválido'),
  leadIds: z.array(z.string().uuid()).min(1, 'Selecione ao menos um lead').max(100, 'Máximo 100 leads por vez'),
});

export const sendMessageRequestSchema = z.object({
  campanhaId: z.string().uuid(),
  leadId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(4096),
  type: z.enum(['text', 'image', 'document']).default('text'),
  mediaUrl: z.string().url().optional(),
});
