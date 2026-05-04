# Step-by-Step - Desenvolvimento do Serviço TikTok

## Visão Geral do Projeto

Este documento detalha o processo de desenvolvimento e a função de cada arquivo do serviço de integração com a TikTok API.

## Estrutura e Responsabilidades dos Arquivos

### SDK Core (`/src/lib/tiktok/`)

#### `TikTok.ts`
**Função:** Classe base para todas as interações com a TikTok API
- Gerencia configuração de versão da API (graph_version)
- Implementa métodos genéricos GET e POST
- Gerencia tokens de acesso
- Implementa sistema de paginação via cursor
- Fornece método para requisições customizadas (útil para uploads)

**Utilidade:** Base para todas as classes especializadas (Authentication, User, Video, Post)

#### `authentication/Authentication.ts`
**Função:** Implementa fluxo OAuth 2.0 com PKCE
- Gera URLs de autenticação
- Troca código de autorização por access_token
- Gerencia client_key e client_secret
- Implementa PKCE (obrigatório pela TikTok)

**Utilidade:** Autenticação segura de usuários

#### `user/User.ts`
**Função:** Gerenciamento de informações de usuário
- Obtém dados do usuário autenticado (`getSelf`)
- Suporta campos customizáveis
- Valida tokens através de requisições reais

**Utilidade:** Acesso a dados do perfil do usuário

#### `video/Video.ts`
**Função:** Operações relacionadas a vídeos
- Lista vídeos do usuário (`getList`)
- Suporta paginação
- Filtra campos retornados

**Utilidade:** Consulta de vídeos existentes

#### `post/Post.ts`
**Função:** Publicação de vídeos
- Consulta informações do criador (`queryCreatorInfo`)
- Inicia publicação em modo draft (`draft`)
- Inicia publicação direta (`publish`)
- Faz upload de arquivos (`uploadFile`)
- Consulta status de publicação (`fetchStatus`)

**Utilidade:** Publicação completa de vídeos no TikTok

#### `webhooks/Webhooks.ts`
**Função:** Processamento de webhooks
- Processa payloads JSON recebidos
- Valida assinaturas (se implementado)
- Extrai dados de eventos

**Utilidade:** Receber notificações do TikTok sobre eventos

#### `request/Request.ts`
**Função:** Construção de requisições HTTP
- Monta URLs com parâmetros
- Adiciona headers necessários
- Prepara body para POST
- Suporta upload de arquivos

**Utilidade:** Abstração de requisições HTTP para a API

#### `request/HttpClient.ts`
**Função:** Execução de requisições HTTP
- Envia requisições usando fetch
- Trata respostas e erros
- Retorna formato padronizado (ApiResponse)

**Utilidade:** Cliente HTTP reutilizável

#### `request/constants.ts`
**Função:** Constantes do SDK
- Versões da API
- Métodos HTTP
- Parâmetros padrão
- Funções PKCE (geração de code_verifier/challenge)

**Utilidade:** Centralização de valores e funções compartilhadas

#### `request/types.ts`
**Função:** Definições TypeScript
- Interfaces para configuração
- Tipos de requisição/resposta
- Tipos de erro

**Utilidade:** Type-safety e IntelliSense

### API Routes (`/src/app/tiktok/api/`)

#### `auth/authorize/route.ts`
**Função:** Inicia processo de autenticação OAuth
- Gera par PKCE (code_verifier/challenge)
- Armazena code_verifier em cookie seguro
- Constrói URL de autorização do TikTok
- Redireciona usuário para TikTok

**Fluxo:**
1. Recebe escopos via query parameter
2. Gera PKCE pair
3. Salva code_verifier em cookie
4. Redireciona para TikTok

#### `auth/callback/route.ts`
**Função:** Processa callback do TikTok após autorização
- Recebe código de autorização
- Recupera code_verifier do cookie
- Troca código por access_token
- Armazena token em cookie
- Redireciona para página de sucesso ou erro

**Fluxo:**
1. Recebe `code` do TikTok
2. Valida code_verifier
3. Chama API para obter token
4. Salva token em cookie
5. Limpa code_verifier
6. Redireciona conforme resultado

#### `auth/validate/route.ts`
**Função:** Valida access_token
- Aceita token via header, query ou cookie
- Valida formato do token
- Testa token fazendo requisição real
- Analisa escopos disponíveis
- Identifica escopos faltantes

**Utilidade:** Debug e verificação de tokens

#### `user/info/route.ts`
**Função:** Endpoint para obter informações do usuário
- Resolve token de múltiplas fontes
- Chama User.getSelf()
- Retorna dados formatados
- Trata erros da API

**Utilidade:** API REST para dados do usuário

#### `videos/list/route.ts`
**Função:** Lista vídeos do usuário
- Resolve token
- Aceita parâmetros de paginação
- Chama Video.getList()
- Retorna lista formatada

**Utilidade:** API REST para listagem de vídeos

#### `videos/publish/route.ts`
**Função:** Publica vídeo no TikTok
- Resolve token
- Aceita vídeo via multipart ou URL
- Valida capacidade de publicação
- Valida parâmetros (privacidade, duração, etc.)
- Inicia publicação (draft ou direct)
- Faz upload do arquivo
- Consulta status inicial
- Limpa arquivos temporários

**Fluxo Completo:**
1. Resolve access_token
2. Processa vídeo (arquivo ou URL)
3. Valida informações do criador
4. Valida parâmetros de publicação
5. Inicia publicação (recebe publish_id e upload_url)
6. Faz upload do arquivo
7. Consulta status
8. Retorna resultado

**Validações Implementadas:**
- Limite de publicações do criador
- Níveis de privacidade permitidos
- Duração máxima do vídeo
- Configurações de interação (duet, stitch, comentários)

#### `videos/status/route.ts`
**Função:** Consulta status de publicação
- Resolve token
- Aceita publish_id via body ou query
- Chama Post.fetchStatus()
- Retorna status atual

**Utilidade:** Acompanhar progresso de publicações assíncronas

#### `creator/info/route.ts`
**Função:** Obtém informações do criador
- Resolve token
- Chama Post.queryCreatorInfo()
- Retorna capacidades e limites

**Utilidade:** Validar limites antes de publicar

### Interface de Usuário (`/src/app/tiktok/`)

#### `home/page.tsx`
**Função:** Página inicial do serviço
- Exibe recursos disponíveis
- Links para autenticação
- Links para ferramentas
- Documentação de endpoints
- Instruções de configuração

**Utilidade:** Dashboard e ponto de entrada

#### `auth/error/page.tsx`
**Função:** Página de erro de autenticação
- Recebe parâmetros de erro via URL
- Exibe mensagem de erro específica
- Fornece soluções passo a passo
- Links para documentação
- Detalhes técnicos do erro

**Tipos de Erro Tratados:**
- `invalid_scope` - Com instruções para habilitar escopos
- `no_code` - Problema no callback
- `no_code_verifier` - Erro PKCE
- `token_error` - Erro ao obter token

**Utilidade:** UX melhorada para resolução de problemas

#### `auth/success/page.tsx`
**Função:** Página de sucesso após autenticação
- Confirma autenticação bem-sucedida
- Exibe escopos obtidos
- Links para próximos passos

**Utilidade:** Feedback positivo ao usuário

#### `user-info/page.tsx`
**Função:** Interface para visualizar informações do usuário
- Chama `/api/user/info`
- Exibe dados formatados
- Mostra campos disponíveis

**Utilidade:** Teste e visualização de dados

#### `publish/page.tsx`
**Função:** Interface para publicar vídeos
- Formulário de upload
- Campos para título, descrição, privacidade
- Opções de interação
- Feedback de progresso

**Utilidade:** Interface amigável para publicação

#### `validate/page.tsx`
**Função:** Interface para validar tokens
- Chama `/api/auth/validate`
- Exibe resultado formatado
- Mostra análise de escopos

**Utilidade:** Ferramenta de debug

#### `layout.tsx`
**Função:** Layout compartilhado
- Estrutura comum das páginas
- Navegação (se implementada)

**Utilidade:** Consistência visual

### Webhook Handler

#### `webhook/route.ts`
**Função:** Processa webhooks do TikTok
- GET: Responde challenge (verificação)
- POST: Processa eventos recebidos
- Loga payloads para debug

**Utilidade:** Receber notificações do TikTok

### Rota Principal

#### `route.ts`
**Função:** Rota raiz `/tiktok`
- Redireciona para `/tiktok/home` ou processa callback
- Pode servir como callback alternativo

**Utilidade:** Roteamento flexível

## Fluxos Principais

### Fluxo de Autenticação

1. **Usuário acessa:** `/tiktok/api/auth/authorize?scope=user.info.basic`
2. **Sistema:**
   - Gera PKCE pair
   - Salva code_verifier em cookie
   - Redireciona para TikTok
3. **TikTok:**
   - Usuário autoriza
   - Redireciona para callback com `code`
4. **Sistema (callback):**
   - Recupera code_verifier
   - Troca code por access_token
   - Salva token em cookie
   - Redireciona para sucesso
5. **Usuário:** Autenticado, token disponível em cookie

### Fluxo de Publicação

1. **Cliente envia:** POST `/tiktok/api/videos/publish` com vídeo
2. **Sistema:**
   - Resolve access_token
   - Processa vídeo (arquivo ou URL)
   - Valida informações do criador
   - Valida parâmetros
3. **Sistema:**
   - Chama `post.draft()` ou `post.publish()`
   - Recebe `publish_id` e `upload_url`
4. **Sistema:**
   - Faz upload do arquivo via `post.uploadFile()`
   - Consulta status inicial
5. **Sistema:** Retorna resultado com publish_id

### Fluxo de Validação

1. **Cliente acessa:** `/tiktok/api/auth/validate` (com token)
2. **Sistema:**
   - Resolve token (header/query/cookie)
   - Valida formato
   - Chama `user.getSelf()` para testar
3. **Sistema:** Retorna validação e análise de escopos

## Decisões de Design

### 1. Múltiplos Métodos de Autenticação
**Decisão:** Aceitar token via header, query ou cookie
**Razão:** Flexibilidade para diferentes tipos de cliente (web, mobile, API)

### 2. Cookies HTTP-only
**Decisão:** Armazenar tokens em cookies HTTP-only
**Razão:** Segurança - previne acesso via JavaScript (XSS)

### 3. Validações Extensivas
**Decisão:** Validar tudo antes de publicar
**Razão:** Melhor UX - erros claros antes de tentar publicar

### 4. Suporte a Draft e Direct
**Decisão:** Implementar ambos os modos
**Razão:** Flexibilidade - alguns criadores preferem revisar antes

### 5. Download Temporário de URLs
**Decisão:** Baixar vídeos de URLs para arquivo temporário
**Razão:** API do TikTok requer arquivo local para upload

### 6. Limpeza Automática
**Decisão:** Limpar arquivos temporários em finally
**Razão:** Prevenir acúmulo de arquivos no servidor

## Melhorias Futuras

1. **Refresh Token:** Implementar renovação automática de tokens
2. **Banco de Dados:** Armazenar tokens e sessões
3. **Queue System:** Sistema de fila para publicações
4. **Retry Logic:** Retry automático em caso de falha
5. **Webhook Signature:** Validação de assinatura de webhooks
6. **Analytics:** Dashboard de estatísticas de uso
7. **Rate Limiting:** Controle de taxa de requisições
8. **Caching:** Cache de informações do criador

## Conclusão

O serviço foi desenvolvido com foco em:
- **Segurança:** PKCE, cookies seguros, validações
- **Robustez:** Tratamento de erros, validações extensivas
- **Flexibilidade:** Múltiplos métodos de autenticação, modos de publicação
- **Manutenibilidade:** Código modular, TypeScript, documentação
- **UX:** Páginas de erro informativas, feedback claro

Cada arquivo tem uma responsabilidade clara, facilitando manutenção e extensão futura.

