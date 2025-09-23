# CORE Capture SaaS - Guia de Deploy

## ⚠️ Limitações da Plataforma Lovable

Este projeto foi desenvolvido na plataforma **Lovable** que possui algumas limitações para deploy em VPS:

### Arquitetura Atual vs Solicitada
- **Atual**: React + Vite + Tailwind + Supabase
- **Solicitado**: Next.js + Node.js backend + Docker

### Limitações Técnicas
1. **Framework**: Lovable usa React+Vite, não Next.js
2. **Backend**: Supabase edge functions em vez de Node.js
3. **Variáveis de ambiente**: Não suporta `VITE_*` em produção
4. **Estrutura**: Otimizada para deploy na própria plataforma Lovable

## Funcionalidades Implementadas

✅ **Painel de Edição de Landing Page**
- Edição de headline, subtítulo e texto do CTA
- Seleção entre 6 temas predefinidos
- Preview em tempo real
- URL personalizada `/lp/[cliente_id]`

✅ **Sistema de Leads Completo**
- Captura via formulário com campo 'origem'
- Integração com webhook (N8N ready)
- Importação CSV
- Gestão manual

✅ **Arquivos Docker Fornecidos**
- `Dockerfile` para containerização
- `docker-compose.yml` para orquestração
- `nginx.conf` para servidor web
- `nginx-proxy.conf` para domínios customizados

## Deploy em VPS (Limitado)

### 1. Preparação
```bash
# Clone/download dos arquivos
cp .env.example .env
# Configure as variáveis no .env
```

### 2. Build Docker
```bash
docker-compose up -d
```

### 3. Configuração Supabase
- Mantenha a configuração atual do Supabase
- URLs e chaves já estão configuradas

### 4. Domínios Customizados
- Configure DNS para apontar para seu VPS
- Ajuste `nginx-proxy.conf` com seus domínios
- Configure certificados SSL em `ssl-certs/`

## Migração Completa Recomendada

Para atender 100% dos requisitos, seria necessário:

### 1. Migração para Next.js
```bash
# Nova estrutura sugerida:
frontend/          # Next.js app
backend/           # Node.js + Express
database/          # Supabase ou PostgreSQL
docker/            # Configurações Docker
```

### 2. Backend Node.js
- Recriar as edge functions como rotas Express
- Implementar autenticação JWT
- APIs para CRUD de clientes e leads

### 3. Reestruturação do Frontend
- Migrar componentes React para Next.js
- Implementar SSR para SEO
- Configurar rotas dinâmicas

## Próximos Passos

1. **Deploy Atual**: Use os arquivos Docker fornecidos
2. **Migração Futura**: Planeje a migração para Next.js
3. **Funcionalidades**: Sistema atual está funcional
4. **Suporte**: Configure suporte a domínios customizados

## URLs de Acesso

- **Admin**: `https://seudominio.com/dashboard`
- **Landing Pages**: `https://seudominio.com/lp/[cliente_id]`
- **API**: Via Supabase edge functions

## Notas Importantes

- Sistema 100% funcional na plataforma Lovable
- Arquivos Docker são uma adaptação para VPS
- Para produção completa, recomenda-se migração arquitetural
- Supabase permanece como melhor opção para backend