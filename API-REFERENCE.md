# 📡 API Reference - Plataforma de Marketing e Vendas

## 📋 Índice

1. [Edge Functions](#-edge-functions)
2. [Webhook de Captura](#-webhook-de-captura)
3. [WhatsApp API](#-whatsapp-api)
4. [Email API](#-email-api)
5. [Validações Zod](#-validações-zod)
6. [Supabase Client Queries](#-supabase-client-queries)

---

## ⚡ Edge Functions

Todas as Edge Functions estão hospedadas no Supabase e utilizam runtime Deno.

**Base URL**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1`

### Headers Padrão

```http
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

---

## 🌐 Webhook de Captura

### POST /webhook-lead

Endpoint para receber leads de formulários, integrações externas ou automações.

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/webhook-lead`

#### Request

**Headers**:
```http
Content-Type: application/json
```

**Payload**:
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Quero saber mais sobre o produto",
  "campanha_id": "550e8400-e29b-41d4-a716-446655440000",
  "cliente_id": "123e4567-e89b-12d3-a456-426614174000",
  "origem": "formulario"
}
```

**Campos**:
- `nome` (string, obrigatório): Nome completo do lead
- `email` (string, obrigatório): Email válido
- `telefone` (string, opcional): Telefone com DDD
- `interesse` (string, opcional): Mensagem ou interesse do lead
- `campanha_id` (UUID, obrigatório): ID da campanha
- `cliente_id` (UUID, obrigatório): ID do cliente
- `origem` (enum, opcional): `"formulario" | "csv" | "n8n" | "whatsapp" | "manual"` (padrão: "formulario")

#### Response Success (200)

```json
{
  "success": true,
  "lead": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "telefone": "+5511999999999",
    "status": "novo",
    "origem": "formulario"
  },
  "webhook_sent": true,
  "email_sent": true
}
```

#### Response Error (400)

```json
{
  "error": "Email já cadastrado nesta campanha"
}
```

#### Response Error (500)

```json
{
  "error": "Erro interno do servidor",
  "details": "Mensagem de erro técnico"
}
```

---

## 💬 WhatsApp API

### POST /whatsapp-send-message

Envia mensagens via WhatsApp Business API ou Venom.

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/whatsapp-send-message`

#### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

**Payload**:
```json
{
  "campanhaId": "550e8400-e29b-41d4-a716-446655440000",
  "leadId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "conversationId": "abc123-def456-ghi789",
  "message": "Olá! Obrigado pelo interesse em nossa campanha.",
  "type": "text",
  "mediaUrl": "https://exemplo.com/imagem.jpg"
}
```

**Campos**:
- `campanhaId` (UUID, obrigatório): ID da campanha
- `leadId` (UUID, obrigatório): ID do lead destinatário
- `conversationId` (UUID, opcional): ID da conversa (criado automaticamente se não fornecido)
- `message` (string, obrigatório): Conteúdo da mensagem (máx 4096 caracteres)
- `type` (enum, opcional): `"text" | "image" | "document"` (padrão: "text")
- `mediaUrl` (string, opcional): URL da mídia (obrigatório se type != "text")

#### Validação Zod

```typescript
const sendMessageSchema = z.object({
  campanhaId: z.string().uuid(),
  leadId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(4096),
  type: z.enum(['text', 'image', 'document']).default('text'),
  mediaUrl: z.string().url().optional(),
});
```

#### Response Success (200)

```json
{
  "success": true,
  "messageId": "wamid.HBgLNTUxMTk4NzY1NDMyMBUCABIYFDNFQjBDMUQxRjQ4NDhBMzQzODhFAA=="
}
```

#### Rate Limiting

- **Limite**: 10 mensagens por minuto por campanha
- **Response (429)**:
```json
{
  "error": "Rate limit exceeded. Try again in 1 minute."
}
```

---

### POST /whatsapp-receive-webhook

Webhook para receber mensagens do WhatsApp (configurado na Meta/Facebook).

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/whatsapp-receive-webhook`

#### Webhook Verification (GET)

**Query Params**:
- `hub.mode`: "subscribe"
- `hub.verify_token`: Seu token de verificação
- `hub.challenge`: Challenge do WhatsApp

**Response**: Retorna o `hub.challenge` se o token for válido.

#### Receiving Messages (POST)

**Payload** (exemplo do WhatsApp):
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "id": "wamid.xxx",
          "timestamp": "1698765432",
          "type": "text",
          "text": {
            "body": "Olá, tenho interesse!"
          }
        }]
      }
    }]
  }]
}
```

**Funcionalidades**:
- ✅ Verifica assinatura HMAC
- ✅ Identifica ou cria conversação
- ✅ Salva mensagem recebida
- ✅ Cria lead se não existir
- ✅ Resposta automática (se habilitada)

---

### POST /whatsapp-test-connection

Testa a conexão com WhatsApp Business API.

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/whatsapp-test-connection`

#### Request

**Payload**:
```json
{
  "campanhaId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response Success (200)

**API Oficial**:
```json
{
  "success": true,
  "api_type": "official",
  "status": "connected",
  "phone_number": "+5511999887766",
  "account_name": "Minha Empresa",
  "verified": true
}
```

**Venom**:
```json
{
  "success": true,
  "api_type": "unofficial",
  "status": "connected",
  "session": "minha-sessao",
  "qr_code": null
}
```

#### Response Error (400)

```json
{
  "success": false,
  "error": "Invalid credentials or configuration not found"
}
```

---

## 📧 Email API

### POST /send-campaign-email

Envia emails personalizados usando templates e Brevo API.

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/send-campaign-email`

#### Request

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
```

**Payload**:
```json
{
  "campanhaId": "550e8400-e29b-41d4-a716-446655440000",
  "leadId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "templateId": "abc123-def456-ghi789"
}
```

**Campos**:
- `campanhaId` (UUID, obrigatório): ID da campanha
- `leadId` (UUID, obrigatório): ID do lead destinatário
- `templateId` (UUID, obrigatório): ID do template de email

#### Response Success (200)

```json
{
  "success": true,
  "messageId": "brevo-message-id-12345",
  "to": "joao@exemplo.com"
}
```

#### Response Error (400)

```json
{
  "error": "Template não encontrado"
}
```

---

### POST /update-lead-status

Atualiza o status de um lead.

**URL Completa**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/update-lead-status`

#### Request

**Payload**:
```json
{
  "lead_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "status": "qualificado",
  "notas": "Cliente interessado em reunião para próxima semana"
}
```

**Campos**:
- `lead_id` (UUID, obrigatório): ID do lead
- `status` (enum, obrigatório): `"novo" | "qualificado" | "convertido" | "perdido"`
- `notas` (string, opcional): Observações sobre a mudança

#### Response Success (200)

```json
{
  "success": true,
  "lead": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "status": "qualificado",
    "atualizado_em": "2025-10-21T15:30:00Z"
  }
}
```

---

## 🔍 Validações Zod

Todos os Edge Functions utilizam Zod para validação de entrada.

### WhatsApp Oficial Config

```typescript
export const whatsappOfficialConfigSchema = z.object({
  whatsapp_business_account_id: z.string()
    .min(1, 'Business Account ID é obrigatório')
    .max(100),
  phone_number_id: z.string()
    .min(1, 'Phone Number ID é obrigatório')
    .max(100),
  access_token_secret: z.string()
    .min(10, 'Access Token muito curto')
    .max(500),
  webhook_verify_token: z.string()
    .min(5, 'Webhook Token muito curto')
    .max(100),
});
```

### WhatsApp Venom Config

```typescript
export const whatsappVenomConfigSchema = z.object({
  venom_session_name: z.string()
    .min(3, 'Nome da sessão muito curto')
    .max(50)
    .regex(/^[a-z0-9-_]+$/, 'Use apenas letras minúsculas, números, hífen e underscore'),
  venom_webhook_url: z.string()
    .url('URL inválida')
    .startsWith('http', 'URL deve começar com http ou https'),
});
```

### Chat Message

```typescript
export const chatMessageSchema = z.object({
  content: z.string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(4096, 'Mensagem muito longa'),
  type: z.enum(['text', 'image', 'document']).default('text'),
  media_url: z.string().url().optional(),
});
```

---

## 🔗 Webhook Payload Enviado

Quando configurado, enviamos este payload para sua URL customizada:

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Gostaria de conhecer mais sobre o produto",
  "origem": "formulario",
  "status": "novo",
  "data_criacao": "2025-10-21T14:30:00Z",
  "atualizado_em": "2025-10-21T14:30:00Z",
  "cliente_id": "123e4567-e89b-12d3-a456-426614174000",
  "cliente_nome": "Minha Empresa LTDA",
  "campanha_id": "550e8400-e29b-41d4-a716-446655440000",
  "campanha_nome": "Black Friday 2025"
}
```

---

## 📚 Supabase Client Queries

### Buscar Leads

```typescript
const { data, error } = await supabase
  .from('leads')
  .select(`
    *,
    campanhas (
      nome,
      cliente_id
    )
  `)
  .eq('status', 'novo')
  .order('data_criacao', { ascending: false })
  .range(0, 49); // Paginação
```

### Inserir Lead

```typescript
const { data, error } = await supabase
  .from('leads')
  .insert({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '+5511999999999',
    campanha_id: 'uuid-campanha',
    cliente_id: 'uuid-cliente',
    origem: 'formulario',
    status: 'novo'
  })
  .select()
  .single();
```

### Buscar Conversas WhatsApp

```typescript
const { data, error } = await supabase
  .from('whatsapp_conversations')
  .select(`
    *,
    leads (
      nome,
      telefone,
      email
    )
  `)
  .eq('campanha_id', campanhaId)
  .order('last_message_at', { ascending: false })
  .limit(50);
```

### Buscar Mensagens WhatsApp

```typescript
const { data, error } = await supabase
  .from('whatsapp_messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: true })
  .range(0, 99);
```

### Realtime Subscription (Novas Mensagens)

```typescript
const subscription = supabase
  .channel('whatsapp_messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'whatsapp_messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('Nova mensagem:', payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 🔒 Autenticação e Segurança

### Autenticação JWT

Todas as chamadas ao Supabase Client devem incluir o token JWT do usuário autenticado:

```typescript
import { supabase } from '@/integrations/supabase/client';

// O token é gerenciado automaticamente pelo client
const { data: user } = await supabase.auth.getUser();
```

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS ativas:

```sql
-- Exemplo: Leads
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = leads.cliente_id
        AND clientes.user_id = auth.uid()
    )
  );
```

### Rate Limiting

Edge Functions implementam rate limiting:

- **WhatsApp**: 10 mensagens/minuto por campanha
- **Email**: 50 mensagens/minuto por campanha
- **Webhook**: 100 requests/minuto por cliente

---

Para mais exemplos e detalhes técnicos, veja:
- [MANUAL-DEPLOY.md](./MANUAL-DEPLOY.md) - Setup e deploy
- [ARQUITETURA.md](./ARQUITETURA.md) - Arquitetura completa
- [MANUAL-USUARIO.md](./MANUAL-USUARIO.md) - Guia de uso
