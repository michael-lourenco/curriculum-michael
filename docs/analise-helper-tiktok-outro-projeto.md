# Análise: Helper TikTok - Outro Projeto

## Data: 2025-01-27

## Objetivo

Analisar o helper `getTikTokTokensByCode` e o controller do outro projeto, comparando com a implementação funcional do `curriculum-michael` para identificar o que está faltando.

---

## Problema crítico identificado

### ❌ FALTA: `code_verifier` no helper

O TikTok **requer PKCE (Proof Key for Code Exchange)** e o `code_verifier` é **obrigatório** na requisição de troca do código por token.

### Comparação

#### ✅ Implementação Correta (curriculum-michael)

```typescript
// src/lib/tiktok/authentication/Authentication.ts
async getAccessTokenFromCode(
  authorizationCode: string,
  redirectUri: string,
  codeVerifier: string  // ← OBRIGATÓRIO
): Promise<ApiResponse> {
  return this.post({
    endpoint: '/oauth/token/',
    params: {
      [Params.CLIENT_KEY]: this.getClientKey(),
      [Params.CLIENT_SECRET]: this.getClientSecret(),
      [Params.CODE]: authorizationCode,
      [Params.GRANT_TYPE]: Authentication.GRANT_TYPE_AUTHORIZATION_CODE,
      [Params.REDIRECT_URI]: redirectUri,
      [Params.CODE_VERIFIER]: codeVerifier,  // ← ENVIADO AQUI
    },
  });
}
```

#### ❌ Implementação Atual (outro projeto)

```javascript
// Helper atual - FALTANDO code_verifier
async function getTikTokTokensByCode(code, redirectUri = null) {
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    client_secret: TIKTOK_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUriToUse,
    // ❌ FALTA: code_verifier
  });
}
```

---

## Solução

### 1. Atualizar a assinatura da função

A função precisa receber o `code_verifier` como parâmetro:

```javascript
/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from TikTok OAuth
 * @param {string} codeVerifier - Code verifier for PKCE (REQUIRED by TikTok)
 * @param {string} redirectUri - Redirect URI used in OAuth flow (optional, uses env var if not provided)
 * @returns {Promise<Object>} Token response containing access_token, refresh_token, etc.
 */
async function getTikTokTokensByCode(code, codeVerifier, redirectUri = null) {
  // Validação do codeVerifier
  if (!codeVerifier) {
    return Promise.reject(new Error("code_verifier is required for TikTok OAuth (PKCE)"));
  }

  // ... resto do código
}
```

### 2. Adicionar `code_verifier` nos params

```javascript
const params = new URLSearchParams({
  client_key: TIKTOK_CLIENT_KEY,
  client_secret: TIKTOK_CLIENT_SECRET,
  code: code,
  grant_type: "authorization_code",
  redirect_uri: redirectUriToUse,
  code_verifier: codeVerifier,  // ← ADICIONAR AQUI
});
```

### 3. Atualizar o controller

O controller precisa receber o `code_verifier` do frontend e passá-lo para o helper:

```javascript
getTikTokInfo: async function (req, res) {
  try {
    const { code, codeVerifier, redirectUri, language } = req.body;  // ← ADICIONAR codeVerifier

    if (!code) {
      return res.send({
        status: false,
        message: getString(language, "invalid_param"),
      });
    }

    if (!codeVerifier) {
      return res.send({
        status: false,
        message: "code_verifier is required for TikTok authentication",
      });
    }

    // Passar codeVerifier para o helper
    let channelTokens = await getTikTokTokensByCode(code, codeVerifier, redirectUri);
    
    // ... resto do código
  }
}
```

---

## Fluxo completo necessário

### Frontend → Backend

1. **Frontend gera PKCE:**
   - Gera `code_verifier` (string aleatória 43-128 caracteres)
   - Gera `code_challenge` (SHA-256 do code_verifier em hexadecimal)
   - Armazena `code_verifier` (em sessionStorage/localStorage)

2. **Frontend redireciona para TikTok:**
   - URL inclui `code_challenge` e `code_challenge_method=S256`
   - Usuário autoriza no TikTok

3. **TikTok redireciona de volta:**
   - Frontend recebe `code` na query string
   - Frontend envia `code` + `code_verifier` para o backend

4. **Backend troca código por token:**
   - Helper recebe `code` + `code_verifier`
   - Envia ambos para TikTok
   - Retorna `access_token` e `refresh_token`

---

## Código corrigido completo

### Helper Corrigido

```javascript
/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from TikTok OAuth
 * @param {string} codeVerifier - Code verifier for PKCE (REQUIRED by TikTok)
 * @param {string} redirectUri - Redirect URI used in OAuth flow (optional, uses env var if not provided)
 * @returns {Promise<Object>} Token response containing access_token, refresh_token, etc.
 */
async function getTikTokTokensByCode(code, codeVerifier, redirectUri = null) {
  return new Promise(async (resolve, reject) => {
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      reject(new Error("TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET must be configured"));
      return;
    }

    if (!code) {
      reject(new Error("code is required"));
      return;
    }

    if (!codeVerifier) {
      reject(new Error("code_verifier is required for TikTok OAuth (PKCE)"));
      return;
    }

    const redirectUriToUse = redirectUri || TIKTOK_REDIRECT_URI;
    if (!redirectUriToUse) {
      reject(new Error("TIKTOK_REDIRECT_URI must be configured or redirectUri must be provided"));
      return;
    }

    try {
      const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
      
      // TikTok API requires form-urlencoded data
      const params = new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUriToUse,
        code_verifier: codeVerifier,  // ← ADICIONADO
      });

      const config = {
        method: "POST",
        url: tokenUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: params.toString(),
      };

      logger.info(`getTikTokTokensByCode Req : ${JSON.stringify({ ...config, data: params.toString() })}`);
      
      const response = await axios(config);
      logger.info(`getTikTokTokensByCode Response : ${JSON.stringify(response.data)}`);
      
      // TikTok API response format
      if (response.data && response.data.data) {
        const tokenData = response.data.data;
        const standardFormat = {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_in: tokenData.expires_in,
          token_type: tokenData.token_type || "bearer",
          scope: tokenData.scope || [],
          refresh_expires_in: tokenData.refresh_expires_in,
          open_id: tokenData.open_id,
        };
        logger.info(`getTikTokTokensByCode Converted to standard format: ${JSON.stringify(standardFormat)}`);
        resolve(standardFormat);
      } else if (response.data && response.data.error) {
        reject(new Error(`TikTok API error: ${JSON.stringify(response.data.error)}`));
      } else {
        reject(new Error(`TikTok API response didn't contain proper token data: ${JSON.stringify(response.data)}`));
      }
      
    } catch (error) {
      logger.error(`getTikTokTokensByCode Error: ${error.message}`);
      if (error.response && error.response.data) {
        logger.error(`TikTok API error response: ${JSON.stringify(error.response.data)}`);
        reject(new Error(`TikTok API error: ${JSON.stringify(error.response.data)}`));
      } else {
        reject(new Error(`Failed to exchange code for tokens: ${error.message}`));
      }
    }
  });
}
```

### Controller Corrigido

```javascript
/**
 * @Method used to get TikTok user info by authorization code
 */
getTikTokInfo: async function (req, res) {
  try {
    const { code, codeVerifier, redirectUri, language } = req.body;  // ← ADICIONAR codeVerifier

    if (!code) {
      return res.send({
        status: false,
        message: getString(language, "invalid_param"),
      });
    }

    if (!codeVerifier) {
      return res.send({
        status: false,
        message: "code_verifier is required for TikTok authentication (PKCE)",
      });
    }

    // Passar codeVerifier como segundo parâmetro
    let channelTokens = await getTikTokTokensByCode(code, codeVerifier, redirectUri);
    logger.info("TikTok channelTokens");
    logger.info(JSON.stringify(channelTokens));

    if (channelTokens && channelTokens.access_token) {
      let userInfo = await getTikTokUserInfo(channelTokens.access_token);
      if (userInfo && userInfo.error) {
        let errorMessage = userInfo.message || userInfo.error;
        
        const getErrorCode = await getMappErrorData(errorMessage);
        return res.send({
          ...getErrorCode
        });
      } else {
        if (userInfo && (!userInfo.data || userInfo.data.length === 0)) {
          return res.send({
            status: false,
            message: "Você não tem acesso a informações do usuário no TikTok.",
          });
        } else {
          const expirationTime = new Date(Date.now() + (channelTokens.expires_in * 1000));
          
          const userData = userInfo.data && userInfo.data.length > 0 
            ? userInfo.data[0] 
            : userInfo;
          
          let tiktokRes = {
            tiktokIdentifier: userData.open_id || userInfo.open_id,
            tiktokUnionId: userData.union_id || userInfo.union_id,
            tiktokDisplayName: userData.display_name || userInfo.display_name,
            tiktokUsername: userData.username || userInfo.username,
            tiktokAccessToken: channelTokens.access_token,
            tiktokRefreshToken: channelTokens.refresh_token,
            tokenExpireTime: expirationTime.toISOString(),
            imageUrl: userData.avatar_url || userInfo.avatar_url,
          };
          return res.send({
            status: true,
            message: "success",
            data: tiktokRes,
          });
        }
      }
    } else {
      const getErrorCode = await getMappErrorData(channelTokens);
      return res.send({
        ...getErrorCode
      });
    }
  } catch (err) {
    logger.error(`getTikTokInfo error: ${err.message}`);
    return res.send({
      status: false,
      message: err.message,
    });
  }
},
```

---

## Utilitário PKCE para Frontend

O frontend precisa gerar o PKCE. Aqui está um exemplo de função JavaScript:

```javascript
/**
 * Gera code verifier para PKCE
 * @returns {string} Code verifier (43-128 caracteres)
 */
function generateCodeVerifier() {
  const array = new Uint8Array(96);
  crypto.getRandomValues(array);
  const base64 = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return base64.substring(0, 128);
}

/**
 * Gera code challenge a partir do code verifier
 * @param {string} codeVerifier - Code verifier
 * @returns {Promise<string>} Code challenge (SHA-256 em hexadecimal)
 */
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gera par PKCE (code verifier + code challenge)
 * @returns {Promise<{codeVerifier: string, codeChallenge: string}>}
 */
async function generatePKCEPair() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}

// Exemplo de uso no frontend:
async function iniciarAutenticacaoTikTok() {
  // 1. Gerar PKCE
  const { codeVerifier, codeChallenge } = await generatePKCEPair();
  
  // 2. Armazenar code_verifier (sessionStorage ou localStorage)
  sessionStorage.setItem('tiktok_code_verifier', codeVerifier);
  
  // 3. Construir URL de autorização
  const clientKey = 'SEU_CLIENT_KEY';
  const redirectUri = encodeURIComponent('SEU_REDIRECT_URI');
  const scope = 'user.info.basic,video.upload';
  const state = 'seu_state_opcional';
  
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?` +
    `client_key=${clientKey}&` +
    `response_type=code&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}&` +
    `state=${state}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256`;
  
  // 4. Redirecionar para TikTok
  window.location.href = authUrl;
}

// Quando TikTok redirecionar de volta:
async function processarCallbackTikTok() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const codeVerifier = sessionStorage.getItem('tiktok_code_verifier');
  
  if (!code || !codeVerifier) {
    console.error('Code ou code_verifier não encontrado');
    return;
  }
  
  // Enviar para backend
  const response = await fetch('/api/tiktok/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      codeVerifier: codeVerifier,  // ← IMPORTANTE
      redirectUri: 'SEU_REDIRECT_URI',
    }),
  });
  
  const data = await response.json();
  
  // Limpar code_verifier após uso
  sessionStorage.removeItem('tiktok_code_verifier');
  
  return data;
}
```

---

## Resumo das alterações necessárias

### ✅ O que está correto

1. ✅ Estrutura geral do helper
2. ✅ Tratamento de erros
3. ✅ Formato de resposta padronizado
4. ✅ Função `getTikTokUserInfo` está correta
5. ✅ Função `refreshTikTokAccessToken` está correta
6. ✅ Controller processa resposta corretamente

### ❌ O que precisa ser corrigido

1. ❌ **CRÍTICO:** Adicionar parâmetro `codeVerifier` na função `getTikTokTokensByCode`
2. ❌ **CRÍTICO:** Incluir `code_verifier` nos params enviados para TikTok
3. ❌ **CRÍTICO:** Controller precisa receber e passar `codeVerifier`
4. ⚠️ **IMPORTANTE:** Frontend precisa gerar e enviar PKCE

---

## Conclusão

O helper **NÃO está completo** porque está faltando o `code_verifier`, que é **obrigatório** para o TikTok. Sem ele, a requisição de troca de código por token **falhará**.

### Ações necessárias:

1. ✅ Atualizar `getTikTokTokensByCode` para receber `codeVerifier`
2. ✅ Adicionar `code_verifier` nos params
3. ✅ Atualizar controller para receber `codeVerifier` do frontend
4. ✅ Implementar geração de PKCE no frontend
5. ✅ Frontend enviar `code` + `codeVerifier` para backend

Após essas correções, o fluxo funcionará corretamente, igual ao `curriculum-michael`.

