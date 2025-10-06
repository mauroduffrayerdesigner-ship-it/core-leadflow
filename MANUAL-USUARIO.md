# 📖 Manual do Usuário - Plataforma de Marketing e Vendas

> Guia completo e didático para usar todas as funcionalidades da plataforma

## 📑 Índice

1. [Primeiros Passos](#-primeiros-passos)
2. [Dashboard Principal](#-dashboard-principal)
3. [Gestão de Clientes](#-gestão-de-clientes)
4. [Campanhas de Marketing](#-campanhas-de-marketing)
5. [Landing Pages](#-landing-pages)
6. [Gestão de Leads](#-gestão-de-leads)
7. [Email Marketing](#-email-marketing)
8. [Integrações e Webhooks](#-integrações-e-webhooks)
9. [Métricas e Relatórios](#-métricas-e-relatórios)
10. [Dicas e Melhores Práticas](#-dicas-e-melhores-práticas)

---

## 🚀 Primeiros Passos

### Cadastro e Login

1. **Acesse a plataforma** no seu navegador
2. **Clique em "Criar conta"**
3. **Preencha seus dados**:
   - Email profissional
   - Senha segura (mínimo 6 caracteres)
4. **Confirme seu email** (se habilitado)
5. **Faça login** com suas credenciais

> 💡 **Dica**: Use um email profissional para receber notificações importantes da plataforma.

### Tour Inicial - Wizard de Onboarding

Na primeira vez que você acessa, um **wizard de boas-vindas** vai guiá-lo:

**Passo 1: Criar seu primeiro cliente**
- Nome da empresa ou projeto
- Email de contato
- Logo (opcional)

**Passo 2: Configurar sua primeira campanha**
- Nome da campanha (ex: "Lançamento de Produto")
- Descrição
- Tema da landing page

**Passo 3: Personalizar textos**
- Headline principal
- Subtítulo
- Texto do botão (CTA)

**Passo 4: Pronto para capturar leads!**
- Link da landing page gerado
- QR Code disponível
- Painel de leads ativo

> ✅ **Você pode pular o wizard** e configurar tudo manualmente depois.

### Entendendo os Conceitos

| Conceito | Descrição |
|----------|-----------|
| **Cliente** | Representa uma empresa, projeto ou marca que você gerencia |
| **Campanha** | Uma ação de marketing vinculada a um cliente (ex: lançamento, promoção) |
| **Landing Page** | Página de captura personalizada para cada campanha |
| **Lead** | Pessoa interessada que preencheu o formulário |
| **Tema** | Design visual pré-configurado para landing pages e emails |
| **Webhook** | URL que recebe leads automaticamente para integrações |

---

## 📊 Dashboard Principal

O dashboard é sua central de comando com visão geral de tudo que está acontecendo.

### Métricas Principais (Cards superiores)

**Total de Leads**
- Quantidade de leads capturados no mês atual
- Comparação com mês anterior (↑ ou ↓)
- Todas as origens incluídas

**Taxa de Conversão**
- % de leads que se tornaram "convertidos"
- Cálculo: (Leads convertidos / Total) × 100
- Meta recomendada: acima de 20%

**Leads por Origem**
- Formulário: capturados pela landing page
- CSV: importados manualmente
- N8N/Webhook: recebidos via integração
- Manual: adicionados um a um

**Campanhas Ativas**
- Número de campanhas com status "ativa"
- Clique para ver detalhes

### Filtro por Campanha

No topo do dashboard, você pode filtrar todas as métricas por campanha específica:

1. Clique no **select "Filtrar por campanha"**
2. Escolha uma campanha ou deixe em "Todas"
3. Os cards e gráficos atualizam automaticamente

### Atividade Recente

Mostra em tempo real as últimas ações:

- 🟢 **Novo Lead**: "João Silva se inscreveu há 5 minutos"
- 📧 **Email Enviado**: "Email de boas-vindas enviado para Maria"
- ✅ **Conversão**: "Pedro Souza marcado como convertido"

### Ações Rápidas

Botões de acesso rápido:
- ➕ **Nova Campanha**
- 👥 **Adicionar Lead Manual**
- 📧 **Enviar Email em Massa**
- 📤 **Exportar Dados**

---

## 🏢 Gestão de Clientes

Os clientes são a base da sua estrutura organizacional.

### Criar Novo Cliente

1. No menu, vá em **"Clientes"** (ou use o wizard inicial)
2. Clique em **"+ Novo Cliente"**
3. Preencha:
   - **Nome**: Nome da empresa/projeto
   - **Email**: Email de contato principal
   - **Logo**: Upload de imagem (opcional)
   - **Domínio Personalizado**: seu-dominio.com (opcional)
   - **Webhook URL**: Para integrações (opcional)

4. Configure a **Landing Page Padrão**:
   - Headline
   - Subtítulo
   - Texto do botão
   - Tema visual (6 opções)

5. Clique em **"Salvar Cliente"**

> 📌 **Nota**: Um cliente pode ter múltiplas campanhas. É como uma pasta organizadora.

### Configurar Domínio Personalizado

Para usar seu próprio domínio (ex: `captura.suaempresa.com`):

1. **No seu provedor DNS**, crie um registro CNAME:
   ```
   Tipo: CNAME
   Nome: captura (ou subdomínio desejado)
   Valor: [fornecido-pelo-suporte]
   TTL: 3600
   ```

2. **Na plataforma**, em Configurações do Cliente:
   - Campo "Domínio Personalizado": `captura.suaempresa.com`
   - Salve

3. **Aguarde propagação DNS** (até 24h)

4. **Teste acessando** seu domínio personalizado

> ⚠️ **Importante**: Domínios personalizados requerem configuração técnica. Entre em contato com o suporte se precisar de ajuda.

---

## 🎯 Campanhas de Marketing

Campanhas são ações específicas de captação de leads.

### Criar Nova Campanha

1. No menu, clique em **"Campanhas"**
2. Botão **"+ Nova Campanha"**
3. Preencha os dados:

**Aba: Informações Básicas**
- Nome da campanha (ex: "Black Friday 2025")
- Descrição (opcional)
- Cliente vinculado (dropdown)
- Status (Ativa/Pausada)

**Aba: Landing Page**
- Tema visual (6 opções disponíveis)
- Headline (título principal)
- Subtítulo (texto de apoio)
- Texto do botão (ex: "Quero saber mais")
- Logo (se diferente do cliente)

**Aba: Emails**
- Template de boas-vindas
- Assinatura de email
- Remetente (nome e email)
- Envio automático (on/off)

**Aba: Integrações**
- Webhook URL personalizada (sobrescreve a do cliente)
- Domínio personalizado (sobrescreve a do cliente)

4. **Salve a campanha**

### Editar Campanha Existente

Na lista de campanhas:

1. Clique nos **"..."** (três pontinhos) do card
2. Escolha **"Editar"**
3. Faça as alterações
4. Salve

### Preview da Landing Page

Antes de compartilhar, visualize como ficou:

1. No card da campanha, clique em **"Ver Preview"**
2. Abre modal com preview responsivo
3. Teste o formulário (dados fictícios)
4. Se precisar ajustar, feche e edite

### Obter Link e QR Code

Cada campanha tem:

**Link Direto**: 
```
https://seudominio.com/lp/abc123-def456-ghi789
```

**QR Code**:
- Gerado automaticamente
- Clique para baixar PNG
- Use em materiais impressos

**Como compartilhar**:
- 📱 Envie link por WhatsApp
- 📧 Inclua em emails
- 📄 Imprima QR Code em flyers
- 🌐 Compartilhe nas redes sociais

---

## 🎨 Landing Pages

As landing pages são suas páginas de captura personalizadas.

### Temas Disponíveis

1. **Moderno Minimalista** - Clean, foco no conteúdo
2. **Corporativo Elegante** - Profissional e confiável
3. **Tech Startup** - Moderno, gradientes, tech vibe
4. **Criativo Colorido** - Vibrante, chamativo
5. **E-commerce Focus** - Otimizado para produtos
6. **Consultoria Premium** - Sofisticado, premium

> 💡 **Dica**: Teste diferentes temas e veja qual converte melhor com seu público!

### Personalizar Textos

**Headline** (Título principal):
- Seja claro e direto
- Máximo 60 caracteres
- Destaque o benefício principal
- Exemplo: "Transforme Visitantes em Clientes"

**Subtítulo**:
- Complemente a headline
- Máximo 120 caracteres
- Adicione contexto
- Exemplo: "Capture leads qualificados com landing pages profissionais"

**Texto do CTA** (Botão):
- Use verbos de ação
- 2-4 palavras
- Crie urgência
- Exemplos: "Começar Agora", "Quero Saber Mais", "Garantir Desconto"

### Campos do Formulário

Por padrão, a landing page captura:

- ✅ Nome completo (obrigatório)
- ✅ Email (obrigatório)
- ✅ Telefone (opcional)
- ✅ Interesse (opcional - área de texto livre)

> 📝 Campos customizados podem ser adicionados sob demanda.

### Preview Responsivo

A landing page é 100% responsiva:

- 💻 Desktop: Layout completo
- 📱 Mobile: Otimizado para toque
- 📲 Tablet: Adaptação automática

Teste em diferentes dispositivos antes de compartilhar.

---

## 👥 Gestão de Leads

O coração da plataforma: gerenciar contatos capturados.

### Visualizar Leads

1. Menu **"Leads"**
2. Tabela mostra todos os leads com:
   - Nome
   - Email
   - Telefone
   - Status (badge colorido)
   - Origem (ícone)
   - Data de captura
   - Campanha vinculada

### Filtros Avançados

**Barra de Filtros** (sempre visível):

**Por Status**:
- Novo 🟡
- Qualificado 🔵
- Convertido 🟢
- Perdido 🔴

**Por Origem**:
- 📝 Formulário (landing page)
- 📄 CSV (importação)
- 🔗 N8N/Webhook
- ✏️ Manual

**Por Período**:
- Hoje
- Últimos 7 dias
- Últimos 30 dias
- Personalizado (date picker)

**Por Campanha**:
- Dropdown com todas as campanhas
- Filtro múltiplo

**Busca por Texto**:
- Busca em nome, email ou telefone
- Tempo real

### Adicionar Lead Manualmente

1. Botão **"+ Adicionar Lead"**
2. Preencha:
   - Nome (obrigatório)
   - Email (obrigatório)
   - Telefone
   - Interesse
   - Campanha (obrigatório)
   - Status inicial

3. **Salvar**

> Útil para leads offline: eventos, feiras, reuniões presenciais.

### Importar Leads via CSV

**Passo a Passo**:

1. Clique em **"Importar CSV"**
2. **Baixe o template** (botão na modal)
3. Preencha o CSV com seus dados:
   ```csv
   nome,email,telefone,interesse,origem,status
   João Silva,joao@email.com,11999999999,Produto X,csv,novo
   Maria Santos,maria@email.com,11888888888,Serviço Y,csv,qualificado
   ```

4. **Selecione a campanha** de destino
5. **Upload do arquivo** (arraste ou clique)
6. **Revise a prévia** (primeiras 5 linhas)
7. **Confirme importação**

**Regras de Importação**:
- ✅ Máximo 1.000 leads por vez
- ✅ Campos obrigatórios: nome, email
- ✅ Emails duplicados são ignorados
- ✅ Status padrão: "novo"
- ✅ Formatos aceitos: .csv, .txt

### Exportar Leads

1. Aplique **filtros desejados** (ou deixe "todos")
2. Botão **"Exportar CSV"**
3. Arquivo baixado com:
   - Todos os campos
   - Leads filtrados
   - Nome: `leads_[data].csv`

> 💾 Faça backups regulares dos seus leads!

### Atualizar Status de Leads

**Individual**:
1. Clique no lead
2. Dropdown de status
3. Selecione novo status
4. Adicione notas (opcional)
5. Salvar

**Em Massa** (Bulk Actions):
1. Selecione múltiplos leads (checkbox)
2. Barra superior aparece
3. Dropdown **"Ações em Lote"**
4. "Marcar como [status]"
5. Confirme

> ⚡ Agilize o workflow atualizando vários leads de uma vez!

### Notas e Histórico

Cada lead tem uma timeline de atividades:

- 📝 Notas adicionadas
- 🔄 Mudanças de status
- 📧 Emails enviados
- 🕐 Data/hora de cada ação

**Adicionar Nota**:
1. Abra o lead
2. Campo "Notas"
3. Escreva observações
4. Salvar

Exemplo: "Cliente solicitou orçamento personalizado"

---

## 📧 Email Marketing

Envie emails personalizados para seus leads.

### Templates de Email

**4 Temas Profissionais**:

1. **Email Moderno** - Design clean, atual
2. **Email Profissional** - Corporativo, sóbrio
3. **Email Newsletter** - Formato informativo
4. **Email Corporativo** - Institucional, formal

### Criar Template Personalizado

1. Menu **"Campanhas"** > Editar Campanha
2. Aba **"Emails"**
3. **"+ Novo Template"**
4. Preencha:
   - Nome do template
   - Assunto do email
   - Corpo (HTML ou editor visual)
   - Tipo (boas-vindas, follow-up, etc.)

**Variáveis Disponíveis**:
```
{{nome}}      - Nome do lead
{{email}}     - Email do lead
{{telefone}}  - Telefone do lead
{{empresa}}   - Nome da empresa/cliente
{{campanha}}  - Nome da campanha
```

Exemplo:
```html
Olá {{nome}},

Obrigado por se interessar pela nossa {{campanha}}!

Entraremos em contato em breve pelo número {{telefone}}.

Atenciosamente,
{{empresa}}
```

### Assinaturas de Email

Crie assinaturas HTML profissionais:

1. **"+ Nova Assinatura"**
2. Preencha:
   - Nome
   - Cargo
   - Empresa
   - Email
   - Telefone
   - Website
   - Redes sociais (LinkedIn, Instagram, etc.)
   - Logo

3. Escolha template visual
4. Salvar

A assinatura é automaticamente incluída nos emails da campanha.

### Envio Manual de Emails

1. Vá em **"Leads"**
2. Selecione o(s) lead(s)
3. Botão **"Enviar Email"**
4. Escolha:
   - Template
   - Personalize assunto (opcional)
   - Preview antes de enviar
5. **Enviar**

### Envio Automático

Configure emails automáticos quando um lead é capturado:

1. Editar Campanha
2. Aba **"Emails"**
3. Toggle **"Envio Automático"** = ON
4. Selecione **template de boas-vindas**
5. Salvar

> 🤖 Todo lead novo recebe email automaticamente!

**Exemplo de Fluxo**:
1. Lead preenche formulário
2. Dados salvos no banco
3. Email automático enviado (se ativo)
4. Webhook dispara (se configurado)
5. Lead aparece no dashboard

### Logs de Email

Acompanhe todos os envios:

1. Menu **"Campanhas"** > Detalhes
2. Aba **"Emails Enviados"**
3. Veja:
   - Destinatário
   - Assunto
   - Status (Enviado ✅ ou Falha ❌)
   - Data/hora
   - ID do provedor (Brevo)
   - Erro (se houver)

**Status possíveis**:
- ✅ **Enviado**: Email aceito pelo servidor
- ❌ **Falha**: Erro no envio (verifique logs)
- ⏳ **Processando**: Aguardando provedor

---

## 🔗 Integrações e Webhooks

Conecte a plataforma com suas ferramentas de automação.

### O que é um Webhook?

Um webhook é uma **URL que recebe dados automaticamente** quando algo acontece na plataforma.

**Exemplo prático**:
1. Lead preenche formulário
2. Plataforma envia dados para seu webhook
3. N8N/Make/Zapier recebe e processa
4. Você pode: enviar para CRM, notificar no Slack, criar tarefa, etc.

### Configurar Webhook

**Nível Cliente** (todos os leads do cliente):
1. Editar Cliente
2. Campo **"Webhook URL"**
3. Cole a URL do seu webhook
   - N8N: `https://seu-n8n.com/webhook/xyz`
   - Make: `https://hook.make.com/abc123`
   - Zapier: `https://hooks.zapier.com/def456`
4. Salvar

**Nível Campanha** (sobrescreve o do cliente):
1. Editar Campanha
2. Aba **"Integrações"**
3. Campo **"Webhook URL"**
4. Salvar

### Payload Enviado

Quando um lead é capturado, enviamos este JSON:

```json
{
  "id": "uuid-do-lead",
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "+5511999999999",
  "interesse": "Gostaria de conhecer o produto X",
  "origem": "formulario",
  "status": "novo",
  "data_criacao": "2025-10-06T14:30:00Z",
  "cliente_id": "uuid-do-cliente",
  "cliente_nome": "Minha Empresa",
  "campanha_id": "uuid-da-campanha",
  "campanha_nome": "Black Friday 2025"
}
```

### Exemplos de Integração

**N8N**:
1. Crie workflow
2. Adicione nó **"Webhook"**
3. Método: POST
4. Copie a URL gerada
5. Cole na plataforma

**Make (Integromat)**:
1. Crie cenário
2. Adicione módulo **"Webhooks" > "Custom webhook"**
3. Copie URL
4. Cole na plataforma

**Zapier**:
1. Crie Zap
2. Trigger: **"Webhooks by Zapier" > "Catch Hook"**
3. Copie URL
4. Cole na plataforma

### Testar Webhook

1. Configure a URL do webhook
2. Adicione um lead de teste manualmente
3. Verifique se chegou na sua ferramenta
4. Confira o payload recebido

> 🧪 Sempre teste antes de ativar em produção!

### Casos de Uso Comuns

**CRM Integration**:
- Lead novo → Criar contato no CRM (RD Station, Pipedrive, HubSpot)

**Notificações**:
- Lead VIP → Notificar no Slack/Telegram
- Lead qualificado → Email para vendedor

**Automações**:
- Lead capturado → Adicionar em sequência de emails
- Lead convertido → Criar tarefa no Trello/Asana

**Análise**:
- Todos os leads → Enviar para Google Sheets
- Métricas → Atualizar dashboard externo

---

## 📈 Métricas e Relatórios

Acompanhe a performance das suas campanhas.

### Dashboard de Métricas

**Visão Geral**:
- Total de leads (mês atual vs anterior)
- Taxa de conversão
- Leads por origem
- Campanhas ativas

**Filtros**:
- Por campanha específica
- Por período (hoje, semana, mês, custom)
- Por status
- Por origem

### Métricas por Campanha

Acesse detalhes de uma campanha:

1. Menu **"Campanhas"**
2. Clique no card da campanha
3. Aba **"Métricas"**

**Dados disponíveis**:
- 📊 Total de leads capturados
- 📈 Leads por dia (gráfico)
- 🎯 Taxa de conversão
- 📍 Distribuição por origem
- 📧 Emails enviados
- 🔄 Funil de conversão:
  - Novos → Qualificados → Convertidos

**Gráfico Interativo**:
- Timeline dos últimos 30 dias
- Hover para ver números exatos
- Exportar como imagem (screenshot)

### Comparativos

Compare performance entre:

**Campanhas**:
- Qual campanha gera mais leads?
- Qual tem melhor taxa de conversão?

**Períodos**:
- Mês atual vs mês passado
- Semana atual vs semana passada

**Origens**:
- Formulário vs CSV vs Webhook
- Qual canal é mais efetivo?

### Exportação de Relatórios

Gere relatórios customizados:

1. Aplique filtros desejados
2. **"Exportar CSV"**
3. Abra no Excel/Google Sheets
4. Crie gráficos e análises personalizadas

**Dados exportados**:
- Todos os campos do lead
- Data de captura
- Status atual
- Origem
- Campanha vinculada
- Histórico de mudanças

---

## 💡 Dicas e Melhores Práticas

### Criação de Landing Pages

✅ **Faça**:
- Headline clara e objetiva
- CTA visível e chamativo
- Peça apenas dados essenciais
- Teste diferentes temas
- Use imagens de qualidade
- Otimize para mobile

❌ **Evite**:
- Textos longos demais
- Formulários extensos
- CTAs genéricos ("Enviar", "OK")
- Distrações visuais
- Dados sensíveis sem LGPD

### Gestão de Leads

✅ **Boas Práticas**:
- Responda leads em até 24h
- Atualize status regularmente
- Use notas para contexto
- Segmente por interesse
- Faça follow-up consistente
- Exporte backups semanais

❌ **Evite**:
- Deixar leads sem resposta
- Status desatualizados
- Perder contexto das conversas
- Misturar leads de campanhas diferentes

### Email Marketing

✅ **Recomendações**:
- Assunto atraente (max 50 caracteres)
- Personalize com variáveis
- Inclua CTA claro
- Assinatura profissional
- Teste antes de enviar
- Respeite horários comerciais

❌ **Evite**:
- SPAM (assuntos enganosos)
- Emails muito longos
- Imagens pesadas
- Envios em massa sem segmentação
- Links quebrados

### Integrações

✅ **Segurança**:
- Use HTTPS em webhooks
- Valide dados recebidos
- Teste em ambiente de homologação
- Monitore logs de erro
- Tenha fallback se webhook falhar

❌ **Riscos**:
- Webhooks públicos sem autenticação
- Não tratar erros
- Expor dados sensíveis
- Depender 100% de integração externa

### Performance

🚀 **Otimização**:
- Importe leads em lotes (max 1.000)
- Use filtros antes de exportar
- Arquive campanhas antigas
- Limpe leads duplicados
- Monitore taxa de conversão

📊 **KPIs Recomendados**:
- Taxa de conversão: > 20%
- Tempo de resposta: < 24h
- Leads qualificados: > 40%
- Open rate de emails: > 25%
- Click rate: > 5%

### LGPD e Privacidade

⚖️ **Conformidade**:
- Adicione política de privacidade na landing page
- Checkbox de aceite de termos
- Permita opt-out de emails
- Não compartilhe dados sem consentimento
- Exclua dados quando solicitado

**Exemplo de texto**:
> "Ao enviar este formulário, você concorda com nossa [Política de Privacidade](#) e aceita receber comunicações via email. Você pode cancelar a qualquer momento."

---

## ❓ FAQ - Perguntas Frequentes

**1. Posso usar meu próprio domínio?**
Sim! Configure um domínio personalizado por cliente ou campanha. Requer configuração DNS.

**2. Quantos leads posso capturar?**
Ilimitados! Não há limite de leads na plataforma.

**3. Os emails são enviados automaticamente?**
Apenas se você ativar a opção "Envio Automático" na campanha.

**4. Posso importar leads de outra plataforma?**
Sim, via CSV. Baixe o template e preencha com seus dados.

**5. Como funciona a cobrança de emails?**
Emails são enviados via Brevo. Verifique o plano da sua conta Brevo.

**6. Posso ter múltiplas campanhas para um cliente?**
Sim! Um cliente pode ter quantas campanhas desejar.

**7. Os webhooks funcionam em tempo real?**
Sim, disparados imediatamente após captura do lead.

**8. Posso customizar os campos do formulário?**
Entre em contato com o suporte para campos customizados.

**9. Há limite de usuários?**
Não, você pode ter quantos usuários precisar.

**10. Como faço backup dos meus dados?**
Exporte seus leads em CSV regularmente.

---

## 📞 Suporte

Precisa de ajuda?

- 📖 [Documentação Técnica](./MANUAL-DEPLOY.md)
- 🐛 [Reportar Bug](https://github.com/seu-repo/issues)
- 💬 [FAQ Técnico](./TROUBLESHOOTING.md)
- 📧 Email: suporte@seudominio.com

---

**Desenvolvido com ❤️ para facilitar sua gestão de leads**
