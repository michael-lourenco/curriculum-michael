# Wiki Side Hero — Reset de pontos

Data: 2026-07-16

## Objetivo

Documentar na wiki (`/sidehero/wiki`) o sistema de **Reset de pontos** (árvore de Runas): unitário, em massa e limites (não desfaz a classe).

> **Atualização 16 jul 2026:** skills de evolução também devolvem ao saldo único de **Aprimoramento** (sem pool Evolução). Ver `2026-07-16-sidehero-wiki-ascension-aprimoramento.md`.

## Alterações

| Arquivo | Mudança |
|---------|---------|
| `wiki-data.ts` | `WIKI_LAST_UPDATED` → 16 jul 2026; `IMPROVEMENT_RESET_NODES` / `IMPROVEMENT_RESET_RULES`; TOC `#reset-pontos` |
| `OverviewSection.tsx` | Linha na tabela de funcionalidades + upgrades |
| `HeroesSection.tsx` | Seção completa Reset de pontos; ascensão aponta para respec de skills |
| `SkillsSection.tsx` | Bloco “Pontos e respec” |
| `ItemsSection.tsx` | Forja Divina como pré-requisito do reset |

## Conteúdo coberto

- Nós I (5.000 / herói 12+) e II (10.000 / herói 22+)
- (−) unitário vs reset em massa com prévia
- Devolve attrs + skills de classe e de evolução → **Aprimoramento**
- Não desfaz `ascensionId`; respeita pisos de ascensão/itens/pré-requisitos
