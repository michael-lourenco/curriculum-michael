# Dark / Light mode — projeto inteiro

**Data:** 2025-06-07  
**Objetivo:** Fazer os modos claro e escuro funcionarem em todas as rotas do site Next.js.

## Problema identificado

- `ThemeProvider` e `ThemeToggle` mantinham estado duplicado (toggle não sincronizava com o contexto).
- Várias páginas (`privacy`, `terms`, `math-rush/*`, `sidehero/*`, `tiktok/*`) usavam classes Tailwind fixas (`bg-white`, `text-gray-*`) sem tokens semânticos.
- Flash de tema incorreto no carregamento (FOUC) por falta de script inline no `<html>`.

## Alterações

| Arquivo | Função |
|---------|--------|
| `src/app/layout.tsx` | Script inline aplica tema do `localStorage` antes da hidratação |
| `src/contexts/ThemeContext.tsx` | Fonte única de verdade; removido `visibility: hidden` que bloqueava a UI |
| `src/components/ThemeToggle.tsx` | Usa `useTheme()` do contexto |
| `src/components/ThemeSelectionScreen.tsx` | Usa `setTheme()` do contexto na primeira visita |
| `src/app/globals.css` | Classes `.page-shell`, `.page-card`, `.formula-block`, `.alert-*`, `.json-pre`, `.inline-code`, vars `--code-block-*` |
| `src/app/**` (todas as páginas) | Substituição de cores fixas por tokens (`text-text-primary`, `bg-surface`, `page-shell`, etc.) |
| `src/app/sidehero/wiki/components/WikiUi.tsx` | Tabelas e cards com tokens semânticos |

## Como usar

- Toggle na **Navigation** (desktop e mobile) em qualquer rota.
- Primeira visita à home: tela de escolha claro/escuro (persiste em `localStorage`).
- Preferência salva em `localStorage.theme`; fallback: `prefers-color-scheme`.

## Reflexão

Centralizar tema no `ThemeContext` + tokens CSS (`--background`, `--surface`, `--text-primary`) escala melhor que `dark:` em cada componente. Classes utilitárias `.page-shell` / `.page-card` reduzem duplicação entre páginas legais. Próximo passo ideal: extrair `ContentPageLayout` como componente React e, se necessário, `@tailwindcss/typography` com variantes dark para blocos `prose`.
