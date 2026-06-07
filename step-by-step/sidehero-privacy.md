# Side Hero — Política de Privacidade (Chrome Web Store)

**Data:** 2025-06-07  
**Objetivo:** Publicar a política de privacidade da extensão **Side Hero — Idle RPG** no site Next.js, no mesmo padrão visual das páginas legais do Math Rush.

## Arquivos criados

| Caminho no projeto | Rota URL | Função |
|--------------------|----------|--------|
| `src/app/sidehero/privacy/page.tsx` | `/sidehero/privacy` | Política de privacidade em português (PT-BR), adaptada do HTML fornecido para o padrão Next.js + Tailwind do projeto. Descreve armazenamento local (`chrome.storage.local`), permissões da extensão Chrome e ausência de coleta de dados pessoais. |

## Adaptações em relação ao HTML original

- Estrutura convertida para componente React com `Metadata` do Next.js (SEO/título da aba).
- Estilos inline substituídos por classes Tailwind, alinhadas a `src/app/math-rush/privacy/page.tsx`.
- Cor de destaque `#e94560` (identidade Side Hero) aplicada em títulos de seção e links.
- Bloco de resumo (card) renderizado com `bg-gray-50 rounded-xl`.
- Constante `LAST_UPDATED` para facilitar atualizações futuras.
- Conteúdo mantido em português, conforme o documento fonte.

## Como validar

1. **Local:** `npm run dev` → abrir `http://localhost:3000/sidehero/privacy`
2. **Produção:** após deploy HTTPS, informar na Chrome Web Store, por exemplo:
   - `https://seu-dominio.com/sidehero/privacy`

## Reflexão (escalabilidade / manutenção)

A página segue o mesmo padrão de rota por produto (`/math-rush/*`, `/sidehero/*`), o que escala bem para novos apps/extensões sem alterar o layout global. Se no futuro existir Terms of Service para Side Hero, pode-se adicionar `src/app/sidehero/terms/page.tsx` e links cruzados como no Math Rush. Para reduzir duplicação entre várias políticas, um componente compartilhado (`LegalPageLayout`) com props de título, produto e cor de acento seria o próximo passo natural.

**Próximos passos sugeridos:** (1) adicionar página de termos se a Chrome Web Store exigir; (2) alinhar `LAST_UPDATED` sempre que permissões ou armazenamento mudarem no manifest da extensão; (3) versão em inglês opcional se o público da loja for internacional.
