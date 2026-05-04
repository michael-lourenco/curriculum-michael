# Implementação do Endpoint de Refresh Token - TikTok API

## Data: 2025-01-27

## Objetivo
Criar endpoint para atualização automática de tokens do TikTok usando refresh_token, permitindo renovar o access_token sem necessidade de re-autenticação manual.

## Alterações Realizadas

### 1. Criação do Endpoint de Refresh Token

**Arquivo:** `src/app/tiktok/api/auth/refresh/route.ts`

**Funcionalidade:**
- Endpoint POST que recebe refresh_token e retorna novo access_token
- Suporta múltiplas formas de receber o refresh_token:
  1. Cookie: `tiktok_refresh_token`
  2. Header Authorization: `Bearer <refresh_token>`
  3. Query parameter: `?refresh_token=<token>`
  4. Body JSON: `{ "refresh_token": "<token>" }`

**Características:**
- Valida formato do refresh_token
- Chama método `getRefreshAccessToken()` da classe `Authentication`
- Salva automaticamente novos tokens em cookies seguros
- Retorna resposta JSON com novos tokens e informações de expiração
- Tratamento completo de erros com mensagens descritivas

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Token atualizado com sucesso",
  "data": {
    "access_token": "act.xxx...",
    "refresh_token": "act.xxx...",
    "expires_in": 3600,
    "scope": "user.info.basic,user.info.profile",
    "token_type": "Bearer"
  },
  "token_preview": {
    "access_token": "act.xxx...xxx",
    "refresh_token": "act.xxx...xxx"
  }
}
```

**Resposta de Erro:**
```json
{
  "success": false,
  "error": "Refresh failed",
  "message": "Descrição do erro",
  "log_id": "log_id_do_tiktok"
}
```

### 2. Atualização do Callback de Autenticação

**Arquivo:** `src/app/tiktok/api/auth/callback/route.ts`

**Alterações:**
- Adicionada extração do `refresh_token` da resposta do TikTok
- Implementado salvamento do `refresh_token` em cookie seguro
- Cookie `tiktok_refresh_token` configurado com expiração de 30 dias
- Logs adicionados para diagnóstico

**Código Adicionado:**
```typescript
// Extrair refresh_token da resposta
const refreshToken = tokenResponse.data?.refresh_token || 
                    (tokenResponse as any).refresh_token || 
                    null;

// Salvar refresh_token em cookie seguro (se fornecido)
if (refreshToken) {
  const expiresIn = tokenResponse.data?.expires_in || 3600;
  response.cookies.set('tiktok_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresIn * 24 * 30, // 30 dias
    path: '/',
  });
  console.log('Refresh token salvo no cookie com sucesso');
}
```

## Estrutura de Arquivos

```
src/app/tiktok/api/auth/
├── authorize/
│   └── route.ts          # Inicia autenticação OAuth
├── callback/
│   └── route.ts          # Callback OAuth (ATUALIZADO - salva refresh_token)
├── validate/
│   └── route.ts          # Valida token
└── refresh/
    └── route.ts          # NOVO - Atualiza token usando refresh_token
```

## Como Usar

### Exemplo 1: Usando Cookie (Recomendado)
```bash
POST /tiktok/api/auth/refresh
# O refresh_token será obtido automaticamente do cookie tiktok_refresh_token
```

### Exemplo 2: Usando Header
```bash
POST /tiktok/api/auth/refresh
Authorization: Bearer <refresh_token>
```

### Exemplo 3: Usando Query Parameter
```bash
POST /tiktok/api/auth/refresh?refresh_token=<token>
```

### Exemplo 4: Usando Body JSON
```bash
POST /tiktok/api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "act.xxx..."
}
```

## Segurança

- Cookies HTTP-only (não acessíveis via JavaScript)
- Cookies seguros em produção (HTTPS apenas)
- SameSite=Lax para proteção CSRF
- Validação de formato de token antes de processar
- Tratamento de erros sem expor informações sensíveis

## Próximos Passos

1. **Implementar Refresh Automático:**
   - Criar middleware/interceptor que detecta token expirado
   - Chamar automaticamente o endpoint de refresh quando necessário
   - Implementar retry automático após refresh bem-sucedido

2. **Melhorias Futuras:**
   - Adicionar endpoint GET que retorna informações sobre tokens (sem expor valores)
   - Implementar cache de tokens com verificação de expiração
   - Adicionar métricas de uso de refresh tokens

## Notas Técnicas

- O método `getRefreshAccessToken()` já existia na classe `Authentication`, mas não estava sendo utilizado
- Refresh tokens do TikTok podem ter formato diferente de access tokens
- A expiração do refresh_token é configurada para 30 dias (pode variar conforme política do TikTok)
- O endpoint também suporta GET para retornar instruções de uso (retorna 405)

## Testes Recomendados

1. Testar refresh com token válido
2. Testar refresh com token inválido/expirado
3. Testar diferentes métodos de envio (cookie, header, query, body)
4. Verificar se cookies são salvos corretamente
5. Verificar se novos tokens funcionam após refresh

