# Plano de Integração: TikTok SDK no Curriculum Michael

## Objetivo
Integrar todas as funcionalidades do projeto `tiktok-api-nextjs-sdk` em `/tiktok/` no projeto `curriculum-michael` sem alterar o funcionamento atual do portfolio.

## Estrutura Atual

### Curriculum Michael
- **Framework**: Next.js 14.2.14 (App Router)
- **Estrutura**: `src/app/`
- **Rotas existentes**: `/`, `/privacy`, `/terms`, `/verify`
- **Path alias**: `@/*` → `./src/*`

### TikTok SDK
- **Framework**: Next.js 16.0.1 (App Router)
- **Estrutura**: `app/` (raiz)
- **Rotas API**: `/api/auth/authorize`, `/api/auth/callback`, `/api/user/info`, `/api/videos/list`, `/api/webhooks`
- **Lib**: `lib/tiktok/`
- **Documentação**: `documentation/`

## Estrutura Proposta

Após integração, a estrutura ficará:

```
curriculum-michael/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Portfolio (sem alterações)
│   │   ├── layout.tsx                  # Layout raiz (sem alterações)
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── verify/
│   │   └── tiktok/                     # NOVA ROTA TIKTOK
│   │       ├── page.tsx                # Página inicial do TikTok SDK
│   │       ├── layout.tsx              # Layout específico do TikTok
│   │       ├── api/                    # Rotas de API do TikTok
│   │       │   ├── auth/
│   │       │   │   ├── authorize/
│   │       │   │   │   └── route.ts
│   │       │   │   └── callback/
│   │       │   │       └── route.ts
│   │       │   ├── user/
│   │       │   │   └── info/
│   │       │   │       └── route.ts
│   │       │   ├── videos/
│   │       │   │   └── list/
│   │       │   │       └── route.ts
│   │       │   └── webhooks/
│   │       │       └── route.ts
│   │       └── globals.css             # Estilos específicos (opcional)
│   └── lib/
│       └── tiktok/                     # SDK TikTok (cópia completa)
│           ├── authentication/
│           ├── user/
│           ├── video/
│           ├── post/
│           ├── webhooks/
│           ├── request/
│           ├── TikTok.ts
│           └── index.ts
└── documentation/
    └── tiktok/                         # Documentação do TikTok (opcional)
```

## Plano de Implementação

### FASE 1: Preparação e Estrutura Base

#### 1.1 Criar estrutura de diretórios
- [ ] Criar `src/app/tiktok/`
- [ ] Criar `src/app/tiktok/api/`
- [ ] Criar `src/lib/tiktok/` (ou manter em `lib/tiktok/` se preferir na raiz)
- [ ] Criar `documentation/tiktok/` (opcional)

#### 1.2 Copiar arquivos do SDK
- [ ] Copiar toda a pasta `lib/tiktok/` do projeto TikTok para `src/lib/tiktok/`
- [ ] Copiar `app/page.tsx` do TikTok para `src/app/tiktok/page.tsx`
- [ ] Copiar `app/globals.css` do TikTok (se existir) para `src/app/tiktok/globals.css` (opcional)

### FASE 2: Migração e Adaptação de Rotas de API

#### 2.1 Copiar rotas de API
- [ ] Copiar `app/api/auth/authorize/route.ts` → `src/app/tiktok/api/auth/authorize/route.ts`
- [ ] Copiar `app/api/auth/callback/route.ts` → `src/app/tiktok/api/auth/callback/route.ts`
- [ ] Copiar `app/api/user/info/route.ts` → `src/app/tiktok/api/user/info/route.ts`
- [ ] Copiar `app/api/videos/list/route.ts` → `src/app/tiktok/api/videos/list/route.ts`
- [ ] Copiar `app/api/webhooks/route.ts` → `src/app/tiktok/api/webhooks/route.ts`

#### 2.2 Atualizar imports nas rotas de API
**Arquivo**: `src/app/tiktok/api/auth/authorize/route.ts`
- [ ] Alterar: `import { Authentication } from '@/lib/tiktok';` → `import { Authentication } from '@/lib/tiktok';` (mesmo path, mas pode precisar ajustar)
- [ ] Alterar: `import { PKCE } from '@/lib/tiktok/request/constants';` → verificar path

**Arquivo**: `src/app/tiktok/api/auth/callback/route.ts`
- [ ] Atualizar imports similares

**Todos os arquivos de API**:
- [ ] Verificar e ajustar todos os imports relativos ao SDK

#### 2.3 Atualizar REDIRECT_URI nas rotas
**Arquivo**: `src/app/tiktok/api/auth/authorize/route.ts`
- [ ] Alterar: `TIKTOK_REDIRECT_URI` para incluir `/tiktok` no path
  - De: `${request.nextUrl.origin}/api/auth/callback`
  - Para: `${request.nextUrl.origin}/tiktok/api/auth/callback`

**Arquivo**: `src/app/tiktok/api/auth/callback/route.ts`
- [ ] Alterar: `TIKTOK_REDIRECT_URI` para incluir `/tiktok` no path
  - De: `${request.nextUrl.origin}/api/auth/callback`
  - Para: `${request.nextUrl.origin}/tiktok/api/auth/callback`

### FASE 3: Criar Página Principal do TikTok

#### 3.1 Criar `src/app/tiktok/page.tsx`
- [ ] Copiar conteúdo de `tiktok-api-nextjs-sdk/app/page.tsx`
- [ ] Atualizar links de API:
  - De: `/api/auth/authorize`
  - Para: `/tiktok/api/auth/authorize`
- [ ] Atualizar documentação:
  - Atualizar todos os exemplos de endpoints para incluir `/tiktok`

#### 3.2 Criar `src/app/tiktok/layout.tsx` (Opcional)
- [ ] Criar layout específico para `/tiktok/` que não herda o Navigation do portfolio
- [ ] Ou criar layout que mantém o Navigation mas com estilos diferentes
- [ ] Incluir estilos globais do TikTok (se necessário)

### FASE 4: Ajustes de Configuração

#### 4.1 Verificar `tsconfig.json`
- [ ] Confirmar que `@/*` aponta para `./src/*` (já está correto)
- [ ] Testar se imports `@/lib/tiktok` funcionam corretamente

#### 4.2 Verificar `package.json`
- [ ] Comparar dependências entre os dois projetos
- [ ] Adicionar dependências faltantes do TikTok SDK (se houver)
- [ ] Verificar versões compatíveis (Next.js 14.2.14 vs 16.0.1)
- [ ] **IMPORTANTE**: Verificar compatibilidade entre versões

#### 4.3 Variáveis de Ambiente
- [ ] Adicionar ao `.env.local` (ou criar se não existir):
  ```env
  TIKTOK_CLIENT_KEY=your_client_key
  TIKTOK_CLIENT_SECRET=your_client_secret
  TIKTOK_REDIRECT_URI=http://localhost:3000/tiktok/api/auth/callback
  TIKTOK_GRAPH_VERSION=v2
  ```

#### 4.4 Verificar `next.config.mjs`
- [ ] Verificar se precisa de configurações especiais
- [ ] Adicionar rewrites/redirects se necessário (provavelmente não)

### FASE 5: Adaptações de Compatibilidade

#### 5.1 Verificar compatibilidade Next.js
- [ ] Next.js 14.2.14 vs 16.0.1 - verificar se há breaking changes
- [ ] Testar se todas as APIs do Next.js 16 funcionam no 14
- [ ] Ajustar código se necessário para compatibilidade

#### 5.2 Ajustar tipos TypeScript
- [ ] Verificar se todos os tipos são compatíveis
- [ ] Ajustar tipos se necessário

#### 5.3 Verificar dependências de crypto
- [ ] O SDK usa `crypto` do Node.js - verificar compatibilidade
- [ ] Testar geração de PKCE

### FASE 6: Testes e Validação

#### 6.1 Testes de Rotas
- [ ] Testar acesso a `/tiktok/` - deve mostrar página do SDK
- [ ] Testar `/tiktok/api/auth/authorize` - deve redirecionar para TikTok
- [ ] Testar `/tiktok/api/auth/callback` - deve processar callback
- [ ] Testar `/tiktok/api/user/info` - deve retornar informações
- [ ] Testar `/tiktok/api/videos/list` - deve listar vídeos
- [ ] Testar `/tiktok/api/webhooks` - deve processar webhooks

#### 6.2 Testes de Isolamento
- [ ] Verificar que `/` ainda mostra o portfolio
- [ ] Verificar que `/privacy`, `/terms`, `/verify` ainda funcionam
- [ ] Verificar que nenhuma funcionalidade do portfolio foi afetada

#### 6.3 Testes de Integração
- [ ] Testar fluxo completo de autenticação OAuth
- [ ] Testar obtenção de token
- [ ] Testar listagem de vídeos
- [ ] Testar webhooks (se aplicável)

### FASE 7: Documentação

#### 7.1 Atualizar documentação
- [ ] Copiar `documentation/` do TikTok para `documentation/tiktok/` (opcional)
- [ ] Atualizar README.md com instruções sobre `/tiktok/`
- [ ] Documentar estrutura de rotas
- [ ] Documentar variáveis de ambiente

#### 7.2 Criar guia de uso
- [ ] Documentar como acessar `/tiktok/`
- [ ] Documentar endpoints disponíveis
- [ ] Documentar como configurar credenciais

## Detalhes Técnicos Importantes

### Rotas Finais

Após integração, as rotas serão:

**Portfolio (sem alterações)**:
- `GET /` - Página principal do portfolio
- `GET /privacy` - Política de privacidade
- `GET /terms` - Termos de uso
- `GET /verify` - Verificação

**TikTok SDK (novas rotas)**:
- `GET /tiktok/` - Página principal do SDK
- `GET /tiktok/api/auth/authorize` - Iniciar autenticação
- `GET /tiktok/api/auth/callback` - Callback de autenticação
- `GET /tiktok/api/user/info` - Informações do usuário
- `POST /tiktok/api/videos/list` - Listar vídeos
- `POST /tiktok/api/webhooks` - Receber webhooks

### Imports

Todos os imports do SDK devem usar o path alias `@/lib/tiktok`:
```typescript
import { Authentication } from '@/lib/tiktok';
import { PKCE } from '@/lib/tiktok/request/constants';
```

### Variáveis de Ambiente

```env
# TikTok SDK (adicionar ao .env.local)
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/tiktok/api/auth/callback
TIKTOK_GRAPH_VERSION=v2
```

### Cookies

O cookie `tiktok_code_verifier` continuará funcionando normalmente, pois cookies são compartilhados entre todas as rotas do mesmo domínio.

## Possíveis Problemas e Soluções

### Problema 1: Incompatibilidade de versões Next.js
**Solução**: 
- Verificar breaking changes entre Next.js 14 e 16
- Ajustar código conforme necessário
- Considerar atualizar Next.js do curriculum-michael (se possível)

### Problema 2: Conflitos de estilos CSS
**Solução**: 
- Criar `layout.tsx` específico para `/tiktok/`
- Usar CSS modules ou styled-components para isolar estilos
- Verificar se TailwindCSS não tem conflitos

### Problema 3: Conflitos de path alias
**Solução**: 
- Verificar se `@/*` funciona corretamente
- Ajustar imports se necessário

### Problema 4: Variáveis de ambiente
**Solução**: 
- Garantir que `.env.local` tem todas as variáveis necessárias
- Documentar quais variáveis são necessárias

### Problema 5: Dependências faltantes
**Solução**: 
- Comparar `package.json` dos dois projetos
- Instalar dependências faltantes
- Verificar compatibilidade de versões

## Checklist Final

### Antes de começar
- [ ] Fazer backup do projeto curriculum-michael
- [ ] Criar branch git para a integração
- [ ] Verificar versões de dependências

### Durante implementação
- [ ] Seguir fases na ordem
- [ ] Testar cada fase antes de prosseguir
- [ ] Documentar problemas encontrados

### Após implementação
- [ ] Testar todas as rotas
- [ ] Verificar isolamento entre portfolio e TikTok
- [ ] Atualizar documentação
- [ ] Fazer commit com mensagem descritiva

## Ordem de Execução Recomendada

1. **FASE 1**: Criar estrutura e copiar arquivos base
2. **FASE 2**: Migrar rotas de API (mais crítico)
3. **FASE 3**: Criar página principal
4. **FASE 4**: Ajustar configurações
5. **FASE 5**: Resolver problemas de compatibilidade
6. **FASE 6**: Testes extensivos
7. **FASE 7**: Documentação final

## Notas Finais

- **Isolamento**: O TikTok SDK ficará completamente isolado em `/tiktok/`, não afetando o portfolio
- **Compartilhamento**: O SDK pode usar recursos compartilhados como `lib/` se necessário
- **Manutenção**: Futuras atualizações do SDK devem ser feitas apenas em `src/lib/tiktok/` e `src/app/tiktok/`
- **Produção**: Lembre-se de atualizar `TIKTOK_REDIRECT_URI` para a URL de produção

## Arquivos que NÃO devem ser alterados

- `src/app/page.tsx` (página principal do portfolio)
- `src/app/layout.tsx` (layout raiz)
- `src/app/privacy/`, `src/app/terms/`, `src/app/verify/` (outras rotas)
- `src/components/` (componentes do portfolio)
- `src/contexts/` (contextos do portfolio)
- Configurações globais (a menos que necessário)

## Arquivos que serão CRIADOS

- `src/app/tiktok/page.tsx`
- `src/app/tiktok/layout.tsx` (opcional)
- `src/app/tiktok/api/**/*.ts` (todas as rotas de API)
- `src/lib/tiktok/**/*.ts` (todo o SDK)
- `documentation/tiktok/**/*.md` (opcional)

