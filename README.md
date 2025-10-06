# 🚀 Plataforma de Marketing e Vendas - Geração e Gestão de Leads

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green.svg)

> Sistema completo de marketing digital para captura, gestão e nutrição de leads com landing pages personalizadas, automação de emails e integrações via webhook.

## ✨ Principais Funcionalidades

- 📊 **Dashboard Inteligente** - Métricas em tempo real com filtros por campanha
- 🎨 **Landing Pages Personalizadas** - 6 temas profissionais prontos para uso
- 📧 **Email Marketing Automático** - Templates personalizáveis com assinaturas
- 🎯 **Gestão Avançada de Leads** - Importação CSV, filtros, exportação e bulk actions
- 🔗 **Webhooks & Integrações** - Conecte com N8N, Make, Zapier e qualquer sistema
- 📈 **Métricas Detalhadas** - Acompanhe conversões, origens e performance
- 🌐 **Domínios Customizados** - Configure seus próprios domínios por campanha
- 📱 **100% Responsivo** - Perfeito em desktop, tablet e mobile

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes acessíveis
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL - Banco de dados relacional
  - Row Level Security (RLS) - Segurança nativa
  - Edge Functions - Serverless em Deno
  - Realtime - Atualizações ao vivo
  - Auth - Autenticação integrada

### Integrações
- **Brevo (Sendinblue)** - Envio de emails transacionais
- **Webhooks** - Integração com automações externas
- **QR Code** - Geração de códigos para compartilhamento

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [**Manual do Usuário**](./MANUAL-USUARIO.md) | Guia completo para usuários finais |
| [**Manual de Deploy**](./MANUAL-DEPLOY.md) | Guia técnico para desenvolvedores |
| [**Arquitetura**](./ARQUITETURA.md) | Documentação técnica da arquitetura |
| [**API Reference**](./API-REFERENCE.md) | Referência de APIs e webhooks |
| [**Troubleshooting**](./TROUBLESHOOTING.md) | Solução de problemas comuns |
| [**Changelog**](./CHANGELOG.md) | Histórico de versões |

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase (gratuita)
- Conta Brevo para emails (gratuita)

### Instalação Local

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
# As configurações do Supabase já estão no código
# Você só precisa configurar os secrets no Supabase Dashboard

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

### Configuração Rápida

1. **Crie sua conta** - Acesse a aplicação e faça o cadastro
2. **Configure o Brevo** - Adicione sua chave API no Supabase Dashboard
3. **Crie sua primeira campanha** - Siga o wizard de onboarding
4. **Compartilhe sua landing page** - Use o link ou QR Code gerado

## 🎯 Casos de Uso

### Para Agências de Marketing
- Gerencie múltiplos clientes e campanhas
- Landing pages white-label com domínio personalizado
- Relatórios detalhados por cliente
- Integrações com ferramentas de automação

### Para PMEs e Freelancers
- Capture leads para seu negócio
- Nutrição automática por email
- Métricas simples e claras
- Setup em minutos

### Para Desenvolvedores
- API aberta para integrações
- Webhooks configuráveis
- Edge Functions customizáveis
- Schema do banco totalmente documentado

## 📊 Estrutura do Projeto

```
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── ui/         # Componentes base (shadcn)
│   │   ├── dashboard/  # Componentes do dashboard
│   │   ├── campanha/   # Componentes de campanhas
│   │   ├── leads/      # Componentes de leads
│   │   ├── landing/    # Componentes de landing pages
│   │   └── layout/     # Layout e navegação
│   ├── pages/          # Páginas da aplicação
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilitários
│   └── integrations/   # Integrações (Supabase)
├── supabase/
│   ├── functions/      # Edge Functions (Deno)
│   └── migrations/     # Migrations do banco
├── public/             # Assets estáticos
└── docs/              # Documentação adicional
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Autenticação via Supabase Auth
- ✅ Validação de schemas com Zod
- ✅ CORS configurado corretamente
- ✅ Secrets gerenciados pelo Supabase
- ✅ Edge Functions isoladas

## 🌟 Features Destacadas

### Onboarding Inteligente
Wizard passo-a-passo que guia novos usuários:
1. Criar primeiro cliente
2. Configurar campanha
3. Personalizar landing page
4. Começar a capturar leads

### Dashboard Analytics
- Total de leads capturados
- Taxa de conversão
- Leads por origem (formulário, CSV, webhook, manual)
- Comparativo mês atual vs anterior
- Atividade recente em tempo real

### Gestão de Leads
- **Filtros avançados**: Status, origem, período, campanha
- **Bulk actions**: Atualizar status em massa
- **Importação CSV**: Template pré-formatado
- **Exportação**: Dados completos em CSV
- **Timeline**: Histórico de interações

### Email Marketing
- 4 temas de email profissionais
- Variáveis dinâmicas (nome, email, telefone)
- Assinaturas HTML personalizadas
- Envio manual ou automático
- Logs completos de envio

### Landing Pages
- 6 temas responsivos
- Editor inline (headline, subtítulo, CTA)
- Preview em tempo real
- QR Code automático
- URLs amigáveis (`/lp/[campanha_id]`)
- Domínio personalizado opcional

## 🔗 Integrações

### N8N / Make / Zapier
Configure webhooks para enviar leads capturados automaticamente para suas automações:

```javascript
// Payload enviado pelo webhook
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Consultoria",
  "origem": "formulario",
  "cliente_id": "uuid",
  "campanha_id": "uuid"
}
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

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

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
