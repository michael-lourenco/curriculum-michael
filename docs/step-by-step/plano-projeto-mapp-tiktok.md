# Plano de Implementação - Projeto MAPP-TikTok

## Visão Geral

Criar um projeto serverless completo para integração com TikTok API, seguindo a estrutura do `multiplier-facebook` e implementando todos os endpoints desenvolvidos no `curriculum-michael`.

## Objetivo

Desenvolver um backend serverless na AWS que forneça:
- Autenticação OAuth 2.0 com PKCE
- Gerenciamento de usuários TikTok
- Listagem de vídeos
- Publicação de vídeos (com upload via S3)
- Processamento de webhooks
- Refresh automático de tokens
- Armazenamento seguro de tokens e histórico

---

## FASE 1: Estrutura Base do Projeto

### 1.1 Criação da Estrutura de Diretórios

```
mapp-tiktok/
├── tiktokService/
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── api/
│   │   │   │   ├── authHandler.js          # Auth endpoints
│   │   │   │   ├── userHandler.js          # User endpoints
│   │   │   │   ├── videoHandler.js         # Video endpoints
│   │   │   │   └── webhookHandler.js       # Webhook endpoints
│   │   │   └── processing/
│   │   │       └── videoUploadHandler.js   # Processamento assíncrono SQS
│   │   ├── services/
│   │   │   ├── tiktok/
│   │   │   │   ├── TikTokAuthService.js    # Lógica OAuth/PKCE
│   │   │   │   ├── TikTokUserService.js    # Lógica de usuários
│   │   │   │   ├── TikTokVideoService.js   # Lógica de vídeos
│   │   │   │   └── TikTokPostService.js    # Lógica de publicação
│   │   │   ├── queue/
│   │   │   │   └── SQSService.js           # Gerenciamento SQS
│   │   │   ├── storage/
│   │   │   │   └── S3Service.js             # Upload/download S3
│   │   │   └── token/
│   │   │       └── TokenService.js          # Gerenciamento tokens
│   │   ├── repositories/
│   │   │   ├── UserRepository.js            # CRUD usuários
│   │   │   ├── TokenRepository.js           # CRUD tokens
│   │   │   └── VideoRepository.js           # CRUD vídeos/publicações
│   │   ├── models/
│   │   │   ├── TikTokUser.js                # Schema usuário
│   │   │   ├── TikTokToken.js               # Schema token
│   │   │   └── TikTokVideo.js               # Schema vídeo/publicação
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── UserController.js
│   │   │   ├── VideoController.js
│   │   │   └── WebhookController.js
│   │   ├── lib/
│   │   │   └── tiktok/                      # SDK TikTok (copiado do curriculum-michael)
│   │   │       ├── TikTok.ts
│   │   │       ├── authentication/
│   │   │       ├── user/
│   │   │       ├── video/
│   │   │       ├── post/
│   │   │       ├── webhooks/
│   │   │       └── request/
│   │   └── config/
│   │       └── database.js                 # Config MongoDB
│   ├── serverless.yml                       # Config Serverless Framework
│   ├── package.json
│   ├── env.example
│   └── README.md
├── docs/
│   └── step-by-step/                        # Documentação de desenvolvimento
└── .gitignore
```

### 1.2 Configuração Inicial

**Arquivos a criar:**
- `package.json` - Dependências Node.js
- `serverless.yml` - Configuração AWS Serverless Framework
- `env.example` - Template de variáveis de ambiente
- `.gitignore` - Arquivos ignorados
- `README.md` - Documentação principal

---

## FASE 2: Infraestrutura AWS (CloudFormation via Serverless)

### 2.1 Recursos AWS Necessários

#### 2.1.1 Lambda Functions
- `handleAuthCallback` - Callback OAuth
- `refreshToken` - Renovar tokens
- `validateToken` - Validar tokens
- `getUserInfo` - Informações do usuário
- `listVideos` - Listar vídeos
- `publishVideo` - Iniciar publicação
- `getVideoStatus` - Status da publicação
- `processVideoUpload` - Worker SQS para upload assíncrono
- `handleWebhook` - Processar webhooks TikTok

#### 2.1.2 API Gateway
- REST API com CORS habilitado
- Rate limiting e throttling
- Usage plan (para futura API Key)

#### 2.1.3 SQS (Simple Queue Service)
- `VideoUploadQueue` (FIFO) - Fila para processamento de uploads
- Configurações:
  - ContentBasedDeduplication: true
  - DelaySeconds: 0
  - VisibilityTimeout: 300 (5 minutos)
  - MessageRetentionPeriod: 3600 (1 hora)

#### 2.1.4 S3 (Simple Storage Service)
- Bucket para vídeos temporários
- Lifecycle policy (deletar após 24h)
- CORS configurado
- Bucket policies para acesso Lambda

#### 2.1.5 Parameter Store (Systems Manager)
- `/tiktok-service/{stage}/client-key`
- `/tiktok-service/{stage}/client-secret`
- `/tiktok-service/{stage}/redirect-uri`

#### 2.1.6 IAM Roles & Policies
- Permissões Lambda:
  - SQS: SendMessage, ReceiveMessage, DeleteMessage
  - S3: GetObject, PutObject, DeleteObject
  - SSM: GetParameter, PutParameter
  - CloudWatch Logs
  - Secrets Manager (opcional)

#### 2.1.7 CloudWatch
- Log Groups para cada Lambda
- Métricas customizadas
- Alarms (opcional)

### 2.2 Configuração serverless.yml

**Estrutura base:**
```yaml
app: mapp-tiktok
service: tiktokService
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  region: sa-east-1
  stage: ${opt:stage, 'dev'}
  
  environment:
    # MongoDB
    DB_USERNAME: ${env:DB_USERNAME}
    DB_PASSWORD: ${env:DB_PASSWORD}
    DB_HOST: ${env:DB_HOST}
    DB_PORT: ${env:DB_PORT}
    DB_NAME: ${env:DB_NAME}
    
    # TikTok API
    TIKTOK_CLIENT_KEY: ${ssm:/tiktok-service/${self:provider.stage}/client-key}
    TIKTOK_CLIENT_SECRET: ${ssm:/tiktok-service/${self:provider.stage}/client-secret}
    TIKTOK_REDIRECT_URI: ${ssm:/tiktok-service/${self:provider.stage}/redirect-uri}
    
    # SQS
    VIDEO_UPLOAD_QUEUE_URL: !Ref VideoUploadQueue
    
    # S3
    S3_BUCKET_NAME: !Ref VideoStorageBucket
    
    # General
    NODE_ENV: ${self:provider.stage}

functions:
  # Auth endpoints
  handleAuthCallback:
    handler: src/handlers/api/authHandler.handleCallback
    events:
      - http:
          path: /tiktok/auth/callback
          method: get
          cors: true
  
  refreshToken:
    handler: src/handlers/api/authHandler.refreshToken
    events:
      - http:
          path: /tiktok/auth/refresh
          method: post
          cors: true
  
  validateToken:
    handler: src/handlers/api/authHandler.validateToken
    events:
      - http:
          path: /tiktok/auth/validate
          method: get
          cors: true
  
  # User endpoints
  getUserInfo:
    handler: src/handlers/api/userHandler.getUserInfo
    events:
      - http:
          path: /tiktok/user/info
          method: get
          cors: true
  
  # Video endpoints
  listVideos:
    handler: src/handlers/api/videoHandler.listVideos
    events:
      - http:
          path: /tiktok/videos/list
          method: post
          cors: true
  
  publishVideo:
    handler: src/handlers/api/videoHandler.publishVideo
    timeout: 60
    events:
      - http:
          path: /tiktok/videos/publish
          method: post
          cors: true
  
  getVideoStatus:
    handler: src/handlers/api/videoHandler.getVideoStatus
    events:
      - http:
          path: /tiktok/videos/status
          method: post
          cors: true
  
  # Webhook endpoint
  handleWebhook:
    handler: src/handlers/api/webhookHandler.handleWebhook
    events:
      - http:
          path: /tiktok/webhook
          method: post
          cors: true
      - http:
          path: /tiktok/webhook
          method: get
          cors: true
  
  # SQS Worker
  processVideoUpload:
    handler: src/handlers/processing/videoUploadHandler.processVideoUpload
    timeout: 300
    reservedConcurrency: 2
    events:
      - sqs:
          arn: !GetAtt VideoUploadQueue.Arn
          batchSize: 1

resources:
  Resources:
    # SQS Queue
    VideoUploadQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-${self:provider.stage}-video-upload.fifo
        FifoQueue: true
        ContentBasedDeduplication: true
        DelaySeconds: 0
        VisibilityTimeout: 300
        MessageRetentionPeriod: 3600
        ReceiveMessageWaitTimeSeconds: 0
    
    # S3 Bucket
    VideoStorageBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:service}-${self:provider.stage}-videos
        LifecycleConfiguration:
          Rules:
            - Id: DeleteOldVideos
              Status: Enabled
              ExpirationInDays: 1
        CorsConfiguration:
          CorsRules:
            - AllowedOrigins: ['*']
              AllowedMethods: [GET, PUT, POST, DELETE]
              AllowedHeaders: ['*']
              MaxAge: 3600
```

---

## FASE 3: Schemas MongoDB

### 3.1 Model: TikTokUser

```javascript
{
  openId: String (único, indexado),
  displayName: String,
  avatarUrl: String,
  unionId: String,
  bioDescription: String,
  followerCount: Number,
  followingCount: Number,
  likesCount: Number,
  videoCount: Number,
  isActive: Boolean,
  lastSyncAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 Model: TikTokToken

```javascript
{
  openId: String (único, indexado),
  accessToken: String (criptografado),
  refreshToken: String (criptografado),
  expiresAt: Date (indexado),
  tokenType: String,
  scope: [String],
  isActive: Boolean,
  lastRefreshedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 Model: TikTokVideo

```javascript
{
  videoId: String (único, indexado),
  openId: String (indexado),
  publishId: String,
  title: String,
  description: String,
  status: String (pending, processing, published, failed),
  privacyLevel: String,
  allowComment: Boolean,
  allowDuet: Boolean,
  allowStitch: Boolean,
  coverImageUrl: String,
  videoUrl: String,
  s3Key: String, // Chave do arquivo no S3
  publishedAt: Date,
  errorMessage: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## FASE 4: Implementação dos Handlers

### 4.1 Auth Handler (`authHandler.js`)

**Endpoints:**
1. `handleCallback` - Processa callback OAuth
   - Recebe code e state
   - Troca code por token
   - Salva token no MongoDB
   - Retorna sucesso/erro

2. `refreshToken` - Renova token
   - Busca refresh_token do MongoDB
   - Chama TikTok API
   - Atualiza tokens no MongoDB
   - Retorna novo token

3. `validateToken` - Valida token
   - Busca token do MongoDB
   - Valida via TikTok API
   - Retorna status

### 4.2 User Handler (`userHandler.js`)

**Endpoints:**
1. `getUserInfo` - Informações do usuário
   - Busca token do MongoDB
   - Chama TikTok API
   - Atualiza dados no MongoDB
   - Retorna informações

### 4.3 Video Handler (`videoHandler.js`)

**Endpoints:**
1. `listVideos` - Lista vídeos
   - Busca token do MongoDB
   - Chama TikTok API
   - Retorna lista paginada

2. `publishVideo` - Publica vídeo
   - Recebe vídeo (URL ou base64)
   - Se URL: faz download e salva no S3
   - Se base64: salva direto no S3
   - Cria mensagem na SQS
   - Retorna publish_id

3. `getVideoStatus` - Status da publicação
   - Busca no MongoDB
   - Se necessário, consulta TikTok API
   - Retorna status atualizado

### 4.4 Webhook Handler (`webhookHandler.js`)

**Endpoints:**
1. `handleWebhook` - Processa webhooks
   - GET: Verificação de desafio
   - POST: Processa eventos
   - Atualiza status no MongoDB

### 4.5 Video Upload Handler (`videoUploadHandler.js`)

**Worker SQS:**
1. `processVideoUpload` - Processa upload
   - Recebe mensagem da SQS
   - Busca vídeo no S3
   - Faz upload para TikTok
   - Atualiza status no MongoDB
   - Envia notificação (opcional)

---

## FASE 5: Serviços

### 5.1 TikTokAuthService
- Gerenciar OAuth flow
- Gerar PKCE codes
- Trocar code por token
- Refresh tokens

### 5.2 TikTokUserService
- Buscar informações do usuário
- Sincronizar dados

### 5.3 TikTokVideoService
- Listar vídeos
- Consultar status

### 5.4 TikTokPostService
- Iniciar publicação
- Upload de arquivos
- Consultar informações do criador

### 5.5 SQSService
- Enviar mensagens
- Processar mensagens
- Gerenciar filas

### 5.6 S3Service
- Upload de arquivos
- Download de arquivos
- Gerar URLs pré-assinadas
- Deletar arquivos

### 5.7 TokenService
- Buscar tokens do MongoDB
- Validar expiração
- Refresh automático
- Criptografar/descriptografar

---

## FASE 6: Repositórios

### 6.1 UserRepository
- `findByOpenId(openId)`
- `create(userData)`
- `update(openId, userData)`
- `upsert(openId, userData)`

### 6.2 TokenRepository
- `findByOpenId(openId)`
- `create(tokenData)`
- `update(openId, tokenData)`
- `findExpiredTokens()`
- `deactivate(openId)`

### 6.3 VideoRepository
- `findByVideoId(videoId)`
- `findByOpenId(openId)`
- `create(videoData)`
- `update(videoId, videoData)`
- `updateStatus(videoId, status)`

---

## FASE 7: Migração do SDK TikTok

### 7.1 Copiar SDK do curriculum-michael
- Copiar toda pasta `src/lib/tiktok/`
- Adaptar para ES6 modules (se necessário)
- Manter mesma estrutura

### 7.2 Adaptações Necessárias
- Converter TypeScript → JavaScript (ou manter TS)
- Ajustar imports para ES6
- Manter mesma lógica

---

## FASE 8: Fluxo de Publicação de Vídeo

### 8.1 Fluxo Completo

1. **Cliente envia requisição** → `POST /tiktok/videos/publish`
   - Body: vídeo (URL ou base64) + metadados

2. **Lambda publishVideo**:
   - Valida token
   - Se URL: faz download → salva no S3
   - Se base64: decodifica → salva no S3
   - Cria registro no MongoDB (status: pending)
   - Envia mensagem para SQS com:
     - openId
     - s3Key
     - publishId
     - metadados
   - Retorna publishId

3. **SQS dispara Lambda processVideoUpload**:
   - Busca vídeo do S3
   - Busca token do MongoDB
   - Faz upload para TikTok
   - Atualiza status no MongoDB
   - Se sucesso: status = published
   - Se erro: status = failed + errorMessage

4. **Cliente consulta status** → `POST /tiktok/videos/status`
   - Retorna status atualizado

---

## FASE 9: Segurança e Boas Práticas

### 9.1 Criptografia de Tokens
- Usar AWS KMS ou biblioteca de criptografia
- Tokens nunca em logs
- Criptografar antes de salvar no MongoDB

### 9.2 Validação de Entrada
- Validar todos os parâmetros
- Sanitizar dados
- Rate limiting (API Gateway)

### 9.3 Tratamento de Erros
- Logs estruturados
- Não expor informações sensíveis
- Retornar códigos HTTP apropriados

### 9.4 Monitoramento
- CloudWatch Logs
- Métricas customizadas
- Alarms para erros

---

## FASE 10: Variáveis de Ambiente

### 10.1 Local (.env)
```env
# MongoDB
DB_USERNAME=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=27017
DB_NAME=tiktok-service

# TikTok API (desenvolvimento)
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/tiktok/auth/callback

# AWS (local - usar LocalStack ou AWS real)
AWS_REGION=sa-east-1
AWS_PROFILE=default

# General
NODE_ENV=development
STAGE=dev
```

### 10.2 Parameter Store (Produção)
- `/tiktok-service/dev/client-key`
- `/tiktok-service/dev/client-secret`
- `/tiktok-service/dev/redirect-uri`
- `/tiktok-service/qa/...`
- `/tiktok-service/prod/...`

---

## FASE 11: Testes e Validação

### 11.1 Testes Locais
- Serverless Offline
- MongoDB local ou Atlas
- Testes unitários (opcional)

### 11.2 Testes de Integração
- Testar cada endpoint
- Validar fluxo completo
- Testar SQS e S3

### 11.3 Postman Collection
- Criar collection completa
- Incluir todos os endpoints
- Variáveis de ambiente

---

## FASE 12: Documentação

### 12.1 README.md
- Visão geral
- Arquitetura
- Como configurar
- Como fazer deploy
- Endpoints disponíveis

### 12.2 Documentação Step-by-Step
- Documentar cada fase
- Explicar decisões técnicas
- Troubleshooting

### 12.3 Diagramas
- Arquitetura AWS
- Fluxo de autenticação
- Fluxo de publicação

---

## Ordem de Implementação Recomendada

1. **FASE 1** - Estrutura base e configuração
2. **FASE 2** - Configuração serverless.yml (recursos AWS)
3. **FASE 3** - Schemas MongoDB
4. **FASE 7** - Migração SDK TikTok
5. **FASE 6** - Repositórios
6. **FASE 5** - Serviços base
7. **FASE 4** - Handlers (começar com auth)
8. **FASE 4** - Handlers (user, video, webhook)
9. **FASE 4** - Handler de processamento SQS
10. **FASE 8** - Testar fluxo completo
11. **FASE 9** - Segurança e otimizações
12. **FASE 12** - Documentação final

---

## Próximos Passos (Futuro)

1. **API Key Authentication** - Proteger endpoints
2. **Frontend Next.js** - Interface gráfica
3. **CI/CD Bitbucket Pipelines** - Deploy automatizado
4. **Refresh Automático de Tokens** - Job agendado
5. **Métricas e Dashboards** - CloudWatch Dashboards
6. **Rate Limiting Avançado** - Por usuário/IP
7. **Webhook Signature Validation** - Validar assinaturas TikTok

---

## Estimativa de Esforço

- **FASE 1-3**: 2-3 horas (estrutura e configuração)
- **FASE 4-6**: 8-12 horas (implementação core)
- **FASE 7**: 2-3 horas (migração SDK)
- **FASE 8-9**: 4-6 horas (integração e segurança)
- **FASE 10-12**: 3-4 horas (configuração e docs)

**Total estimado**: 19-28 horas

---

## Notas Importantes

1. **MongoDB**: Usar MongoDB Atlas ou instância própria
2. **S3**: Configurar lifecycle para limpeza automática
3. **SQS**: Usar FIFO para garantir ordem
4. **Tokens**: Sempre criptografar antes de salvar
5. **Logs**: Não logar tokens ou dados sensíveis
6. **CORS**: Configurar adequadamente para produção
7. **Timeouts**: Ajustar conforme tamanho de vídeos

---

Este plano fornece uma base sólida para implementação do projeto mapp-tiktok seguindo os padrões estabelecidos no multiplier-facebook e incorporando toda funcionalidade desenvolvida no curriculum-michael.

