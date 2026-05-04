# Infraestrutura AWS - MAPP-TikTok

## Visão Geral da Arquitetura

Este documento explica em detalhes a infraestrutura AWS que será criada para o projeto mapp-tiktok, incluindo cada serviço, sua função e como eles se integram.

---

## Diagrama de Arquitetura

```
┌─────────────┐
│   Cliente   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────────────────────────────────────────┐
│           API Gateway (REST API)                │
│  - Rate Limiting                               │
│  - CORS                                        │
│  - Request/Response Transformation             │
└──────┬──────────────────────────────────────────┘
       │
       │ Invoca Lambdas
       ▼
┌─────────────────────────────────────────────────┐
│              AWS Lambda Functions              │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Handler │  │ User Handler │          │
│  └──────────────┘  └──────────────┘          │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │Video Handler │  │Webhook Handler│         │
│  └──────┬───────┘  └──────────────┘          │
│         │                                     │
│         │ Envia mensagem                      │
│         ▼                                     │
│  ┌──────────────┐                            │
│  │   SQS Queue  │                            │
│  │  (FIFO)      │                            │
│  └──────┬───────┘                            │
│         │                                     │
│         │ Dispara                             │
│         ▼                                     │
│  ┌──────────────┐                            │
│  │Upload Worker │                            │
│  │   Lambda     │                            │
│  └──────────────┘                            │
└──────┬────────────────────────────────────────┘
       │
       │ Acessa serviços AWS
       ▼
┌─────────────────────────────────────────────────┐
│              Serviços AWS                       │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │      S3       │  │ Parameter    │          │
│  │   (Storage)   │  │   Store      │          │
│  └──────────────┘  └──────────────┘          │
│                                                │
│  ┌──────────────┐  ┌──────────────┐          │
│  │   MongoDB    │  │  CloudWatch  │          │
│  │  (External)   │  │    (Logs)     │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘
```

---

## 1. API Gateway

### O que é?
API Gateway é o ponto de entrada para todas as requisições HTTP. Ele gerencia roteamento, autenticação, rate limiting e transformação de requisições.

### Função no Projeto
- Recebe requisições HTTP dos clientes
- Roteia para a Lambda function correta
- Gerencia CORS (Cross-Origin Resource Sharing)
- Aplica rate limiting (limite de requisições)
- Transforma requisições/respostas

### Configuração
```yaml
apiGateway:
  usagePlan:
    quota:
      limit: 50000        # 50k requisições por mês
      period: MONTH
    throttle:
      burstLimit: 200      # Pico de 200 req/s
      rateLimit: 100       # Taxa de 100 req/s
```

### Custos
- Primeiros 1 milhão de requisições/mês: **GRÁTIS**
- Após: $3.50 por milhão de requisições
- **Estimativa para projeto**: ~$0-10/mês (dependendo do uso)

---

## 2. AWS Lambda

### O que é?
Lambda é um serviço de computação serverless. Você escreve funções (código) e a AWS executa quando necessário, sem precisar gerenciar servidores.

### Função no Projeto
Cada endpoint da API será uma Lambda function:
- `handleAuthCallback` - Processa callback OAuth
- `refreshToken` - Renova tokens
- `validateToken` - Valida tokens
- `getUserInfo` - Busca informações do usuário
- `listVideos` - Lista vídeos
- `publishVideo` - Inicia publicação
- `getVideoStatus` - Consulta status
- `handleWebhook` - Processa webhooks
- `processVideoUpload` - Worker para uploads (disparado por SQS)

### Configuração
```yaml
functions:
  publishVideo:
    handler: src/handlers/api/videoHandler.publishVideo
    timeout: 60              # 60 segundos máximo
    memorySize: 512          # 512 MB de memória
    runtime: nodejs20.x      # Node.js 20
```

### Custos
- Primeiros 1 milhão de requisições/mês: **GRÁTIS**
- Primeiros 400.000 GB-segundos/mês: **GRÁTIS**
- Após: $0.20 por 1 milhão de requisições
- **Estimativa para projeto**: ~$0-5/mês

### Vantagens
- Escala automaticamente
- Paga apenas pelo que usa
- Sem gerenciamento de servidores
- Execução rápida (cold start ~1-2s)

---

## 3. SQS (Simple Queue Service)

### O que é?
SQS é um serviço de filas de mensagens. Permite comunicação assíncrona entre componentes.

### Função no Projeto
Fila FIFO (First In, First Out) para processamento assíncrono de uploads de vídeo:
1. Cliente envia requisição de publicação
2. Lambda `publishVideo` salva vídeo no S3
3. Lambda envia mensagem para SQS com dados do vídeo
4. SQS dispara automaticamente Lambda `processVideoUpload`
5. Worker faz upload para TikTok

### Por que usar?
- **Processamento assíncrono**: Uploads podem demorar, não bloqueia cliente
- **Retry automático**: Se falhar, SQS tenta novamente
- **Escalabilidade**: Processa múltiplos vídeos em paralelo
- **Confiabilidade**: Mensagens não se perdem

### Configuração
```yaml
VideoUploadQueue:
  Type: AWS::SQS::Queue
  Properties:
    QueueName: tiktokService-dev-video-upload.fifo
    FifoQueue: true                          # Fila ordenada
    ContentBasedDeduplication: true          # Evita duplicatas
    VisibilityTimeout: 300                   # 5 minutos
    MessageRetentionPeriod: 3600             # 1 hora
```

### Fluxo de Mensagem
```
1. Lambda envia mensagem → SQS
2. SQS armazena mensagem
3. SQS dispara Lambda worker
4. Lambda processa mensagem
5. Lambda deleta mensagem (sucesso)
   OU
   Mensagem volta para fila após timeout (erro)
```

### Custos
- Primeiros 1 milhão de requisições/mês: **GRÁTIS**
- Após: $0.50 por milhão de requisições
- **Estimativa para projeto**: ~$0-2/mês

---

## 4. S3 (Simple Storage Service)

### O que é?
S3 é um serviço de armazenamento de objetos (arquivos). É como um "HD na nuvem".

### Função no Projeto
Armazenar vídeos temporariamente antes do upload para TikTok:
1. Cliente envia vídeo (URL ou base64)
2. Lambda faz download (se URL) ou decodifica (se base64)
3. Lambda salva vídeo no S3
4. Worker Lambda busca vídeo do S3
5. Worker faz upload para TikTok
6. Lifecycle policy deleta vídeo após 24h

### Por que usar?
- **Armazenamento temporário**: Vídeos grandes não cabem na memória Lambda
- **Acesso rápido**: Worker pode buscar vídeo facilmente
- **Limpeza automática**: Lifecycle policy remove arquivos antigos
- **Confiabilidade**: Arquivos não se perdem

### Configuração
```yaml
VideoStorageBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: tiktokService-dev-videos
    LifecycleConfiguration:
      Rules:
        - Id: DeleteOldVideos
          Status: Enabled
          ExpirationInDays: 1              # Deleta após 1 dia
```

### Estrutura de Arquivos
```
s3://tiktokService-dev-videos/
├── videos/
│   ├── {openId}/
│   │   ├── {publishId}-video.mp4
│   │   └── {publishId}-thumbnail.jpg
```

### Custos
- Primeiros 5 GB: **GRÁTIS**
- Armazenamento: $0.023 por GB/mês
- Transferências: $0.09 por GB (primeiros 10 TB)
- **Estimativa para projeto**: ~$0-5/mês (dependendo do volume de vídeos)

---

## 5. Parameter Store (Systems Manager)

### O que é?
Parameter Store é um serviço para armazenar configurações e secrets de forma segura.

### Função no Projeto
Armazenar credenciais sensíveis do TikTok:
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REDIRECT_URI`

### Por que usar?
- **Segurança**: Credenciais não ficam no código
- **Gerenciamento centralizado**: Fácil atualizar
- **Versionamento**: Mantém histórico de valores
- **Criptografia**: Pode usar KMS para criptografar

### Configuração
```yaml
environment:
  TIKTOK_CLIENT_KEY: ${ssm:/tiktok-service/${self:provider.stage}/client-key}
  TIKTOK_CLIENT_SECRET: ${ssm:/tiktok-service/${self:provider.stage}/client-secret}
```

### Como Configurar
```bash
# Via AWS CLI
aws ssm put-parameter \
  --name "/tiktok-service/dev/client-key" \
  --value "your_client_key" \
  --type "String"

aws ssm put-parameter \
  --name "/tiktok-service/dev/client-secret" \
  --value "your_client_secret" \
  --type "SecureString"
```

### Custos
- Standard parameters: **GRÁTIS** (até 10.000)
- Advanced parameters: $0.05 por parâmetro/mês
- **Estimativa para projeto**: **GRÁTIS** (usando Standard)

---

## 6. CloudWatch

### O que é?
CloudWatch é o serviço de monitoramento e logs da AWS.

### Função no Projeto
- **Logs**: Todas as execuções Lambda geram logs
- **Métricas**: Monitora performance, erros, latência
- **Alarms**: Alertas quando algo está errado

### O que é Monitorado
- Execuções Lambda (sucesso/falha)
- Tempo de execução
- Uso de memória
- Erros e exceções
- Requisições API Gateway

### Configuração Automática
Serverless Framework cria automaticamente:
- Log Groups para cada Lambda
- Retenção de logs (30 dias padrão)
- Métricas básicas

### Custos
- Primeiros 5 GB de logs/mês: **GRÁTIS**
- Após: $0.50 por GB
- Métricas customizadas: $0.30 por métrica/mês
- **Estimativa para projeto**: ~$0-3/mês

---

## 7. IAM (Identity and Access Management)

### O que é?
IAM gerencia permissões e acesso aos recursos AWS.

### Função no Projeto
Cada Lambda precisa de permissões para:
- Ler/escrever no S3
- Enviar/receber mensagens SQS
- Ler Parameter Store
- Escrever logs no CloudWatch

### Configuração
```yaml
provider:
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - s3:GetObject
            - s3:PutObject
            - s3:DeleteObject
          Resource: arn:aws:s3:::tiktokService-*-videos/*
        
        - Effect: Allow
          Action:
            - sqs:SendMessage
            - sqs:ReceiveMessage
            - sqs:DeleteMessage
          Resource: !GetAtt VideoUploadQueue.Arn
```

### Princípio do Menor Privilégio
Cada Lambda recebe apenas as permissões necessárias.

---

## 8. MongoDB (Externo)

### O que é?
MongoDB é um banco de dados NoSQL. Não é serviço AWS, mas será usado externamente (MongoDB Atlas ou instância própria).

### Função no Projeto
Armazenar:
- Dados de usuários TikTok
- Tokens (criptografados)
- Histórico de publicações
- Status de vídeos

### Por que MongoDB?
- Estrutura flexível (JSON)
- Fácil integração com Node.js
- Escalável
- Já usado no multiplier-facebook

### Configuração
```javascript
// src/config/database.js
mongoose.connect(
  `mongodb://${username}:${password}@${host}:${port}/${dbName}`
);
```

---

## Fluxo Completo: Publicação de Vídeo

### Passo a Passo

1. **Cliente faz requisição**
   ```
   POST /tiktok/videos/publish
   Body: { video_url: "https://...", title: "..." }
   ```

2. **API Gateway recebe**
   - Valida CORS
   - Roteia para Lambda `publishVideo`

3. **Lambda publishVideo executa**
   - Busca token do MongoDB
   - Faz download do vídeo (se URL)
   - Salva vídeo no S3
   - Cria registro no MongoDB (status: pending)
   - Envia mensagem para SQS:
     ```json
     {
       "openId": "act.xxx",
       "s3Key": "videos/act.xxx/publish123-video.mp4",
       "publishId": "publish123",
       "metadata": { "title": "...", "privacy": "..." }
     }
     ```
   - Retorna `publishId` para cliente

4. **SQS recebe mensagem**
   - Armazena na fila
   - Dispara automaticamente Lambda `processVideoUpload`

5. **Lambda processVideoUpload executa**
   - Busca mensagem da SQS
   - Busca vídeo do S3 usando `s3Key`
   - Busca token do MongoDB
   - Faz upload para TikTok API
   - Atualiza status no MongoDB:
     - Sucesso: `status: "published"`
     - Erro: `status: "failed"` + `errorMessage`
   - Deleta mensagem da SQS

6. **Cliente consulta status**
   ```
   POST /tiktok/videos/status
   Body: { publishId: "publish123" }
   ```
   - Lambda `getVideoStatus` busca no MongoDB
   - Retorna status atualizado

---

## Custos Estimados Mensais

| Serviço | Uso Estimado | Custo |
|---------|--------------|-------|
| API Gateway | 100k requisições | $0 |
| Lambda | 200k invocações, 50GB-seg | $0-5 |
| SQS | 10k mensagens | $0-2 |
| S3 | 50 GB armazenamento | $0-5 |
| Parameter Store | 3 parâmetros | $0 |
| CloudWatch | 10 GB logs | $0-3 |
| **TOTAL** | | **$0-20/mês** |

*Estimativa para uso moderado. Pode variar conforme volume real.*

---

## Vantagens da Arquitetura Serverless

1. **Sem Gerenciamento de Servidores**
   - AWS gerencia infraestrutura
   - Foco no código

2. **Escalabilidade Automática**
   - Lida com picos de tráfego
   - Escala para zero quando não há uso

3. **Custo Eficiente**
   - Paga apenas pelo que usa
   - Sem custos de servidor ocioso

4. **Alta Disponibilidade**
   - AWS garante 99.99% de uptime
   - Redundância automática

5. **Deploy Simples**
   - Serverless Framework facilita deploy
   - Uma linha de comando

---

## Próximos Passos

1. **Configurar credenciais AWS**
   ```bash
   aws configure
   ```

2. **Instalar Serverless Framework**
   ```bash
   npm install -g serverless
   ```

3. **Criar projeto**
   ```bash
   serverless create --template aws-nodejs
   ```

4. **Configurar variáveis**
   - Parameter Store
   - MongoDB
   - TikTok API

5. **Deploy**
   ```bash
   serverless deploy --stage dev
   ```

---

## Recursos Adicionais

- [Documentação API Gateway](https://docs.aws.amazon.com/apigateway/)
- [Documentação Lambda](https://docs.aws.amazon.com/lambda/)
- [Documentação SQS](https://docs.aws.amazon.com/sqs/)
- [Documentação S3](https://docs.aws.amazon.com/s3/)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)

---

Esta arquitetura fornece uma base sólida, escalável e econômica para o projeto mapp-tiktok, seguindo as melhores práticas de arquitetura serverless na AWS.

