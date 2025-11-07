# Step-by-Step: Correção do Erro "invalid_scope" na Autenticação TikTok

## Data: 2025-01-27

## Problema Identificado

Ao tentar autenticar com o TikTok, o usuário recebeu o erro:
```
error=invalid_scope
error_type=scope
```

O erro ocorre quando:
1. Os escopos solicitados não estão habilitados no app do TikTok for Developers
2. O formato dos escopos está incorreto
3. Os nomes dos escopos estão incorretos

### URL do Erro:
```
https://www.tiktok.com/v2/auth/authorize/?client_key=...&scope=user.info.basic%2Cvideo.list&error=invalid_scope&error_type=scope
```

## Análise do Problema

O erro `invalid_scope` é retornado pelo TikTok quando:
- Os escopos solicitados não estão configurados no app do desenvolvedor
- Os escopos não são válidos para o tipo de app (sandbox vs produção)
- O formato dos escopos na URL está incorreto

## Soluções Implementadas

### 1. Melhorias no Callback de Autenticação

**Arquivo:** `src/app/tiktok/api/auth/callback/route.ts`

**Alterações realizadas:**

1. **Redirecionamento para páginas de erro/sucesso:**
   - Em vez de retornar JSON, agora redireciona para páginas HTML amigáveis
   - Adicionado tratamento específico para diferentes tipos de erro
   - Captura de `error_description` e `error_type` da URL

2. **Tratamento de erros específicos:**
   - `invalid_scope`: Redireciona para página de erro com instruções
   - `no_code`: Código de autorização não fornecido
   - `no_code_verifier`: Problema com PKCE
   - `token_error`: Erro ao obter token

3. **Armazenamento de token:**
   - Token de acesso salvo em cookie seguro (httpOnly, secure em produção)
   - Redirecionamento para página de sucesso após autenticação bem-sucedida

**Código antes:**
```typescript
if (error) {
  return NextResponse.json(
    { error: 'Authorization failed', error_description: error },
    { status: 400 }
  );
}
```

**Código depois:**
```typescript
if (error) {
  const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
  errorPageUrl.searchParams.set('error', error);
  if (errorDescription) {
    errorPageUrl.searchParams.set('error_description', errorDescription);
  }
  if (errorType) {
    errorPageUrl.searchParams.set('error_type', errorType);
  }
  return NextResponse.redirect(errorPageUrl.toString());
}
```

### 2. Alteração do Escopo Padrão

**Arquivo:** `src/app/tiktok/api/auth/authorize/route.ts`

**Alteração realizada:**
- Mudança do escopo padrão de `user.info.basic,video.list` para apenas `user.info.basic`
- Isso permite testar com o escopo mais básico primeiro
- Escopos adicionais podem ser passados via query parameter

**Antes:**
```typescript
const scope = searchParams.get('scope') || 'user.info.basic,video.list';
```

**Depois:**
```typescript
// Por padrão, usar apenas user.info.basic que é o escopo mais básico
// Você pode adicionar mais escopos separados por vírgula: user.info.basic,video.list
const scope = searchParams.get('scope') || 'user.info.basic';
```

### 3. Criação de Página de Erro Amigável

**Arquivo:** `src/app/tiktok/auth/error/page.tsx` (NOVO)

**Funcionalidades:**
- Página React client-side com tratamento específico para cada tipo de erro
- Instruções detalhadas para corrigir o erro `invalid_scope`
- Links para documentação do TikTok
- Botões para tentar novamente ou voltar
- Exibição de detalhes técnicos do erro

**Recursos principais:**
- Tratamento específico para `invalid_scope` com instruções passo a passo
- Mensagens em português
- Links diretos para o TikTok for Developers
- Design responsivo e acessível
- Uso de Suspense para compatibilidade com Next.js

### 4. Criação de Página de Sucesso

**Arquivo:** `src/app/tiktok/auth/success/page.tsx` (NOVO)

**Funcionalidades:**
- Confirmação visual de autenticação bem-sucedida
- Exibição dos escopos autorizados
- Links para próximos passos (ver informações do usuário)
- Design responsivo e acessível

### 5. Melhorias na Página Principal

**Arquivo:** `src/app/tiktok/page.tsx`

**Alterações realizadas:**
- Adição de dois botões de autenticação:
  1. Autenticação com apenas `user.info.basic` (recomendado para começar)
  2. Autenticação com `user.info.basic,video.list` (escopos completos)
- Adição de aviso sobre erro de escopo inválido
- Instruções claras sobre como habilitar escopos no TikTok for Developers

**Código adicionado:**
```tsx
<div className="space-y-3">
  <div>
    <a href="/tiktok/api/auth/authorize?scope=user.info.basic">
      Autorizar com TikTok (Apenas user.info.basic)
    </a>
    <p>Escopo básico - recomendado para começar</p>
  </div>
  <div>
    <a href="/tiktok/api/auth/authorize?scope=user.info.basic,video.list">
      Autorizar com TikTok (user.info.basic + video.list)
    </a>
    <p>Escopos completos - certifique-se de que estão habilitados no app</p>
  </div>
</div>
<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
  <p>
    <strong>⚠️ Importante:</strong> Se receber erro de "invalid_scope", 
    você precisa habilitar os escopos no TikTok for Developers.
  </p>
</div>
```

## Arquivos Criados

1. **`src/app/tiktok/auth/error/page.tsx`**
   - Função: Exibir erros de autenticação de forma amigável
   - Recurso: Instruções detalhadas para resolver problemas

2. **`src/app/tiktok/auth/success/page.tsx`**
   - Função: Confirmar autenticação bem-sucedida
   - Recurso: Mostrar escopos autorizados e próximos passos

## Arquivos Modificados

1. **`src/app/tiktok/api/auth/callback/route.ts`**
   - Função: Processar callback de autenticação OAuth
   - Alteração: Melhor tratamento de erros e redirecionamento para páginas HTML

2. **`src/app/tiktok/api/auth/authorize/route.ts`**
   - Função: Iniciar processo de autenticação OAuth
   - Alteração: Escopo padrão alterado para `user.info.basic` apenas

3. **`src/app/tiktok/page.tsx`**
   - Função: Página principal do SDK TikTok
   - Alteração: Adicionados botões para testar diferentes escopos

## Como Resolver o Erro "invalid_scope"

### Passo a Passo:

1. **Acesse o TikTok for Developers:**
   - Vá para: https://developers.tiktok.com/apps
   - Faça login com sua conta

2. **Selecione seu App:**
   - Clique no app que você está usando

3. **Habilite os Escopos:**
   - Vá até a seção "Products" ou "Scopes"
   - Procure por "Login Kit" ou "OAuth Scopes"
   - Habilite os escopos necessários:
     - `user.info.basic` - Informações básicas do usuário
     - `video.list` - Listar vídeos do usuário

4. **Salve as Alterações:**
   - Clique em "Save" ou "Update"

5. **Teste Novamente:**
   - Volte para o app e tente autenticar novamente
   - Comece testando apenas com `user.info.basic`
   - Se funcionar, adicione mais escopos gradualmente

### Notas Importantes:

- **App em Sandbox:** Alguns escopos podem não estar disponíveis até o app ser aprovado
- **Aprovação Necessária:** Escopos avançados podem precisar de aprovação do TikTok
- **Redirect URI:** Certifique-se de que o redirect URI está configurado corretamente no app

## Resultado

Após as correções:
- Usuários recebem mensagens de erro claras e acionáveis
- Instruções passo a passo para resolver problemas
- Possibilidade de testar com escopos individuais
- Melhor experiência do usuário durante a autenticação
- Tratamento adequado de todos os tipos de erro

## Próximos Passos (se necessário)

- Adicionar mais validações de escopos antes de fazer a requisição
- Criar uma página de configuração para gerenciar escopos
- Adicionar logging mais detalhado para debug
- Implementar cache de tokens com refresh automático
- Adicionar testes automatizados para fluxo de autenticação

## Documentação de Referência

- [TikTok Login Kit - Web](https://developers.tiktok.com/doc/login-kit-web)
- [TikTok API Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes)
- [TikTok OAuth User Access Token Management](https://developers.tiktok.com/doc/oauth-user-access-token-management)
- [TikTok for Developers - Manage Apps](https://developers.tiktok.com/apps)

