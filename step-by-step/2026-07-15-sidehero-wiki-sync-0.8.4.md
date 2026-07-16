# Wiki Side Hero — sync com extensão v0.8.4

Data: 2026-07-15

## Objetivo

Atualizar `curriculum-michael/src/app/sidehero/wiki` para refletir o estado real do jogo em `/devTestes/cbh` (extensão v0.8.4), alinhado a https://www.michaellourenco.com/sidehero/wiki.

## Principais correções

| Tema | Antes (wiki) | Agora |
|------|--------------|--------|
| Versão | 0.6.1 · jun/2025 | **0.8.4** · 15 jul 2026 |
| Poder de skill | Aditivo + implícito antigo | **Base × (PPR×nível) × (attr×fator)**; piso físico 1,35 |
| DOT | Só escala de tier | Escala + **pipeline de mitigação** |
| Mapas 1–2 | Estrenda / Gondonor | **Stendra / Gruftall** |
| Campanha | “Campanha do Aprendiz” | **Ascensão de Nix** (+ release base 4 mapas) |
| Paladino | Seraphine | **Valerius** |
| Unlock heróis | Ouro/fase fixos | Melhorias da árvore (1000 / 2500) |
| Stats herói | Bases baixas; +2/+2/+10 | Bases atuais; getters ×4/×3/×15; level-up +3/+3/+15 |
| Loja | 3 ofertas fixas | **8 ofertas** procedurais |
| Itens | Fórmula stage antiga | `gearPrimaryStatBase` + escala por itemLevel |
| Novos sistemas | — | Forja Divina, stash, achievements, Status com tooltips |
| Skills | Sem gelo | Estilhaço Gélido + Nevasca; fórmulas multiplicativas |

## Arquivos tocados

- `wiki-data.ts`
- `sections/OverviewSection.tsx`
- `sections/CombatSection.tsx`
- `sections/SkillsSection.tsx`
- `sections/HeroesSection.tsx`
- `sections/ItemsSection.tsx`
- `sections/CampaignSection.tsx`
- `page.tsx` (rodapé © 2026)
