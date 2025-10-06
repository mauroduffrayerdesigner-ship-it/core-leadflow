# 📡 API Reference

## 🌐 API Pública de Captura

### POST /webhook-lead

Endpoint para receber leads (formulário ou integrações externas).

**URL**: `https://qlhtubjjznbzxwsvzjqz.supabase.co/functions/v1/webhook-lead`

**Headers**:
```
Content-Type: application/json
```

**Payload**:
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Produto X",
  "campanha_id": "uuid-da-campanha",
  "cliente_id": "uuid-do-cliente",
  "origem": "formulario"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "lead": {
    "id": "uuid-gerado",
    "nome": "João Silva",
    "email": "joao@exemplo.com"
  },
  "webhook_sent": true
}
```

**Response Error (400/500)**:
```json
{
  "error": "Descrição do erro"
}
```

## 📧 Send Campaign Email

### POST /send-campaign-email

**Payload**:
```json
{
  "campanhaId": "uuid",
  "leadId": "uuid",
  "templateId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "messageId": "brevo-message-id"
}
```

## 🔄 Update Lead Status

### POST /update-lead-status

**Payload**:
```json
{
  "lead_id": "uuid",
  "status": "qualificado",
  "notas": "Cliente interessado em reunião"
}
```

**Status válidos**: novo, qualificado, convertido, perdido

## 🔗 Webhook Payload

Quando configurado, enviamos este payload para sua URL:

```json
{
  "id": "uuid-do-lead",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Gostaria de conhecer o produto",
  "origem": "formulario",
  "status": "novo",
  "data_criacao": "2025-10-06T14:30:00Z",
  "cliente_id": "uuid",
  "cliente_nome": "Minha Empresa",
  "campanha_id": "uuid",
  "campanha_nome": "Black Friday 2025"
}
```

## 📚 Supabase Client Queries

### Buscar Leads
```typescript
const { data, error } = await supabase
  .from('leads')
  .select('*, campanhas(*)')
  .eq('status', 'novo')
  .order('data_criacao', { ascending: false })
```

### Inserir Lead
```typescript
const { data, error } = await supabase
  .from('leads')
  .insert({
    nome: 'João',
    email: 'joao@email.com',
    campanha_id: 'uuid',
    cliente_id: 'uuid'
  })
```

---

Para mais exemplos, veja [MANUAL-DEPLOY.md](./MANUAL-DEPLOY.md)
