# 🔧 Troubleshooting - Solução de Problemas

## ❌ Problemas Comuns

### Leads não aparecem no dashboard

**Causa**: RLS policies ou filtros ativos

**Solução**:
1. Limpe todos os filtros (botão "Limpar")
2. Verifique se está logado com usuário correto
3. Confirme que o lead foi criado para seu cliente

### Emails não são enviados

**Causa**: BREVO_API_KEY não configurada ou inválida

**Solução**:
1. Verifique secret no Supabase Dashboard
2. Teste a chave no Brevo
3. Veja logs da edge function `send-campaign-email`

### Webhook não dispara

**Causa**: URL inválida ou timeout

**Solução**:
1. Teste URL manualmente (POST com Postman)
2. Verifique logs da edge function `webhook-lead`
3. Confirme que URL aceita POST
4. Timeout máximo: 30s

### Landing page não carrega

**Causa**: Campanha pausada ou ID inválido

**Solução**:
1. Verifique status da campanha (deve ser "ativa")
2. Confirme UUID correto na URL
3. Veja console do navegador para erros

## 🐛 Debug

### Ver Logs das Edge Functions

```bash
# No Supabase Dashboard
Project → Edge Functions → [function-name] → Logs
```

### Console do Navegador

```
F12 → Console
```

Procure por erros em vermelho.

### Verificar Supabase Client

```typescript
console.log('Supabase URL:', supabase.supabaseUrl)
console.log('User:', await supabase.auth.getUser())
```

## 📞 Suporte

- 📧 Email: suporte@seudominio.com
- 📖 [Documentação](./README.md)
- 🐛 [Issues no GitHub](https://github.com/seu-repo/issues)
