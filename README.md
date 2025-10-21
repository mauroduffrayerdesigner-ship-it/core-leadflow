# 🚀 Plataforma de Marketing e Vendas - Geração e Gestão de Leads

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green.svg)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Integrated-25D366.svg)

> Sistema completo de marketing digital para captura, gestão e nutrição de leads com landing pages personalizadas, automação de emails, integração WhatsApp e integrações via webhook.

## ✨ Principais Funcionalidades

### 🎯 Captura e Gestão de Leads
- 📊 **Dashboard Inteligente** - Métricas em tempo real com filtros por campanha
- 🎨 **Landing Pages Personalizadas** - 6 temas profissionais prontos para uso
- 👥 **Gestão Avançada de Leads** - Importação CSV, filtros, exportação e bulk actions
- 📈 **Métricas Detalhadas** - Acompanhe conversões, origens e performance
- 🌐 **Domínios Customizados** - Configure seus próprios domínios por campanha

### 💬 WhatsApp Business Integration
- 📱 **API Oficial do WhatsApp** - Integração completa com WhatsApp Business API
- 🤖 **API Não-Oficial (Venom/Baileys)** - Alternativa sem custos adicionais
- 💬 **Interface de Chat** - Conversas organizadas por campanha e lead
- 📋 **Templates de Mensagem** - Crie e gerencie templates reutilizáveis
- 📊 **Histórico Completo** - Acompanhe todas as mensagens enviadas e recebidas
- 🔄 **Respostas Automáticas** - Configure auto-reply para novos contatos

### 📧 Marketing e Comunicação
- 📧 **Email Marketing Automático** - Templates personalizáveis com assinaturas
- 📨 **4 Temas de Email Profissionais** - Designs otimizados para conversão
- 🔗 **Webhooks & Integrações** - Conecte com N8N, Make, Zapier e qualquer sistema
- 🔔 **Notificações em Tempo Real** - Receba alertas de novos leads

### 🎨 Design e UX
- 📱 **100% Responsivo** - Perfeito em desktop, tablet e mobile
- 🌓 **Dark Mode / Light Mode** - Tema claro e escuro automático
- ⚡ **Performance Otimizada** - Carregamento rápido e experiência fluida

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca UI moderna com hooks
- **TypeScript** - Tipagem estática para código robusto
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas e runtime type checking
- **next-themes** - Sistema de temas dark/light

### Backend & Infraestrutura
- **Supabase** - Backend-as-a-Service completo
  - PostgreSQL 15+ - Banco de dados relacional
  - Row Level Security (RLS) - Segurança nativa por linha
  - Edge Functions (Deno) - Serverless functions
  - Realtime - Atualizações ao vivo via WebSockets
  - Auth - Autenticação segura integrada
  - Storage - Armazenamento de arquivos

### Integrações e APIs
- **Brevo (Sendinblue)** - Envio de emails transacionais
- **WhatsApp Business API** - Mensagens oficiais via Meta
- **Venom/Baileys** - WhatsApp não-oficial (alternativa)
- **Webhooks** - Integração com automações externas
- **QR Code** - Geração de códigos para compartilhamento

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [**Manual do Usuário**](./MANUAL-USUARIO.md) | Guia completo para usuários finais |
| [**Manual de Deploy**](./MANUAL-DEPLOY.md) | Guia técnico para desenvolvedores |
| [**Arquitetura**](./ARQUITETURA.md) | Documentação técnica da arquitetura |
| [**API Reference**](./API-REFERENCE.md) | Referência de APIs, Edge Functions e webhooks |
| [**Troubleshooting**](./TROUBLESHOOTING.md) | Solução de problemas comuns |
| [**Changelog**](./CHANGELOG.md) | Histórico de versões e atualizações |

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ ou Bun
- npm, yarn ou bun
- Conta Supabase (gratuita) - [Criar conta](https://supabase.com)
- Conta Brevo para emails (gratuita) - [Criar conta](https://www.brevo.com)
- (Opcional) WhatsApp Business API ou conta WhatsApp para Venom

### Instalação Local

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências
npm install
# ou
bun install

# 3. Configure o ambiente
# As configurações do Supabase já estão no código
# Você só precisa configurar os secrets no Supabase Dashboard

# 4. Inicie o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

Acesse: `http://localhost:5173`

### Configuração Rápida

1. **Crie sua conta** - Acesse a aplicação e faça o cadastro
2. **Configure o Brevo** - Adicione sua API Key no Supabase Dashboard
3. **Configure WhatsApp** (opcional) - Escolha entre API Oficial ou Venom
4. **Crie sua primeira campanha** - Siga o wizard de onboarding
5. **Compartilhe sua landing page** - Use o link ou QR Code gerado

## 🎯 Casos de Uso

### Para Agências de Marketing
- Gerencie múltiplos clientes e campanhas
- Landing pages white-label com domínio personalizado
- Atendimento WhatsApp centralizado por campanha
- Relatórios detalhados por cliente
- Integrações com ferramentas de automação

### Para PMEs e Freelancers
- Capture leads para seu negócio
- Atendimento WhatsApp profissional
- Nutrição automática por email
- Métricas simples e claras
- Setup em minutos

### Para E-commerce e Vendas
- Capture interesse em produtos
- Follow-up automático via WhatsApp
- Qualificação de leads
- Templates de mensagem para promoções
- Integração com CRMs via webhook

### Para Desenvolvedores
- API aberta para integrações
- Edge Functions customizáveis
- Webhooks configuráveis
- Schema do banco totalmente documentado
- Validação Zod em todos os endpoints

## 📊 Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn)
│   │   ├── dashboard/      # Componentes do dashboard
│   │   ├── campanha/       # Componentes de campanhas
│   │   ├── leads/          # Componentes de leads
│   │   ├── landing/        # Componentes de landing pages
│   │   ├── whatsapp/       # Componentes de WhatsApp
│   │   ├── layout/         # Layout e navegação
│   │   └── onboarding/     # Wizard inicial
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilitários e helpers
│   │   └── validations/    # Schemas de validação Zod
│   ├── providers/          # Context providers (Theme, etc)
│   └── integrations/       # Integrações (Supabase)
├── supabase/
│   ├── functions/          # Edge Functions (Deno/TypeScript)
│   │   ├── webhook-lead/              # Receber leads
│   │   ├── send-campaign-email/       # Enviar emails
│   │   ├── update-lead-status/        # Atualizar status
│   │   ├── whatsapp-send-message/     # Enviar WhatsApp
│   │   ├── whatsapp-receive-webhook/  # Receber WhatsApp
│   │   └── whatsapp-test-connection/  # Testar conexão
│   ├── migrations/         # Migrations do banco
│   └── config.toml         # Configuração do Supabase
├── public/                 # Assets estáticos
└── docs/                   # Documentação adicional
```

## 🔐 Segurança e Boas Práticas

### Camadas de Segurança
- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Autenticação JWT** via Supabase Auth
- ✅ **Validação Zod** em todos os inputs e Edge Functions
- ✅ **CORS configurado** corretamente
- ✅ **Secrets gerenciados** pelo Supabase (nunca expostos)
- ✅ **Edge Functions isoladas** em runtime Deno
- ✅ **HTML Sanitization** em mensagens WhatsApp
- ✅ **Rate Limiting** em endpoints críticos
- ✅ **Webhook Signature Verification** para WhatsApp

### Validações Implementadas
```typescript
// Exemplo de validação Zod
import { z } from 'zod';

export const whatsappMessageSchema = z.object({
  content: z.string().min(1).max(4096),
  type: z.enum(['text', 'image', 'document']),
  media_url: z.string().url().optional(),
});
```

## 🌟 Features Destacadas

### Onboarding Inteligente
Wizard passo-a-passo que guia novos usuários:
1. Criar primeiro cliente
2. Configurar campanha
3. Personalizar landing page
4. Escolher integração (Email/WhatsApp)
5. Começar a capturar leads

### Dashboard Analytics
- Total de leads capturados
- Taxa de conversão por campanha
- Leads por origem (formulário, CSV, webhook, WhatsApp, manual)
- Comparativo mês atual vs anterior
- Atividade recente em tempo real
- Filtros dinâmicos por campanha

### WhatsApp Business Center
- **Configuração Dual**: Escolha entre API Oficial ou Venom
- **Interface de Chat**: Conversas organizadas por campanha
- **Templates de Mensagem**: Crie e reutilize templates
- **Histórico Completo**: Busca e filtragem de mensagens
- **Status em Tempo Real**: Acompanhe envio e leitura
- **Auto-Reply**: Configure respostas automáticas

### Gestão de Leads
- **Filtros avançados**: Status, origem, período, campanha, texto
- **Bulk actions**: Atualizar status em massa
- **Importação CSV**: Template pré-formatado, validação automática
- **Exportação**: Dados completos em CSV
- **Timeline**: Histórico de interações (emails, WhatsApp, status)
- **Skeleton Loading**: UX aprimorada durante carregamento

### Email Marketing
- 4 temas de email profissionais
- Variáveis dinâmicas ({{nome}}, {{email}}, {{telefone}})
- Assinaturas HTML personalizadas
- Envio manual ou automático
- Logs completos de envio
- Integração com Brevo API

### Landing Pages
- 6 temas responsivos (moderno, corporativo, tech, criativo, e-commerce, consultoria)
- Editor inline (headline, subtítulo, CTA)
- Preview em tempo real
- QR Code automático
- URLs amigáveis (`/lp/[campanha_id]`)
- Domínio personalizado opcional
- 100% responsivo (mobile-first)

## 🔗 Integrações

### WhatsApp Business API (Oficial)
Configure via Meta/Facebook:
```typescript
// Credenciais necessárias
{
  "whatsapp_business_account_id": "seu-waba-id",
  "phone_number_id": "seu-phone-id",
  "access_token": "seu-token-permanente",
  "webhook_verify_token": "seu-token-verificacao"
}
```

### Venom/Baileys (Não-oficial)
Configure via QR Code:
```typescript
{
  "venom_session_name": "minha-sessao",
  "venom_webhook_url": "https://sua-api.com/webhook"
}
```

### N8N / Make / Zapier
Configure webhooks para enviar leads automaticamente:

```javascript
// Payload enviado pelo webhook
{
  "id": "uuid-do-lead",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Consultoria",
  "origem": "formulario", // ou "csv", "n8n", "whatsapp", "manual"
  "status": "novo",
  "data_criacao": "2025-10-21T14:30:00Z",
  "cliente_id": "uuid",
  "cliente_nome": "Minha Empresa",
  "campanha_id": "uuid",
  "campanha_nome": "Black Friday 2025"
}
```

## 🎨 Temas e Personalização

### Dark Mode / Light Mode
O sistema detecta automaticamente a preferência do usuário e permite alternar manualmente:

- 🌞 **Light Mode**: Design clean e profissional
- 🌙 **Dark Mode**: Reduz fadiga visual, ideal para uso prolongado
- 🔄 **Auto**: Segue configuração do sistema operacional

### Cores da Marca (Design Tokens)
```css
--core-black: 0 0% 0%;       /* Preto principal */
--core-green: 158 100% 43%;  /* Verde CORE */
--core-yellow: 62 100% 65%;  /* Amarelo destaque */
--core-purple: 280 61% 82%;  /* Roxo suave */
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha feature incrível'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit
- `Add:` Nova funcionalidade
- `Fix:` Correção de bug
- `Update:` Atualização de código existente
- `Refactor:` Refatoração sem mudança de funcionalidade
- `Docs:` Atualização de documentação
- `Style:` Mudanças de formatação

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte e Comunidade

- 📖 [Documentação Completa](./MANUAL-USUARIO.md)
- 🐛 [Report de Bugs](https://github.com/your-repo/issues)
- 💬 [Discussões](https://github.com/your-repo/discussions)
- 📧 Email: suporte@seudominio.com

## 🎉 Créditos

Desenvolvido com ❤️ usando:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

## 📅 Roadmap

### Em Desenvolvimento
- [ ] Integração com Instagram Direct
- [ ] Chatbot com IA para WhatsApp
- [ ] A/B Testing de Landing Pages
- [ ] SMS Marketing

### Planejado
- [ ] Integração com Telegram
- [ ] CRM completo integrado
- [ ] Relatórios avançados com BI
- [ ] App Mobile (React Native)
