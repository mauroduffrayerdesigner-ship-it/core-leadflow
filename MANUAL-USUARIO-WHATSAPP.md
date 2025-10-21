# 💬 WhatsApp Business - Guia Completo

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Configurar WhatsApp Oficial](#configurar-whatsapp-oficial)
3. [Configurar WhatsApp Venom](#configurar-whatsapp-venom)
4. [Interface de Chat](#interface-de-chat)
5. [Templates de Mensagem](#templates-de-mensagem)
6. [Histórico e Relatórios](#histórico-e-relatórios)

## Visão Geral

A plataforma oferece integração completa com WhatsApp Business em duas modalidades:

### API Oficial (Meta/Facebook)
✅ Confiável e profissional
✅ Badge verde verificado
✅ Suporte oficial
❌ Custos por conversa
❌ Templates obrigatórios

### Venom/Baileys (Não-oficial)
✅ Totalmente gratuito
✅ Sem necessidade de aprovação
✅ Flexibilidade total
❌ Risco de banimento
❌ Sem badge verificado

## Configurar WhatsApp Oficial

1. Acesse **WhatsApp** no menu
2. Selecione sua campanha
3. Clique em **Configurações** (ícone de engrenagem)
4. Preencha os dados:
   - **Business Account ID**: Obtenha no Meta Business Suite
   - **Phone Number ID**: ID do número no WhatsApp Manager
   - **Access Token**: Token permanente da API
   - **Webhook Verify Token**: Token personalizado para verificação

5. Clique em **Salvar**
6. Clique em **Testar Conexão** para validar

Para mais detalhes: [API-REFERENCE.md](./API-REFERENCE.md)

## Interface de Chat

### Layout Responsivo
- **Desktop**: 3 colunas (sidebar + lista + chat)
- **Mobile**: Navegação por abas

### Enviar Mensagens
1. Selecione uma conversa
2. Digite no campo de texto
3. Pressione Enter ou clique em Enviar

### Status das Mensagens
- 🕐 **Enviando**: Mensagem sendo processada
- ✓ **Enviada**: Entregue ao WhatsApp
- ✓✓ **Lida**: Visualizada pelo lead

## Templates de Mensagem

Acesse via **Templates** no sidebar:

1. **Criar Template**
2. Preencha:
   - Nome
   - Categoria
   - Corpo da mensagem
3. Salvar

Use variáveis: `{{nome}}`, `{{email}}`, `{{telefone}}`

## Dark Mode / Light Mode

Alterne entre temas claro e escuro:

1. **Ícone de sol/lua** no header
2. **Auto**: Segue configuração do sistema
3. **Manual**: Força light ou dark

---

Para mais informações: [README.md](./README.md)
