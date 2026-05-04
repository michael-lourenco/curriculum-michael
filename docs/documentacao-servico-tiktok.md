# Documentação Técnica - Serviço de Integração TikTok API

## Visão Geral

Este documento descreve o serviço de integração com a API do TikTok implementado no projeto. O serviço fornece uma interface completa em TypeScript/Next.js para autenticação OAuth 2.0, gerenciamento de usuários, listagem de vídeos, publicação de conteúdo e processamento de webhooks.

## Arquitetura

O serviço é construído sobre Next.js 14+ (App Router) e utiliza uma arquitetura modular baseada em classes TypeScript que encapsulam a comunicação com a TikTok API v2.

### Componentes Principais

1. **SDK Core** (`/src/lib/tiktok/`)
   - Classe base `TikTok` para comunicação HTTP com a API
   - Classes especializadas: `Authentication`, `User`, `Video`, `Post`, `Webhooks`
   - Sistema de requisições HTTP com suporte a PKCE (Proof Key for Code Exchange)

2. **API Routes** (`/src/app/tiktok/api/`)
   - Endpoints RESTful para todas as operações
   - Tratamento de erros padronizado
   - Suporte a múltiplos métodos de autenticação (Header, Query, Cookie)

3. **Interface de Usuário** (`/src/app/tiktok/`)
   - Páginas React para visualização e testes
   - Páginas de erro com diagnóstico detalhado
   - Ferramentas de validação e debug

## Funcionalidades Implementadas

### 1. Autenticação OAuth 2.0 com PKCE

**Endpoint:** `GET /tiktok/api/auth/authorize`

**Funcionalidade:**
- Implementa o fluxo OAuth 2.0 Authorization Code com PKCE (obrigatório pela TikTok)
- Gera par de código verifier/challenge usando SHA256
- Suporta múltiplos escopos configuráveis
- Redireciona para a página de autorização do TikTok

**Escopos Suportados:**
- `user.info.basic` - Informações básicas do usuário (obrigatório)
- `user.info.profile` - Perfil completo do usuário
- `user.info.stats` - Estatísticas do usuário
- `video.list` - Listar vídeos do usuário
- `video.upload` - Upload de vídeos
- `video.publish` - Publicação de vídeos

**Fluxo de Autenticação:**
1. Cliente acessa `/tiktok/api/auth/authorize?scope=...`
2. Sistema gera `code_verifier` e `code_challenge` (PKCE)
3. `code_verifier` é armazenado em cookie HTTP-only
4. Usuário é redirecionado para TikTok com `code_challenge`
5. TikTok redireciona de volta para `/tiktok/api/auth/callback` com `code`
6. Sistema troca `code` por `access_token` usando `code_verifier`
7. Token é armazenado em cookie seguro e usuário é redirecionado para página de sucesso

**Endpoint de Callback:** `GET /tiktok/api/auth/callback`

**Segurança:**
- Cookies HTTP-only para `code_verifier` e `access_token`
- Cookies seguros em produção (HTTPS)
- Validação de estado (state parameter)
- Limpeza automática de cookies temporários

### 2. Gerenciamento de Usuários

**Endpoint:** `GET /tiktok/api/user/info`

**Funcionalidade:**
- Obtém informações do usuário autenticado
- Suporta campos customizáveis via query parameter
- Valida token automaticamente

**Métodos de Autenticação Aceitos:**
1. Header: `Authorization: Bearer <token>`
2. Query Parameter: `?access_token=<token>`
3. Cookie: `tiktok_access_token` (definido após autenticação)

**Campos Disponíveis:**
- `open_id` - ID único do usuário
- `display_name` - Nome de exibição
- `union_id` - ID unificado (se disponível)
- `avatar_url` - URL do avatar
- `bio_description` - Biografia (requer `user.info.profile`)
- `follower_count`, `following_count`, `likes_count`, `video_count` (requer `user.info.stats`)

**Exemplo de Resposta:**
```json
{
  "valid": true,
  "user_info": {
    "open_id": "act.xxx",
    "display_name": "Nome do Usuário",
    "avatar_url": "https://..."
  },
  "available_fields": ["open_id", "display_name", "avatar_url"]
}
```

### 3. Validação de Tokens

**Endpoint:** `GET /tiktok/api/auth/validate`

**Funcionalidade:**
- Valida se um `access_token` está ativo e válido
- Verifica formato do token (deve começar com `act.`)
- Testa token fazendo requisição real à API
- Analisa escopos disponíveis
- Identifica escopos faltantes para funcionalidades específicas

**Resposta de Validação:**
```json
{
  "valid": true,
  "message": "Token válido e ativo",
  "user_info": {...},
  "available_fields": [...],
  "inferred_scopes": "user.info.basic, user.info.profile",
  "scope_analysis": {
    "has_upload_scope": false,
    "has_publish_scope": false,
    "missing_scopes": ["video.upload", "video.publish"]
  }
}
```

### 4. Listagem de Vídeos

**Endpoint:** `POST /tiktok/api/videos/list`

**Funcionalidade:**
- Lista vídeos do usuário autenticado
- Suporta paginação via cursor
- Permite limitar quantidade de resultados
- Filtra campos retornados

**Parâmetros:**
```json
{
  "max_count": 20,
  "cursor": "cursor_string",
  "fields": ["id", "title", "create_time", "cover_image_url"]
}
```

**Requisitos:**
- Escopo: `video.list`
- Token de acesso válido

### 5. Publicação de Vídeos

**Endpoint:** `POST /tiktok/api/videos/publish`

**Funcionalidade Completa:**
- Upload e publicação de vídeos no TikTok
- Suporta dois modos: `draft` (rascunho) e `direct` (publicação direta)
- Validações pré-publicação:
  - Verifica limites de publicação do criador
  - Valida nível de privacidade permitido
  - Verifica duração máxima do vídeo
  - Valida configurações de interação (duet, stitch, comentários)

**Fluxo de Publicação:**
1. Valida token e escopos (`video.upload`, `video.publish`)
2. Consulta informações do criador (`queryCreatorInfo`)
3. Valida capacidade de publicação
4. Valida parâmetros de privacidade e interação
5. Inicia publicação (`draft()` ou `publish()`)
6. Recebe `publish_id` e `upload_url`
7. Faz upload do arquivo de vídeo
8. Retorna status inicial da publicação

**Formas de Envio:**
1. **Multipart Form-Data:**
   - Campo `video`: arquivo de vídeo
   - Campos opcionais: `title`, `description`, `privacy_level`, etc.

2. **JSON com URL:**
   - Campo `video_url`: URL pública do vídeo
   - Sistema faz download temporário do vídeo

**Parâmetros Suportados:**
- `title` - Título do vídeo
- `description` - Descrição/legenda
- `privacy_level` - Nível de privacidade (`PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `SELF_ONLY`)
- `allow_comment` - Permitir comentários (boolean)
- `allow_duet` - Permitir duet (boolean)
- `allow_stitch` - Permitir stitch (boolean)
- `schedule_time` - Timestamp Unix para agendamento
- `cover_time` - Segundo do vídeo para thumbnail
- `video_duration` - Duração em segundos
- `mode` - `draft` ou `direct`
- `commercial_toggle` - Conteúdo comercial (boolean)
- `commercial_your_brand` - Sua marca (boolean)
- `commercial_branded_content` - Conteúdo patrocinado (boolean)

**Validações Implementadas:**
- Limite de publicações diárias do criador
- Níveis de privacidade permitidos para o criador
- Duração máxima do vídeo
- Configurações de interação do criador
- Tamanho e formato do arquivo

**Resposta:**
```json
{
  "success": true,
  "mode": "direct",
  "publish_id": "publish_id_string",
  "init_response": {...},
  "upload_response": {...},
  "status_response": {...},
  "creator_info": {...},
  "message": "Vídeo enviado para publicação direta..."
}
```

### 6. Consulta de Status de Publicação

**Endpoint:** `POST /tiktok/api/videos/status`

**Funcionalidade:**
- Consulta status de uma publicação em andamento
- Retorna informações sobre processamento do vídeo
- Útil para acompanhar publicações assíncronas

**Parâmetros:**
```json
{
  "publish_id": "publish_id_string"
}
```

**Ou via Query String:**
```
POST /tiktok/api/videos/status?publish_id=xxx
```

### 7. Processamento de Webhooks

**Endpoint:** `POST /tiktok/webhook` e `GET /tiktok/webhook`

**Funcionalidade:**
- Recebe e processa webhooks do TikTok
- Suporta verificação de desafio (challenge) via GET
- Processa payloads JSON via POST

**Uso:**
- Configurar URL do webhook no TikTok for Developers
- TikTok enviará eventos de publicação, comentários, etc.
- Sistema processa e registra eventos recebidos

## Tratamento de Erros

### Página de Erro de Autenticação

**Rota:** `/tiktok/auth/error`

**Funcionalidade:**
- Página React dedicada para exibir erros de autenticação
- Diagnóstico detalhado por tipo de erro
- Instruções específicas para resolução
- Links para documentação oficial

**Tipos de Erro Tratados:**
1. `invalid_scope` - Escopos não habilitados no app
2. `no_code` - Código de autorização não fornecido
3. `no_code_verifier` - Erro na verificação PKCE
4. `token_error` - Erro ao obter token de acesso

**Recursos:**
- Mensagens de erro em português
- Soluções passo a passo
- Links para configuração no TikTok for Developers
- Detalhes técnicos (error_code, log_id)

## Configuração

### Variáveis de Ambiente

```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=https://seu-dominio.com/tiktok/api/auth/callback
```

**Nota:** O `REDIRECT_URI` deve corresponder exatamente ao configurado no TikTok for Developers.

### Configuração no TikTok for Developers

1. Criar app em https://developers.tiktok.com/apps
2. Configurar Redirect URI (deve corresponder ao `TIKTOK_REDIRECT_URI`)
3. Habilitar escopos necessários na seção "Products" ou "Scopes"
4. Obter `CLIENT_KEY` e `CLIENT_SECRET`

## Segurança

### Implementações de Segurança

1. **PKCE (Proof Key for Code Exchange)**
   - Obrigatório pela TikTok API
   - Previne ataques de interceptação de código
   - Geração segura de code_verifier/challenge

2. **Cookies Seguros**
   - HTTP-only cookies (não acessíveis via JavaScript)
   - Secure flag em produção (HTTPS apenas)
   - SameSite=Lax para proteção CSRF

3. **Validação de Tokens**
   - Validação de formato antes de uso
   - Verificação de expiração via API
   - Limpeza automática de tokens inválidos

4. **Validação de Entrada**
   - Validação de parâmetros de publicação
   - Verificação de limites do criador
   - Sanitização de dados de entrada

## Estrutura de Arquivos

```
src/
├── app/
│   └── tiktok/
│       ├── api/
│       │   ├── auth/
│       │   │   ├── authorize/route.ts      # Inicia autenticação
│       │   │   ├── callback/route.ts       # Callback OAuth
│       │   │   └── validate/route.ts       # Valida token
│       │   ├── user/
│       │   │   └── info/route.ts           # Info do usuário
│       │   ├── videos/
│       │   │   ├── list/route.ts           # Lista vídeos
│       │   │   ├── publish/route.ts        # Publica vídeo
│       │   │   └── status/route.ts        # Status publicação
│       │   └── creator/
│       │       └── info/route.ts          # Info do criador
│       ├── auth/
│       │   ├── error/page.tsx             # Página de erro
│       │   └── success/page.tsx            # Página de sucesso
│       ├── home/page.tsx                   # Página inicial
│       ├── user-info/page.tsx              # UI: Info usuário
│       ├── publish/page.tsx                 # UI: Publicar vídeo
│       ├── validate/page.tsx               # UI: Validar token
│       └── webhook/route.ts                # Webhook handler
└── lib/
    └── tiktok/
        ├── TikTok.ts                       # Classe base
        ├── authentication/
        │   └── Authentication.ts           # OAuth/PKCE
        ├── user/
        │   └── User.ts                     # Gerenciamento usuário
        ├── video/
        │   └── Video.ts                    # Listagem vídeos
        ├── post/
        │   └── Post.ts                     # Publicação vídeos
        ├── webhooks/
        │   └── Webhooks.ts                 # Processamento webhooks
        └── request/
            ├── Request.ts                  # Requisições HTTP
            ├── HttpClient.ts               # Cliente HTTP
            ├── constants.ts                # Constantes
            └── types.ts                    # Tipos TypeScript
```

## Exemplos de Uso

### 1. Autenticação Básica

```bash
# Iniciar autenticação
GET /tiktok/api/auth/authorize?scope=user.info.basic

# Após autorização, token estará em cookie
# Validar token
GET /tiktok/api/auth/validate
```

### 2. Obter Informações do Usuário

```bash
# Com token no cookie (após autenticação)
GET /tiktok/api/user/info

# Com token no header
GET /tiktok/api/user/info
Authorization: Bearer act.xxx

# Com token na query
GET /tiktok/api/user/info?access_token=act.xxx
```

### 3. Publicar Vídeo

```bash
# Via multipart/form-data
POST /tiktok/api/videos/publish
Content-Type: multipart/form-data

video: [arquivo]
title: "Meu Vídeo"
description: "Descrição do vídeo"
privacy_level: "PUBLIC_TO_EVERYONE"
mode: "direct"

# Via JSON com URL
POST /tiktok/api/videos/publish
Content-Type: application/json

{
  "video_url": "https://example.com/video.mp4",
  "title": "Meu Vídeo",
  "privacy_level": "PUBLIC_TO_EVERYONE",
  "mode": "direct"
}
```

### 4. Consultar Status

```bash
POST /tiktok/api/videos/status
Content-Type: application/json

{
  "publish_id": "publish_id_string"
}
```

## Limitações e Considerações

1. **Escopos:**
   - Alguns escopos requerem aprovação do TikTok
   - Apps em modo sandbox têm limitações
   - Escopos devem ser habilitados no TikTok for Developers

2. **Limites de Publicação:**
   - TikTok impõe limites diários por criador
   - Sistema valida limites antes de publicar
   - Retorna erro claro quando limite é atingido

3. **Upload de Vídeos:**
   - Vídeos são baixados temporariamente se enviados via URL
   - Arquivos temporários são limpos automaticamente
   - Suporta formatos: MP4, MOV

4. **Tokens:**
   - Tokens têm tempo de expiração
   - Sistema não implementa refresh automático (requer re-autenticação)
   - Tokens são armazenados apenas em cookies (não em banco de dados)

## Manutenção e Extensibilidade

### Adicionar Novos Endpoints

1. Criar rota em `/src/app/tiktok/api/[novo-endpoint]/route.ts`
2. Usar classes do SDK em `/src/lib/tiktok/`
3. Seguir padrão de autenticação existente
4. Implementar tratamento de erros padronizado

### Adicionar Novas Funcionalidades ao SDK

1. Estender classe base `TikTok` ou criar nova classe especializada
2. Implementar métodos seguindo padrão de `Request`/`Response`
3. Adicionar tipos TypeScript em `request/types.ts`
4. Documentar na interface de usuário se necessário

## Conclusão

O serviço de integração TikTok fornece uma solução completa e robusta para integração com a TikTok API, incluindo autenticação segura, gerenciamento de usuários, publicação de vídeos e processamento de webhooks. A arquitetura modular facilita manutenção e extensão, enquanto as validações e tratamento de erros garantem uma experiência confiável.

