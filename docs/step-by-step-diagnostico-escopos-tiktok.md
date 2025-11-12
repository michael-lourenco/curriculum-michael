# Step-by-Step: Diagnóstico e Melhorias para Escopos TikTok

## Data: 2025-01-27

## Objetivo

Implementar ferramentas de diagnóstico e melhorias para identificar por que os escopos `video.upload` e `video.publish` não estão sendo retornados pelo TikTok, mesmo com configuração correta no painel.

## Problema Identificado

- ✅ Código solicita escopos corretamente (`video.upload`, `video.publish`)
- ✅ Produto "Content Posting API" está adicionado
- ✅ Escopos estão aprovados no painel
- ❌ Token retorna apenas `user.info.basic` e `user.info.profile`
- ⚠️ Ambiente: Sandbox

## Alterações Implementadas

### 1. Melhorias no Callback de Autenticação

**Arquivo:** `src/app/tiktok/api/auth/callback/route.ts`

**Alterações:**

1. **Logs Detalhados da Resposta do Token:**
   - Adicionado log completo da estrutura da resposta
   - Log específico dos escopos retornados
   - Análise detalhada dos campos disponíveis

2. **Captura e Salvamento de Escopos:**
   - Extração de escopos da resposta (suporta múltiplos formatos)
   - Salvamento de escopos em cookie separado (`tiktok_scopes`)
   - Log de aviso quando nenhum escopo é retornado

3. **Tratamento Melhorado:**
   - Suporte para escopos como string ou array
   - Normalização de formato antes de salvar
   - Passagem de escopos na URL de sucesso para exibição

**Código Adicionado:**

```typescript
// Log completo da resposta
console.log('=== TOKEN RESPONSE DEBUG ===');
console.log('Full token response:', JSON.stringify(tokenResponse, null, 2));
console.log('Token data details:', {
  scope: tokenResponse.data.scope || 'NOT FOUND',
  // ... outros campos
});

// Extração e salvamento de escopos
const scopes = tokenResponse.data?.scope || (tokenResponse as any).scope || null;
if (scopes) {
  const scopesString = Array.isArray(scopes) ? scopes.join(',') : String(scopes);
  response.cookies.set('tiktok_scopes', scopesString, {
    httpOnly: false, // Permitir acesso via JavaScript
    // ... outras configurações
  });
}
```

### 2. Logs na Rota de Autorização

**Arquivo:** `src/app/tiktok/api/auth/authorize/route.ts`

**Alterações:**

1. **Normalização de Escopos:**
   - Limpeza de espaços extras
   - Remoção de escopos vazios
   - Normalização do formato antes de enviar

2. **Logs de Diagnóstico:**
   - Log dos escopos solicitados
   - Log da URL gerada
   - Verificação se a URL contém o parâmetro `scope`

**Código Adicionado:**

```typescript
// Normalização de escopos
scope = scope
  .split(',')
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .join(',');

// Logs de diagnóstico
console.log('=== AUTHORIZATION REQUEST DEBUG ===');
console.log('Scopes requested:', scope);
console.log('Generated auth URL:', authUrl);
```

### 3. Endpoint de Diagnóstico

**Arquivo:** `src/app/tiktok/api/auth/debug/route.ts` (NOVO)

**Funcionalidades:**

1. **Análise Completa do Token:**
   - Verificação de existência do token
   - Validação do formato
   - Preview do token (seguro)

2. **Análise de Escopos:**
   - Escopos do cookie vs. esperados
   - Identificação de escopos faltantes
   - Identificação de escopos extras
   - Verificação específica de `video.upload` e `video.publish`

3. **Recomendações Automáticas:**
   - Sugestões baseadas no estado atual
   - Alertas para problemas identificados
   - Próximos passos sugeridos

**Estrutura da Resposta:**

```json
{
  "success": true,
  "debug": {
    "token": { ... },
    "scopes": { ... } },
    "analysis": { ... }
  },
  "recommendations": [ ... ]
}
```

### 4. Página de Sucesso Melhorada

**Arquivo:** `src/app/tiktok/auth/success/page.tsx`

**Melhorias:**

1. **Exibição Visual dos Escopos:**
   - Lista formatada de todos os escopos retornados
   - Destaque especial para escopos de upload/publish
   - Ícones visuais para escopos importantes

2. **Alertas Inteligentes:**
   - Alerta quando escopos de upload/publish estão faltando
   - Explicação das possíveis causas
   - Sugestões de próximos passos

3. **Links para Ferramentas:**
   - Link para endpoint de diagnóstico
   - Link para página de validação
   - Acesso rápido a ferramentas úteis

**Componentes Adicionados:**

- Cards visuais para cada escopo
- Alertas condicionais baseados em escopos faltantes
- Seção de ferramentas de diagnóstico

### 5. Documentação Completa

**Arquivo:** `docs/tiktok-sandbox-limitations-scopes.md` (NOVO)

**Conteúdo:**

1. **Limitações do Sandbox:**
   - Explicação das limitações conhecidas
   - Por que alguns escopos não funcionam no Sandbox
   - Diferenças entre Sandbox e Produção

2. **Processo de Diagnóstico:**
   - Como verificar logs
   - Como usar ferramentas de diagnóstico
   - Checklist completo de verificação

3. **Soluções e Próximos Passos:**
   - Opções para resolver o problema
   - Processo de auditoria para produção
   - Alternativas temporárias

## Arquivos Modificados

1. ✅ `src/app/tiktok/api/auth/callback/route.ts` - Logs e salvamento de escopos
2. ✅ `src/app/tiktok/api/auth/authorize/route.ts` - Normalização e logs
3. ✅ `src/app/tiktok/api/auth/debug/route.ts` - **NOVO** - Endpoint de diagnóstico
4. ✅ `src/app/tiktok/auth/success/page.tsx` - Exibição melhorada
5. ✅ `docs/tiktok-sandbox-limitations-scopes.md` - **NOVO** - Documentação

## Como Usar as Novas Ferramentas

### 1. Verificar Logs Após Autenticação

Após autenticar, verifique os logs do servidor. Você verá:

```
=== AUTHORIZATION REQUEST DEBUG ===
Scopes requested: user.info.basic,user.info.profile,user.info.stats,video.upload,video.publish
Generated auth URL: https://www.tiktok.com/v2/auth/authorize/?...

=== TOKEN RESPONSE DEBUG ===
Full token response: {...}
Token data details: {
  scope: "user.info.basic,user.info.profile" // Escopos retornados
}

=== SCOPES ANALYSIS ===
Scopes returned by TikTok: user.info.basic,user.info.profile
⚠️ ATENÇÃO: Nenhum escopo retornado na resposta do token!
```

### 2. Usar Endpoint de Diagnóstico

Acesse: `GET /tiktok/api/auth/debug`

Retorna análise completa com:
- Estado do token
- Escopos retornados vs. esperados
- Recomendações específicas

### 3. Verificar Página de Sucesso

Após autenticação, a página `/tiktok/auth/success` mostra:
- ✅ Todos os escopos retornados (com destaque visual)
- ⚠️ Alertas se escopos de upload/publish estão faltando
- 🔍 Links para ferramentas de diagnóstico

### 4. Verificar Cookie de Escopos

No navegador, inspecione o cookie `tiktok_scopes`:
- Contém os escopos retornados pelo TikTok
- Formato: string separada por vírgulas
- Disponível para JavaScript (não httpOnly)

## Próximos Passos Recomendados

### Imediato

1. **Executar Nova Autenticação:**
   - Acesse `/tiktok/api/auth/authorize?scope=user.info.basic,user.info.profile,user.info.stats,video.upload,video.publish`
   - Verifique os logs do servidor
   - Use o endpoint `/tiktok/api/auth/debug` para análise

2. **Verificar Resposta do Token:**
   - Os logs mostrarão exatamente o que o TikTok retornou
   - Compare escopos solicitados vs. retornados
   - Documente o comportamento

### Curto Prazo

1. **Verificar Configuração no Painel:**
   - Confirme que todos os produtos estão adicionados
   - Verifique status de aprovação dos escopos
   - Entre em contato com suporte do TikTok se necessário

2. **Considerar Migração para Produção:**
   - Se os escopos não funcionam no Sandbox, pode ser necessário migrar para produção
   - Prepare documentação para auditoria
   - Aguarde aprovação do TikTok

### Longo Prazo

1. **Implementar Tratamento de Erros:**
   - Adicionar validação de escopos antes de tentar upload
   - Mensagens de erro claras quando escopos estão faltando
   - Fallback para funcionalidades básicas

2. **Criar Testes Automatizados:**
   - Testes para validar escopos retornados
   - Testes para verificar funcionalidades baseadas em escopos
   - Documentação de comportamento esperado

## Análise de Escalabilidade e Manutenibilidade

### Pontos Positivos

1. **Logs Detalhados:**
   - Facilita diagnóstico de problemas
   - Permite rastreamento completo do fluxo
   - Útil para debugging em produção

2. **Endpoint de Diagnóstico:**
   - Ferramenta reutilizável
   - Pode ser usado por outras partes do sistema
   - Facilita troubleshooting

3. **Documentação Completa:**
   - Referência clara para desenvolvedores
   - Explica limitações conhecidas
   - Guia de troubleshooting

### Melhorias Futuras Sugeridas

1. **Dashboard de Monitoramento:**
   - Interface visual para verificar status dos escopos
   - Histórico de autenticações
   - Alertas automáticos quando escopos estão faltando

2. **Cache de Escopos:**
   - Armazenar escopos em banco de dados
   - Permitir consulta sem nova autenticação
   - Histórico de mudanças de escopos

3. **Validação Automática:**
   - Verificar escopos antes de chamadas de API
   - Retornar erros claros quando escopos estão faltando
   - Sugerir re-autenticação quando necessário

## Conclusão

As alterações implementadas fornecem:

- ✅ **Visibilidade completa** do que o TikTok retorna
- ✅ **Ferramentas de diagnóstico** para identificar problemas
- ✅ **Documentação clara** sobre limitações e soluções
- ✅ **Interface melhorada** para visualizar escopos

Com essas ferramentas, é possível identificar exatamente por que os escopos não estão sendo retornados e tomar as ações apropriadas (verificar configuração, solicitar auditoria, ou migrar para produção).

