# Limitações do Sandbox TikTok e Processo de Aprovação de Escopos

## Data: 2025-01-27

## Problema Identificado

Ao autenticar com o TikTok usando o ambiente **Sandbox**, os escopos `video.upload` e `video.publish` podem não ser retornados na resposta do token, mesmo que:

- ✅ O produto "Content Posting API" esteja adicionado ao app
- ✅ Os escopos estejam marcados como "aprovados" no painel
- ✅ A solicitação de autorização inclua os escopos corretamente

## Limitações Conhecidas do Sandbox

### 1. Escopos de Upload/Publish

**Problema:**
O ambiente Sandbox do TikTok pode não retornar os escopos `video.upload` e `video.publish` na resposta do token, mesmo que estejam configurados e aprovados no painel.

**Possíveis Causas:**
- O Sandbox tem limitações intencionais para proteger contra uso indevido
- Alguns escopos requerem auditoria completa antes de serem ativados
- O Sandbox pode retornar apenas escopos básicos (`user.info.basic`, `user.info.profile`)

### 2. Funcionalidades Restritas

No ambiente Sandbox:
- ✅ Autenticação OAuth funciona normalmente
- ✅ Leitura de informações do usuário funciona
- ✅ Listagem de vídeos pode funcionar
- ❌ Upload de vídeos pode não funcionar (depende dos escopos)
- ❌ Publicação direta pode não funcionar (depende dos escopos)

## Como Diagnosticar o Problema

### 1. Verificar Logs do Servidor

Após autenticar, verifique os logs do servidor. Você verá:

```
=== TOKEN RESPONSE DEBUG ===
Full token response: {...}
Token data details: {
  scope: "user.info.basic,user.info.profile" // Escopos retornados
  ...
}
```

### 2. Usar Endpoint de Diagnóstico

Acesse: `/tiktok/api/auth/debug`

Este endpoint mostra:
- Escopos retornados pelo TikTok
- Escopos esperados vs. retornados
- Análise de escopos faltantes
- Recomendações específicas

### 3. Verificar Página de Sucesso

Após autenticação, a página `/tiktok/auth/success` mostra:
- Todos os escopos retornados
- Alertas se escopos de upload/publish estão faltando
- Links para ferramentas de diagnóstico

### 4. Verificar Cookie de Escopos

O cookie `tiktok_scopes` contém os escopos retornados. Você pode inspecioná-lo no navegador.

## Soluções e Próximos Passos

### Opção 1: Verificar Configuração no Painel

1. Acesse [TikTok for Developers](https://developers.tiktok.com/)
2. Vá para "Manage Apps" → Seu App
3. Verifique se:
   - ✅ Produto "Content Posting API" está adicionado
   - ✅ Escopos `video.upload` e `video.publish` estão habilitados
   - ✅ Status do app está correto (Sandbox/Production)

### Opção 2: Solicitar Auditoria para Produção

Se os escopos não funcionam no Sandbox:

1. **Preparar para Auditoria:**
   - Garantir que todos os termos de serviço e políticas de privacidade estão configurados
   - Preencher todas as informações obrigatórias do app
   - Ter uma descrição clara do uso dos escopos

2. **Solicitar Migração para Produção:**
   - No painel, solicite a migração do app de Sandbox para Produção
   - Aguarde aprovação do TikTok (pode levar alguns dias)
   - Após aprovação, os escopos devem funcionar normalmente

3. **Testar em Produção:**
   - Use as credenciais de produção
   - Teste a autenticação novamente
   - Verifique se os escopos são retornados

### Opção 3: Usar Escopos Alternativos (Temporário)

Se você precisa testar upload enquanto aguarda aprovação:

- Use o modo "Draft" da API de postagem (pode ter menos restrições)
- Teste com escopos básicos primeiro
- Documente o comportamento para referência futura

## Estrutura da Resposta do Token

### Resposta Esperada (com escopos)

```json
{
  "data": {
    "access_token": "act.xxx...",
    "scope": "user.info.basic,user.info.profile,video.upload,video.publish",
    "expires_in": 3600,
    "token_type": "Bearer",
    "refresh_token": "xxx..."
  }
}
```

### Resposta no Sandbox (sem escopos de upload)

```json
{
  "data": {
    "access_token": "act.xxx...",
    "scope": "user.info.basic,user.info.profile",
    "expires_in": 3600,
    "token_type": "Bearer",
    "refresh_token": "xxx..."
  }
}
```

**Nota:** O campo `scope` pode estar ausente ou conter apenas escopos básicos.

## Ferramentas de Diagnóstico Implementadas

### 1. Logs Detalhados

O callback (`/tiktok/api/auth/callback`) agora registra:
- Resposta completa do token
- Estrutura da resposta
- Escopos retornados
- Análise detalhada dos escopos

### 2. Endpoint de Debug

Endpoint: `/tiktok/api/auth/debug`

Retorna:
- Informações completas do token
- Comparação de escopos esperados vs. retornados
- Recomendações específicas baseadas no estado atual

### 3. Página de Sucesso Melhorada

A página `/tiktok/auth/success` agora:
- Exibe todos os escopos retornados
- Destaca escopos de upload/publish
- Alerta quando escopos esperados estão faltando
- Fornece links para ferramentas de diagnóstico

### 4. Cookie de Escopos

Os escopos são salvos em um cookie separado (`tiktok_scopes`) para:
- Referência futura sem nova autenticação
- Diagnóstico via JavaScript (se necessário)
- Comparação com escopos esperados

## Checklist de Verificação

Use este checklist para diagnosticar problemas com escopos:

- [ ] Verificar se o produto "Content Posting API" está adicionado
- [ ] Verificar se os escopos estão habilitados no painel
- [ ] Verificar logs do servidor durante autenticação
- [ ] Usar endpoint `/tiktok/api/auth/debug` para análise
- [ ] Verificar página de sucesso após autenticação
- [ ] Verificar cookie `tiktok_scopes` no navegador
- [ ] Comparar escopos solicitados vs. retornados
- [ ] Verificar se está usando ambiente Sandbox ou Produção
- [ ] Verificar se há pendências de auditoria no painel

## Referências

- [TikTok Content Posting API - Get Started](https://developers.tiktok.com/doc/content-posting-api-get-started)
- [TikTok Login Kit for Web](https://developers.tiktok.com/doc/login-kit-web)
- [TikTok for Developers Dashboard](https://developers.tiktok.com/apps)

## Notas Importantes

1. **Sandbox vs. Produção:**
   - O Sandbox é limitado por design
   - Alguns escopos podem não funcionar até migração para produção
   - A auditoria é necessária para escopos sensíveis como upload

2. **Tempo de Aprovação:**
   - A aprovação para produção pode levar dias ou semanas
   - O TikTok revisa cuidadosamente apps que solicitam escopos de upload
   - Garanta que todos os requisitos estão atendidos antes de solicitar

3. **Alternativas Temporárias:**
   - Use o modo Draft para testar upload
   - Teste com escopos básicos primeiro
   - Documente o comportamento para referência

## Próximas Ações Recomendadas

1. **Imediato:**
   - Execute uma nova autenticação e verifique os logs
   - Use o endpoint de diagnóstico para análise completa
   - Documente os escopos retornados

2. **Curto Prazo:**
   - Verifique configuração completa no painel do TikTok
   - Entre em contato com suporte do TikTok se necessário
   - Prepare documentação para auditoria de produção

3. **Longo Prazo:**
   - Solicite migração para produção se necessário
   - Implemente tratamento de erros para escopos faltantes
   - Crie testes automatizados para validar escopos

