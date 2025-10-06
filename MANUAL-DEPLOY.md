# 🚀 Manual de Deploy - Guia para Desenvolvedores

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta Supabase (gratuita)
- Conta Brevo para emails (gratuita)
- Git instalado

## 🔧 Setup Local

### 1. Clone do Repositório

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Configuração Supabase

O projeto já está configurado com as credenciais do Supabase em `src/integrations/supabase/client.ts`. Você só precisa configurar os **secrets** para funcionalidades como envio de email.

**Adicionar BREVO_API_KEY**:
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em: Project Settings → Edge Functions → Secrets
3. Adicione: `BREVO_API_KEY` = sua-chave-brevo

### 4. Executar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📦 Deploy em Produção

### Via Lovable (Recomendado)

1. Clique em **"Publish"** no editor Lovable
2. Aguarde build (1-2 minutos)
3. Acesse URL: `seuapp.lovable.app`

### Via Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### Via Netlify

```bash
npm run build
# Upload da pasta dist/ no Netlify
```

## 🗄️ Configuração Supabase

### Edge Functions Deploy

As Edge Functions são automaticamente deployadas pelo Lovable. Se precisar fazer deploy manual:

```bash
supabase functions deploy webhook-lead
supabase functions deploy send-campaign-email
supabase functions deploy update-lead-status
```

### Secrets Necessários

```bash
supabase secrets set BREVO_API_KEY=your_key_here
```

## 🌐 Domínio Personalizado

### Configuração DNS

```
Tipo: CNAME
Nome: captura (ou subdomínio desejado)
Valor: seu-projeto.lovable.app
TTL: 3600
```

## 📊 Monitoramento

- Logs Supabase: [Dashboard](https://supabase.com/dashboard/project/_/logs)
- Edge Functions: [Logs](https://supabase.com/dashboard/project/_/functions)

---

Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comuns.
