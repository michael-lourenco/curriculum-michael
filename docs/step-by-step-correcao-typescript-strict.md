# Step-by-Step: Correção de Erros TypeScript Strict Mode

## Data: 2025-01-27

## Problema Identificado

Durante a execução do build do projeto (`yarn run build`), foram encontrados erros de compilação TypeScript relacionados ao modo strict. O TypeScript estava reclamando que propriedades de classes não estavam sendo inicializadas ou definitivamente atribuídas no construtor.

### Erros Encontrados:

1. **Arquivo:** `src/lib/tiktok/TikTok.ts`
   - **Erro:** `Property 'accessToken' has no initializer and is not definitely assigned in the constructor.`
   - **Linha:** 18

2. **Arquivo:** `src/lib/tiktok/request/Request.ts`
   - **Erro:** `Property 'url' has no initializer and is not definitely assigned in the constructor.`
   - **Linha:** 18

## Análise do Problema

O projeto utiliza TypeScript em modo strict (configurado em `tsconfig.json` com `"strict": true`). Neste modo, todas as propriedades de classe devem ser:
- Inicializadas na declaração, ou
- Inicializadas no construtor antes de qualquer uso, ou
- Marcadas como opcionais com `?`, ou
- Marcadas com o operador de asserção `!`

No código existente, as propriedades estavam sendo atribuídas através de métodos (como `setAccessToken()`) ou através de métodos chamados no construtor (como `setUrl()`), mas o TypeScript não consegue garantir que essas propriedades sejam inicializadas antes do uso.

## Soluções Implementadas

### 1. Correção em `TikTok.ts`

**Arquivo:** `src/lib/tiktok/TikTok.ts`

**Alteração realizada:**
- Modificado o construtor para inicializar diretamente a propriedade `accessToken` em vez de chamar o método `setAccessToken()`.

**Antes:**
```typescript
constructor(config: TikTokConfig) {
  this.setAccessToken(config.access_token || '');
  this.client = new HttpClient();
  this.graphVersion = config.graph_version || DEFAULT_GRAPH_VERSION;
}
```

**Depois:**
```typescript
constructor(config: TikTokConfig) {
  this.accessToken = config.access_token || '';
  this.client = new HttpClient();
  this.graphVersion = config.graph_version || DEFAULT_GRAPH_VERSION;
}
```

**Razão:** Ao inicializar diretamente no construtor, o TypeScript consegue garantir que a propriedade está definida. O método `setAccessToken()` ainda existe e pode ser usado para alterar o token posteriormente.

### 2. Correção em `Request.ts`

**Arquivo:** `src/lib/tiktok/request/Request.ts`

**Alteração realizada:**
- Adicionada inicialização da propriedade `url` no construtor antes de chamar `setUrl()`.

**Antes:**
```typescript
constructor(
  method: string,
  endpoint: string = '',
  params: Record<string, any> = {},
  graphVersion: string = '',
  accessToken: string = ''
) {
  this.method = method.toUpperCase();
  this.endpoint = endpoint;
  this.params = params;
  this.accessToken = accessToken;
  this.headers = {};
  this.setUrl(graphVersion);
}
```

**Depois:**
```typescript
constructor(
  method: string,
  endpoint: string = '',
  params: Record<string, any> = {},
  graphVersion: string = '',
  accessToken: string = ''
) {
  this.method = method.toUpperCase();
  this.endpoint = endpoint;
  this.params = params;
  this.accessToken = accessToken;
  this.headers = {};
  this.url = ''; // Inicializado aqui, será definido por setUrl abaixo
  this.setUrl(graphVersion);
}
```

**Razão:** Mesmo que `setUrl()` seja chamado imediatamente após, o TypeScript precisa ver a inicialização explícita da propriedade. A string vazia serve como valor temporário que será substituído pelo valor correto em `setUrl()`.

## Arquivos Modificados

1. **`src/lib/tiktok/TikTok.ts`**
   - Função: Classe principal para comunicação com a API do TikTok
   - Alteração: Inicialização direta de `accessToken` no construtor

2. **`src/lib/tiktok/request/Request.ts`**
   - Função: Classe responsável por configurar requisições à API do TikTok
   - Alteração: Inicialização de `url` no construtor

## Resultado

Após as correções, o build do projeto compila com sucesso sem erros de TypeScript. As propriedades estão agora em conformidade com as regras do modo strict do TypeScript.

## Observações

- As alterações mantêm a funcionalidade existente
- Os métodos `setAccessToken()` e `setUrl()` continuam disponíveis para uso posterior
- A inicialização garante que as propriedades nunca sejam `undefined` ao serem acessadas
- O código continua seguindo as melhores práticas do TypeScript em modo strict

## Próximos Passos (se necessário)

- Monitorar se há outros erros similares em outros arquivos do projeto
- Considerar adicionar testes unitários para garantir que as inicializações funcionam corretamente
- Revisar outras classes do projeto para garantir conformidade com o modo strict

