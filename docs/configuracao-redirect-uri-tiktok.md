# Configuração do Redirect URI do TikTok

## Situação Atual

Você tem as seguintes URLs cadastradas no TikTok for Developers:
- **Redirect URI:** `https://michaellourenco.com/tiktok`
- **Webhooks:** `https://michaellourenco.com/tiktok/webhook`

## Configuração Necessária

Para que a autenticação funcione corretamente, você precisa configurar a variável de ambiente `TIKTOK_REDIRECT_URI` no seu arquivo `.env.local` (ou variável de ambiente de produção):

### Para Produção (michaellourenco.com):

```env
TIKTOK_REDIRECT_URI=https://michaellourenco.com/tiktok
```

### Para Desenvolvimento Local:

```env
TIKTOK_REDIRECT_URI=http://localhost:3000/tiktok
```

## Como Funciona

1. Quando você clica em "Autorizar com TikTok", o sistema verifica se `TIKTOK_REDIRECT_URI` está configurada
2. Se estiver configurada, usa essa URL como redirect URI
3. Se não estiver configurada, usa `/tiktok/api/auth/callback` como padrão

## Importante

- O redirect URI usado na autorização **DEVE** corresponder exatamente ao cadastrado no TikTok for Developers
- O redirect URI usado no callback **DEVE** ser o mesmo usado na autorização
- O TikTok é muito rigoroso com a correspondência exata das URLs

## Estrutura de Rotas

### Callback em `/tiktok`

Quando `TIKTOK_REDIRECT_URI` está configurada como `/tiktok`:
- O callback é processado em `src/app/tiktok/route.ts`
- Esta rota verifica se há parâmetros de callback (`code` ou `error`)
- Se houver, processa o callback
- Se não houver, serve a página principal em `/tiktok/home`

### Callback em `/tiktok/api/auth/callback`

Quando `TIKTOK_REDIRECT_URI` não está configurada (padrão):
- O callback é processado em `src/app/tiktok/api/auth/callback/route.ts`
- Esta é a rota padrão se você não configurar a variável de ambiente

## Solução de Problemas

### Erro: "redirect_uri_mismatch"

Isso acontece quando o redirect URI usado na autorização não corresponde ao cadastrado no TikTok.

**Solução:**
1. Verifique se `TIKTOK_REDIRECT_URI` está configurada corretamente no `.env.local`
2. Certifique-se de que a URL corresponde exatamente ao cadastrado no TikTok for Developers
3. Reinicie o servidor de desenvolvimento após alterar variáveis de ambiente

### A página `/tiktok` não carrega

Isso pode acontecer se `route.ts` estiver interceptando todas as requisições.

**Solução:**
- A página principal está disponível em `/tiktok/home`
- O `route.ts` em `/tiktok` serve a página principal quando não há parâmetros de callback

## Próximos Passos

1. Configure `TIKTOK_REDIRECT_URI` no seu `.env.local` ou variáveis de ambiente de produção
2. Reinicie o servidor
3. Teste a autenticação novamente

