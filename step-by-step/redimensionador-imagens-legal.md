# Redimensionador de Imagens — páginas legais (Chrome Web Store)

**Data:** 2026-07-07  
**Objetivo:** Publicar Privacy Policy e Terms na Chrome Web Store da extensão **Redimensionador de Imagens**.

**Fonte do produto:** `/home/michael/devTestes/redimensionador-imagens/extension` (manifest v0.1.1)

## Rotas Next.js

| Caminho | URL | Função |
|---------|-----|--------|
| `src/app/redimensionador-imagens/privacy/page.tsx` | `/redimensionador-imagens/privacy` | Política de privacidade PT-BR: processamento local, permissão `sidePanel`, doação Stripe opcional, sem upload/analytics |
| `src/app/redimensionador-imagens/terms/page.tsx` | `/redimensionador-imagens/terms` | Termos de uso PT-BR: licença, responsabilidade sobre imagens, doações, isenções |

**Links cruzados:** privacy ↔ terms no topo e rodapé.

## URLs para a Chrome Web Store

Após deploy HTTPS:

- `https://seu-dominio.com/redimensionador-imagens/privacy`
- `https://seu-dominio.com/redimensionador-imagens/terms`

**Local:** `npm run dev` → `http://localhost:3000/redimensionador-imagens/privacy`

## Destaques alinhados à extensão

- Processamento 100% local; imagens em memória da sessão
- Permissão única: `sidePanel`
- Doação via Stripe (opcional, não bloqueia funções)
- Sem `chrome.storage`, sem analytics, sem login

## Reflexão

Mesmo padrão de `/math-rush` e `/sidehero`: rotas por produto, `page-shell`/`page-card`, tokens de tema claro/escuro. Conteúdo em português conforme idioma principal da loja (`releases/CHROME_STORE_0.1.0.md`).
