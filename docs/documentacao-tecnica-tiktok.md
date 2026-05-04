# Documentação Técnica - Integração TikTok

## Data: 2025-01-27

## Visão Geral do Projeto

Este documento descreve a implementação completa da integração com a API do TikTok para autenticação de usuários e publicação de vídeos. O projeto foi desenvolvido em **Next.js 14** com **TypeScript** e utiliza o padrão OAuth 2.0 com PKCE (Proof Key for Code Exchange) para autenticação segura.

### Funcionalidades Implementadas

1. **Autenticação OAuth 2.0 com PKCE** - Login seguro de usuários
2. **Gerenciamento de Escopos** - Solicitação e validação de permissões
3. **Upload de Vídeos** - Publicação direta ou como rascunho
4. **Validação de Capacidades** - Verificação de limites e permissões do criador
5. **Gerenciamento de Tokens** - Armazenamento seguro em cookies HTTP-only

### Estrutura do Projeto

```
src/
├── app/tiktok/              # Rotas e páginas do TikTok
│   ├── api/                 # API Routes
│   │   ├── auth/            # Autenticação
│   │   │   ├── authorize/   # Inicia fluxo OAuth
│   │   │   └── callback/    # Recebe callback do TikTok
│   │   └── videos/          # Upload de vídeos
│   │       └── publish/     # Endpoint de publicação
│   └── publish/             # Interface de upload
├── lib/tiktok/              # SDK do TikTok
│   ├── TikTok.ts            # Classe base
│   ├── authentication/      # Módulo de autenticação
│   ├── post/                # Módulo de publicação
│   └── request/             # Cliente HTTP e utilitários
```

---

## 1. Autenticação do Usuário

### 1.1 Fluxo de Autenticação OAuth 2.0 com PKCE

O TikTok requer o uso de **PKCE (Proof Key for Code Exchange)** para autenticação OAuth 2.0, um padrão de segurança que previne ataques de interceptação de código.

#### Arquivos Principais

- **`src/app/tiktok/api/auth/authorize/route.ts`** - Inicia o fluxo de autenticação
- **`src/app/tiktok/api/auth/callback/route.ts`** - Processa o callback do TikTok
- **`src/lib/tiktok/authentication/Authentication.ts`** - Classe de autenticação
- **`src/lib/tiktok/request/constants.ts`** - Utilitários PKCE

### 1.2 Processo Passo a Passo

#### Passo 1: Solicitar Autorização (`/tiktok/api/auth/authorize`)

Quando o usuário acessa a rota de autorização, o sistema:

1. **Gera par PKCE** (code verifier + code challenge):
```typescript
const { codeVerifier, codeChallenge } = await PKCE.generatePair();
```

2. **Armazena o code verifier** em cookie seguro (HTTP-only):
```typescript
response.cookies.set('tiktok_code_verifier', codeVerifier, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 600, // 10 minutos
  path: '/',
});
```

3. **Constrói URL de autorização** com os parâmetros necessários:
```typescript
const authUrl = auth.getAuthenticationUrl(redirectUri, scope, state, codeChallenge);
```

4. **Redireciona o usuário** para o TikTok:
```typescript
return NextResponse.redirect(authUrl);
```

**Código de Referência:**
```8:71:src/app/tiktok/api/auth/authorize/route.ts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Por padrão, usar apenas user.info.basic que é o escopo mais básico
    // Você pode adicionar mais escopos separados por vírgula: user.info.basic,video.list
    let scope = searchParams.get('scope') || 'user.info.basic';
    
    // Limpar e normalizar escopos: remover espaços extras e garantir formato correto
    scope = scope
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(',');
    
    const state = searchParams.get('state') || '';

    const { codeVerifier, codeChallenge } = await PKCE.generatePair();

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    // Usar a variável de ambiente se configurada
    // IMPORTANTE: Se você tem /tiktok cadastrado no TikTok for Developers,
    // configure TIKTOK_REDIRECT_URI=https://michaellourenco.com/tiktok no .env
    // Caso contrário, usa /tiktok/api/auth/callback como padrão
    const redirectUri = process.env.TIKTOK_REDIRECT_URI 
      ? process.env.TIKTOK_REDIRECT_URI.replace('{origin}', request.nextUrl.origin)
      : `${request.nextUrl.origin}/tiktok/api/auth/callback`;
    
    // Log para diagnóstico dos escopos solicitados
    console.log('=== AUTHORIZATION REQUEST DEBUG ===');
    console.log('Scopes requested:', scope);
    console.log('Scopes type:', typeof scope);
    console.log('Scopes split:', scope.split(','));
    console.log('Redirect URI:', redirectUri);
    
    const authUrl = auth.getAuthenticationUrl(redirectUri, scope, state, codeChallenge);
    
    // Log da URL gerada para verificar formato
    console.log('Generated auth URL:', authUrl);
    console.log('URL contains scopes:', authUrl.includes('scope='));

    const response = NextResponse.redirect(authUrl);

    response.cookies.set('tiktok_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error in auth authorize:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
```

#### Passo 2: Callback do TikTok (`/tiktok/api/auth/callback`)

Após o usuário autorizar no TikTok, ele é redirecionado de volta com um código de autorização:

1. **Extrai o código de autorização** da query string:
```typescript
const code = searchParams.get('code');
```

2. **Recupera o code verifier** do cookie:
```typescript
const codeVerifier = request.cookies.get('tiktok_code_verifier')?.value;
```

3. **Troca o código por um access token**:
```typescript
const tokenResponse = await auth.getAccessTokenFromCode(code, redirectUri, codeVerifier);
```

4. **Armazena tokens em cookies seguros**:
   - `tiktok_access_token` - Token de acesso (HTTP-only)
   - `tiktok_refresh_token` - Token de renovação (HTTP-only)
   - `tiktok_scopes` - Escopos concedidos (não HTTP-only, para diagnóstico)

**Código de Referência:**
```7:199:src/app/tiktok/api/auth/callback/route.ts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const errorType = searchParams.get('error_type');

    // Se houver erro na autenticação, redirecionar para página de erro
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

    if (!code) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'no_code');
      errorPageUrl.searchParams.set('error_description', 'Código de autorização não fornecido');
      return NextResponse.redirect(errorPageUrl.toString());
    }

    const codeVerifier = request.cookies.get('tiktok_code_verifier')?.value;

    if (!codeVerifier) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'no_code_verifier');
      errorPageUrl.searchParams.set('error_description', 'Code verifier não encontrado. Por favor, reinicie o processo de autorização.');
      return NextResponse.redirect(errorPageUrl.toString());
    }

    const auth = new Authentication({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      graph_version: 'v2',
    });

    // O redirect URI deve corresponder exatamente ao usado na autorização
    // IMPORTANTE: Se TIKTOK_REDIRECT_URI estiver configurada, ela DEVE corresponder
    // exatamente ao usado na rota de autorização
    const redirectUri = process.env.TIKTOK_REDIRECT_URI 
      ? process.env.TIKTOK_REDIRECT_URI.replace('{origin}', request.nextUrl.origin)
      : `${request.nextUrl.origin}/tiktok/api/auth/callback`;
    
    const tokenResponse = await auth.getAccessTokenFromCode(code, redirectUri, codeVerifier);

    // Debug: log completo da resposta para diagnóstico
    console.log('=== TOKEN RESPONSE DEBUG ===');
    console.log('Full token response:', JSON.stringify(tokenResponse, null, 2));
    console.log('Response structure:', {
      hasData: !!tokenResponse.data,
      hasError: !!tokenResponse.error,
      dataKeys: tokenResponse.data ? Object.keys(tokenResponse.data) : [],
      errorKeys: tokenResponse.error ? Object.keys(tokenResponse.error) : [],
    });
    
    // Log específico dos escopos
    if (tokenResponse.data) {
      console.log('Token data details:', {
        access_token: tokenResponse.data.access_token ? `${tokenResponse.data.access_token.substring(0, 20)}...` : 'NOT FOUND',
        scope: tokenResponse.data.scope || 'NOT FOUND',
        expires_in: tokenResponse.data.expires_in || 'NOT FOUND',
        refresh_token: tokenResponse.data.refresh_token ? `${tokenResponse.data.refresh_token.substring(0, 20)}...` : 'NOT FOUND',
        token_type: tokenResponse.data.token_type || 'NOT FOUND',
        allDataKeys: Object.keys(tokenResponse.data),
      });
    }

    if (tokenResponse.error) {
      const errorPageUrl = new URL('/tiktok/auth/error', request.nextUrl.origin);
      errorPageUrl.searchParams.set('error', 'token_error');
      errorPageUrl.searchParams.set('error_description', 
        tokenResponse.error?.message || 
        'Falha ao obter token de acesso'
      );
      if (tokenResponse.error?.code) {
        errorPageUrl.searchParams.set('error_code', tokenResponse.error.code);
      }
      if (tokenResponse.error?.log_id) {
        errorPageUrl.searchParams.set('log_id', tokenResponse.error.log_id);
      }
      const errorResponse = NextResponse.redirect(errorPageUrl.toString());
      errorResponse.cookies.delete('tiktok_code_verifier');
      return errorResponse;
    }

    // Sucesso - redirecionar para página de sucesso
    // O token pode estar em diferentes lugares na resposta do TikTok
    // Formato 1: { data: { access_token: "..." } }
    // Formato 2: { access_token: "..." } (sem wrapper data)
    const accessToken = tokenResponse.data?.access_token || 
                       (tokenResponse as any).access_token ||
                       null;
    
    // Extrair escopos da resposta
    const scopes = tokenResponse.data?.scope || 
                   (tokenResponse as any).scope || 
                   null;
    
    // Extrair refresh_token da resposta
    const refreshToken = tokenResponse.data?.refresh_token || 
                        (tokenResponse as any).refresh_token || 
                        null;
    
    // Log dos escopos para diagnóstico
    console.log('=== SCOPES ANALYSIS ===');
    console.log('Scopes returned by TikTok:', scopes);
    console.log('Scopes type:', typeof scopes);
    console.log('Scopes is array:', Array.isArray(scopes));
    
    const successPageUrl = new URL('/tiktok/auth/success', request.nextUrl.origin);
    
    // Não passar token na URL por segurança - ele já está no cookie
    // Mas podemos passar um indicador de sucesso
    if (accessToken) {
      // Token encontrado - não passar na URL por segurança, apenas no cookie
      successPageUrl.searchParams.set('authenticated', 'true');
    }
    
    // Passar escopos na URL para exibição (não sensível)
    if (scopes) {
      const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
      successPageUrl.searchParams.set('scope', scopesString);
      console.log('Scopes saved to URL:', scopesString);
    } else {
      console.warn('⚠️ ATENÇÃO: Nenhum escopo retornado na resposta do token!');
      successPageUrl.searchParams.set('scope', 'none');
    }

    const response = NextResponse.redirect(successPageUrl.toString());
    response.cookies.delete('tiktok_code_verifier');
    
    // Salvar o token em um cookie seguro
    if (accessToken) {
      response.cookies.set('tiktok_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenResponse.data?.expires_in || 3600,
        path: '/',
      });
      console.log('Token salvo no cookie com sucesso');
    } else {
      console.warn('Token não encontrado na resposta:', tokenResponse);
    }
    
    // Salvar refresh_token em cookie seguro (se fornecido)
    if (refreshToken) {
      const expiresIn = tokenResponse.data?.expires_in || 3600;
      // Refresh tokens geralmente duram mais tempo (30 dias)
      response.cookies.set('tiktok_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresIn * 24 * 30, // 30 dias
        path: '/',
      });
      console.log('Refresh token salvo no cookie com sucesso');
    } else {
      console.warn('⚠️ Nenhum refresh_token retornado na resposta do token');
    }
    
    // Salvar escopos em cookie separado para referência futura
    if (scopes) {
      const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
      response.cookies.set('tiktok_scopes', scopesString, {
        httpOnly: false, // Permitir acesso via JavaScript para diagnóstico
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenResponse.data?.expires_in || 3600,
        path: '/',
      });
      console.log('Escopos salvos no cookie:', scopesString);
    } else {
      console.warn('⚠️ Nenhum escopo para salvar no cookie');
    }

    return response;
  } catch (error: any) {
    console.error('Error in auth callback:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
```

### 1.3 Implementação PKCE

O PKCE é implementado em `src/lib/tiktok/request/constants.ts`:

```154:196:src/lib/tiktok/request/constants.ts
export const PKCE = {
  /**
   * Generate a random code verifier for PKCE
   * Returns a cryptographically random string of 43-128 characters
   * using URL-safe characters (A-Z, a-z, 0-9, -, ., _, ~)
   */
  generateCodeVerifier(): string {
    // Generate 96 random bytes (produces ~128 base64 characters, within 43-128 range)
    const randomBytesBuffer = randomBytes(96);
    
    // Convert to base64url
    const base64 = randomBytesBuffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Ensure it's within the required length (43-128 characters)
    return base64.substring(0, 128);
  },

  /**
   * Generate code challenge from code verifier using SHA256
   * TikTok requires hexadecimal encoding (not base64url)
   * 
   * @param codeVerifier - The code verifier string
   * @returns Promise<string> - The code challenge as hexadecimal string
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Use Node.js crypto for hashing (always available in Next.js server-side)
    const hash = createHash('sha256').update(codeVerifier).digest('hex');
    return hash;
  },

  /**
   * Generate both code verifier and code challenge
   * @returns Promise<{codeVerifier: string, codeChallenge: string}>
   */
  async generatePair(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = PKCE.generateCodeVerifier();
    const codeChallenge = await PKCE.generateCodeChallenge(codeVerifier);
    return { codeVerifier, codeChallenge };
  },
};
```

### 1.4 Classe Authentication

A classe `Authentication` estende `TikTok` e fornece métodos para:

- `getAuthenticationUrl()` - Gera URL de autorização
- `getAccessTokenFromCode()` - Troca código por token
- `getRefreshAccessToken()` - Renova token expirado
- `revokeAccessToken()` - Revoga acesso

```79:95:src/lib/tiktok/authentication/Authentication.ts
  async getAccessTokenFromCode(
    authorizationCode: string,
    redirectUri: string,
    codeVerifier: string
  ): Promise<ApiResponse> {
    return this.post({
      endpoint: '/oauth/token/',
      params: {
        [Params.CLIENT_KEY]: this.getClientKey(),
        [Params.CLIENT_SECRET]: this.getClientSecret(),
        [Params.CODE]: authorizationCode,
        [Params.GRANT_TYPE]: Authentication.GRANT_TYPE_AUTHORIZATION_CODE,
        [Params.REDIRECT_URI]: redirectUri,
        [Params.CODE_VERIFIER]: codeVerifier,
      },
    });
  }
```

---

## 2. Adicionar Escopos

### 2.1 O que são Escopos?

Escopos são permissões que definem quais recursos da API do TikTok a aplicação pode acessar. Cada escopo permite operações específicas.

### 2.2 Escopos Disponíveis

Os principais escopos utilizados neste projeto:

- **`user.info.basic`** - Informações básicas do usuário (obrigatório)
- **`video.upload`** - Upload de vídeos
- **`video.list`** - Listar vídeos do usuário
- **`video.publish`** - Publicar vídeos diretamente

### 2.3 Como Adicionar Escopos

#### Método 1: Via Query Parameter na URL

Ao acessar a rota de autorização, você pode passar escopos como parâmetro:

```
/tiktok/api/auth/authorize?scope=user.info.basic,video.upload,video.publish
```

**Código de Referência:**
```8:20:src/app/tiktok/api/auth/authorize/route.ts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Por padrão, usar apenas user.info.basic que é o escopo mais básico
    // Você pode adicionar mais escopos separados por vírgula: user.info.basic,video.list
    let scope = searchParams.get('scope') || 'user.info.basic';
    
    // Limpar e normalizar escopos: remover espaços extras e garantir formato correto
    scope = scope
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(',');
    
    const state = searchParams.get('state') || '';
```

#### Método 2: Normalização de Escopos

O código normaliza automaticamente os escopos:
- Remove espaços extras
- Filtra valores vazios
- Junta com vírgulas

### 2.4 Validação de Escopos

Após a autenticação, os escopos retornados pelo TikTok são:

1. **Extraídos da resposta do token**:
```typescript
const scopes = tokenResponse.data?.scope || 
               (tokenResponse as any).scope || 
               null;
```

2. **Armazenados em cookie** para referência futura:
```typescript
response.cookies.set('tiktok_scopes', scopesString, {
  httpOnly: false, // Permitir acesso via JavaScript para diagnóstico
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: tokenResponse.data?.expires_in || 3600,
  path: '/',
});
```

3. **Passados na URL de sucesso** (apenas para exibição, não sensível):
```typescript
if (scopes) {
  const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
  successPageUrl.searchParams.set('scope', scopesString);
}
```

### 2.5 Exemplo de Uso

Para solicitar múltiplos escopos:

```typescript
// URL de autorização com múltiplos escopos
const authUrl = `/tiktok/api/auth/authorize?scope=user.info.basic,video.upload,video.publish`;

// Ou via código
const scope = 'user.info.basic,video.upload,video.publish';
const authUrl = auth.getAuthenticationUrl(redirectUri, scope, state, codeChallenge);
```

---

## 3. Fazer Upload para o TikTok quando Logado

### 3.1 Fluxo de Upload

O upload de vídeos segue um processo em 3 etapas:

1. **Inicialização** - Solicita permissão para upload e recebe URL de upload
2. **Upload do Arquivo** - Envia o vídeo para a URL fornecida
3. **Verificação de Status** - Consulta o status da publicação

### 3.2 Endpoint de Publicação

**Rota:** `POST /tiktok/api/videos/publish`

**Arquivo:** `src/app/tiktok/api/videos/publish/route.ts`

### 3.3 Resolução do Access Token

O endpoint verifica o token de acesso em 3 locais (em ordem de prioridade):

1. **Header Authorization** (Bearer token)
2. **Query parameter** (`?access_token=...`)
3. **Cookie** (`tiktok_access_token`)

**Código de Referência:**
```37:55:src/app/tiktok/api/videos/publish/route.ts
function resolveAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const searchParams = request.nextUrl.searchParams;
  const tokenFromQuery = searchParams.get('access_token');
  if (tokenFromQuery) {
    return tokenFromQuery;
  }

  const tokenFromCookie = request.cookies.get('tiktok_access_token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}
```

### 3.4 Processo de Upload Detalhado

#### Passo 1: Validação e Preparação

1. **Verifica autenticação**:
```typescript
const accessToken = resolveAccessToken(request);
if (!accessToken) {
  return NextResponse.json(
    { error: 'Access token required', ... },
    { status: 401 }
  );
}
```

2. **Processa entrada** (multipart/form-data ou JSON):
   - Aceita arquivo de vídeo (`video`) ou URL (`video_url`)
   - Extrai metadados (título, descrição, privacidade, etc.)
   - Baixa vídeo de URL se necessário
   - Calcula hash MD5 do vídeo

3. **Valida capacidades do criador**:
```typescript
const creatorInfoResponse = await post.queryCreatorInfo({});
const canPost = creatorData.can_post ?? creatorData.can_publish ?? true;
```

4. **Valida configurações**:
   - Nível de privacidade permitido
   - Duração máxima do vídeo
   - Permissões de interação (duet, stitch, comentários)

**Código de Referência:**
```207:269:src/app/tiktok/api/videos/publish/route.ts
    const creatorInfoResponse = await post.queryCreatorInfo({});
    if (creatorInfoResponse.error && creatorInfoResponse.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'creator_info_error',
          message: creatorInfoResponse.error.message || 'Não foi possível validar limites de publicação.',
          details: creatorInfoResponse,
        },
        { status: 400 }
      );
    }

    const creatorData = creatorInfoResponse.data?.creator_info || creatorInfoResponse.data || {};
    const canPost = creatorData.can_post ?? creatorData.can_publish ?? creatorData?.post_capabilities?.can_post ?? true;
    if (!canPost) {
      return NextResponse.json(
        {
          error: 'creator_cap_reached',
          message: 'O criador atingiu o limite de publicações. Tente novamente mais tarde.',
          creator_info: creatorData,
        },
        { status: 403 }
      );
    }

    if (!visibility) {
      return NextResponse.json(
        {
          error: 'privacy_required',
          message: 'Selecione um nível de privacidade antes de enviar o vídeo.',
        },
        { status: 400 }
      );
    }

    const privacyOptionsSource =
      creatorData.privacy_level_options ||
      creatorData.privacy_options ||
      creatorData.post_capabilities?.privacy_level_options ||
      [];

    const normalizedPrivacyOptions = Array.isArray(privacyOptionsSource)
      ? privacyOptionsSource
          .map((option: any) => {
            if (!option) return null;
            if (typeof option === 'string') return option;
            if (typeof option?.value === 'string') return option.value;
            if (typeof option?.code === 'string') return option.code;
            return null;
          })
          .filter((value: string | null): value is string => Boolean(value))
      : [];

    if (normalizedPrivacyOptions.length > 0 && !normalizedPrivacyOptions.includes(visibility)) {
      return NextResponse.json(
        {
          error: 'privacy_not_allowed',
          message: `O nível de privacidade selecionado (${visibility}) não está disponível para este criador.`,
          allowed_privacy_levels: normalizedPrivacyOptions,
        },
        { status: 400 }
      );
    }
```

#### Passo 2: Inicialização da Publicação

1. **Prepara payload** com informações do vídeo:
```typescript
const sourceInfo = {
  source: 'FILE_UPLOAD',
  video_size: fileSize,
  chunk_size: fileSize,
  total_chunk_count: 1,
};

const videoPostInfo = {
  title: title,
  description: description,
  privacy_level: visibility,
  disable_duet: !allowDuet,
  disable_comment: !allowComment,
  disable_stitch: !allowStitch,
  // ... outros campos
};
```

2. **Chama API de inicialização** (draft ou direct):
```typescript
if (mode === 'direct') {
  initResponse = await post.publish({
    source_info: sourceInfo,
    video_post_info: videoPostInfo,
  });
} else {
  initResponse = await post.draft({
    source_info: sourceInfo,
    post_info: videoPostInfo,
  });
}
```

3. **Extrai `publish_id` e `upload_url`** da resposta

**Código de Referência:**
```328:401:src/app/tiktok/api/videos/publish/route.ts
    const videoPostInfo: Record<string, any> = {};
    if (title?.trim()) videoPostInfo.title = title.trim();
    if (description?.trim()) videoPostInfo.description = description.trim();
    videoPostInfo.privacy_level = visibility;
    if (typeof allowDuet === 'boolean') videoPostInfo.disable_duet = !allowDuet;
    if (typeof allowComment === 'boolean') videoPostInfo.disable_comment = !allowComment;
    if (typeof allowStitch === 'boolean') videoPostInfo.disable_stitch = !allowStitch;
    if (typeof scheduleTime === 'number') videoPostInfo.schedule_time = scheduleTime;
    // video_cover_timestamp_ms deve estar em milissegundos (exemplo Python usa 1000)
    if (typeof coverTime === 'number') {
      videoPostInfo.video_cover_timestamp_ms = coverTime * 1000; // Converter segundos para milissegundos
    }
    if (typeof videoDuration === 'number') videoPostInfo.video_duration = videoDuration;

    if (commercialToggle) {
      videoPostInfo.commercial_content_toggle = true;
      videoPostInfo.commercial_content_self = commercialYourBrand;
      videoPostInfo.commercial_content_branded = commercialBrandedContent;
    }

    // source_info seguindo exatamente o exemplo Python
    // Removido upload_pattern e video_hash que não estão no exemplo básico
    const sourceInfo: Record<string, any> = {
      source: 'FILE_UPLOAD',
      video_size: fileSize,
      chunk_size: fileSize,
      total_chunk_count: 1,
    };

    // video_hash pode ser adicionado depois se necessário, mas não está no exemplo Python básico
    // if (videoHash) {
    //   sourceInfo.video_hash = videoHash;
    // }

    let initResponse;
    if (mode === 'direct') {
      initResponse = await post.publish({
        source_info: sourceInfo,
        video_post_info: videoPostInfo,
      });
    } else {
      const draftPayload: Record<string, any> = {
        source_info: sourceInfo,
      };
      if (Object.keys(videoPostInfo).length > 0) {
        draftPayload.post_info = videoPostInfo;
      }
      initResponse = await post.draft(draftPayload);
    }

    if (initResponse.error && initResponse.error.code !== 'ok') {
      return NextResponse.json(
        {
          error: 'init_failed',
          message: initResponse.error.message || 'Falha ao iniciar publicação.',
          details: initResponse,
        },
        { status: 400 }
      );
    }

    const publishId = initResponse.data?.publish_id || initResponse.data?.publishIds?.[0];
    const uploadUrl = initResponse.data?.upload_url;

    if (!publishId || !uploadUrl) {
      return NextResponse.json(
        {
          error: 'missing_upload_info',
          message: 'A resposta não retornou publish_id ou upload_url.',
          details: initResponse,
        },
        { status: 400 }
      );
    }
```

#### Passo 3: Upload do Arquivo

1. **Envia arquivo** para a URL fornecida usando PUT:
```typescript
const uploadResponse = await post.uploadFile(uploadUrl, {
  path: tempFilePath,
  mime_type: contentType,
});
```

2. **Verifica sucesso** (status 200 ou 201)

**Código de Referência:**
```403:423:src/app/tiktok/api/videos/publish/route.ts
    const uploadResponse = await post.uploadFile(uploadUrl, {
      path: tempFilePath,
      mime_type: contentType,
    });

    // Uploads bem-sucedidos geralmente retornam 200/201 com corpo vazio
    // Verificar status HTTP para determinar sucesso
    const uploadStatus = uploadResponse.debug?.status;
    const isUploadSuccess = uploadStatus === 200 || uploadStatus === 201;
    
    // Se não foi sucesso E há erro, retornar erro
    if (!isUploadSuccess && uploadResponse.error) {
      return NextResponse.json(
        {
          error: 'upload_failed',
          message: uploadResponse.error.message || 'Falha ao enviar o vídeo.',
          details: uploadResponse,
        },
        { status: 400 }
      );
    }
```

**Implementação do upload:**
```81:104:src/lib/tiktok/post/Post.ts
  async uploadFile(
    uploadUrl: string,
    file: { path: string; mime_type: string }
  ): Promise<ApiResponse> {
    // Get file size
    const fs = await import('fs');
    const fileSize = fs.statSync(file.path).size;

    const headers: Record<string, string> = {
      'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`,
      'Content-Length': String(fileSize),
      'Content-Type': file.mime_type,
    };

    // Make request to the api
    const response = await this.sendCustomRequest(
      uploadUrl,
      HttpMethod.PUT,
      headers,
      file
    );

    return response;
  }
```

#### Passo 4: Verificação de Status (Opcional)

Após o upload, é possível consultar o status da publicação:

```typescript
statusResponse = await post.fetchStatus({
  publish_id: publishId,
});
```

**Código de Referência:**
```425:432:src/app/tiktok/api/videos/publish/route.ts
    let statusResponse: Record<string, any> | null = null;
    try {
      statusResponse = await post.fetchStatus({
        publish_id: publishId,
      });
    } catch (statusError) {
      console.warn('Não foi possível obter status da publicação:', statusError);
    }
```

### 3.5 Modos de Publicação

#### Draft Mode (Rascunho)
- Vídeo é enviado para a caixa de entrada do criador
- Criador deve finalizar publicação manualmente no TikTok
- Endpoint: `/post/publish/inbox/video/init/`

#### Direct Mode (Publicação Direta)
- Vídeo é publicado diretamente
- Requer todos os metadados completos
- Endpoint: `/post/publish/video/init/`

### 3.6 Parâmetros Aceitos

O endpoint aceita os seguintes parâmetros:

**Via FormData (multipart/form-data):**
- `video` - Arquivo de vídeo
- `video_url` - URL do vídeo (alternativa ao arquivo)
- `title` - Título do vídeo
- `description` - Descrição do vídeo
- `privacy_level` - Nível de privacidade (`PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `SELF_ONLY`)
- `allow_comment` - Permitir comentários (boolean)
- `allow_duet` - Permitir duet (boolean)
- `allow_stitch` - Permitir stitch (boolean)
- `schedule_time` - Timestamp Unix para agendamento
- `cover_time` - Segundo do vídeo para thumbnail
- `mode` - `draft` ou `direct`
- `video_duration` - Duração em segundos
- `commercial_toggle` - Conteúdo comercial (boolean)
- `commercial_your_brand` - Seu próprio brand (boolean)
- `commercial_branded_content` - Conteúdo patrocinado (boolean)

**Via JSON:**
- Mesmos campos, mas como propriedades do objeto JSON

### 3.7 Exemplo de Uso

#### Via FormData (Frontend):
```typescript
const formData = new FormData();
formData.append('video', videoFile);
formData.append('title', 'Meu Vídeo');
formData.append('description', 'Descrição do vídeo');
formData.append('privacy_level', 'PUBLIC_TO_EVERYONE');
formData.append('allow_comment', 'true');
formData.append('allow_duet', 'true');
formData.append('allow_stitch', 'true');
formData.append('mode', 'draft');

const response = await fetch('/tiktok/api/videos/publish', {
  method: 'POST',
  body: formData,
});
```

#### Via JSON (API):
```typescript
const response = await fetch('/tiktok/api/videos/publish', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    video_url: 'https://example.com/video.mp4',
    title: 'Meu Vídeo',
    description: 'Descrição do vídeo',
    privacy_level: 'PUBLIC_TO_EVERYONE',
    allow_comment: true,
    allow_duet: true,
    allow_stitch: true,
    mode: 'draft',
  }),
});
```

### 3.8 Resposta da API

**Sucesso:**
```json
{
  "success": true,
  "mode": "draft",
  "publish_id": "1234567890",
  "init_response": { ... },
  "upload_response": { ... },
  "status_response": { ... },
  "creator_info": { ... },
  "message": "Vídeo enviado como rascunho. O criador deve finalizar a publicação no TikTok."
}
```

**Erro:**
```json
{
  "error": "error_code",
  "message": "Mensagem de erro descritiva",
  "details": { ... }
}
```

---

## 4. Configuração e Variáveis de Ambiente

### 4.1 Variáveis Necessárias

```env
# Credenciais do TikTok
TIKTOK_CLIENT_KEY=seu_client_key
TIKTOK_CLIENT_SECRET=seu_client_secret

# Redirect URI (opcional)
# Se configurada, deve corresponder exatamente ao cadastrado no TikTok for Developers
TIKTOK_REDIRECT_URI=https://michaellourenco.com/tiktok
# Ou usar {origin} para substituir dinamicamente:
TIKTOK_REDIRECT_URI={origin}/tiktok/api/auth/callback
```

### 4.2 Redirect URI

O redirect URI deve ser configurado no TikTok for Developers e corresponder exatamente ao usado no código. O sistema suporta:

- **URI padrão:** `/tiktok/api/auth/callback`
- **URI customizada:** Via variável `TIKTOK_REDIRECT_URI`

---

## 5. Segurança

### 5.1 Armazenamento de Tokens

- Tokens são armazenados em **cookies HTTP-only** para prevenir acesso via JavaScript
- Cookies são marcados como **secure** em produção (HTTPS apenas)
- **SameSite: lax** para proteção CSRF

### 5.2 PKCE

- Implementação completa de PKCE conforme RFC 7636
- Code verifier armazenado temporariamente (10 minutos)
- Code challenge gerado via SHA-256 em hexadecimal

### 5.3 Validação de Entrada

- Validação de capacidades do criador antes do upload
- Verificação de limites de duração e tamanho
- Validação de níveis de privacidade permitidos

---

## 6. Tratamento de Erros

### 6.1 Erros de Autenticação

- Redirecionamento para página de erro com detalhes
- Logs detalhados para diagnóstico
- Mensagens de erro descritivas

### 6.2 Erros de Upload

- Validação prévia de capacidades
- Mensagens de erro específicas por tipo de falha
- Limpeza automática de arquivos temporários

---

## 7. Arquivos e Funções Principais

### 7.1 Autenticação

| Arquivo | Função |
|---------|--------|
| `src/app/tiktok/api/auth/authorize/route.ts` | Inicia fluxo OAuth |
| `src/app/tiktok/api/auth/callback/route.ts` | Processa callback |
| `src/lib/tiktok/authentication/Authentication.ts` | Classe de autenticação |
| `src/lib/tiktok/request/constants.ts` | Utilitários PKCE |

### 7.2 Upload

| Arquivo | Função |
|---------|--------|
| `src/app/tiktok/api/videos/publish/route.ts` | Endpoint de publicação |
| `src/lib/tiktok/post/Post.ts` | Classe de publicação |
| `src/lib/tiktok/TikTok.ts` | Classe base do SDK |

---

## 8. Próximos Passos e Melhorias

### 8.1 Melhorias Sugeridas

1. **Refresh Token Automático** - Implementar renovação automática de tokens expirados
2. **Retry Logic** - Adicionar retry para falhas de rede
3. **Chunked Upload** - Suporte para upload em chunks para vídeos grandes
4. **Webhooks** - Implementar webhooks para notificações de status
5. **Cache de Creator Info** - Cachear informações do criador para reduzir chamadas

### 8.2 Escalabilidade

- O código está bem estruturado e modular
- Separação clara de responsabilidades
- Fácil adicionar novos endpoints ou funcionalidades
- Tratamento robusto de erros

### 8.3 Manutenibilidade

- Código TypeScript com tipagem forte
- Comentários e documentação inline
- Logs detalhados para diagnóstico
- Estrutura modular facilita testes

---

## Conclusão

Esta implementação fornece uma base sólida para integração com a API do TikTok, com autenticação segura via OAuth 2.0 + PKCE, gerenciamento flexível de escopos e upload completo de vídeos com validações robustas. O código está preparado para escalar e manter, seguindo boas práticas de desenvolvimento.



