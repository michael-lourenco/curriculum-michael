# Side Hero — Wiki atualizada (combate elemental Sprint 0–4)

**Data:** 2025-06-19  
**Fonte:** commit cbh — combate por elementos, mitigação avançada, Sprint 4  
**Doc técnica:** `cbh/step-by-step/129-combate-elementos.md`

## Alterações na wiki (`/sidehero/wiki`)

| Arquivo | O que mudou |
|---------|-------------|
| `wiki-data.ts` | Elementos, 6 raridades, slots de gear, skills com coluna de elemento, DOT, passivas defensivas, tabela de baús atualizada, HP inimigo na escala |
| `sections/CombatSection.tsx` | Pipeline completo: componentes, resist, armadura, dodge/block/DR, DOT escalado, resist inata por tier |
| `sections/SkillsSection.tsx` | `kind: damage` + `damageComponents`; tipos atualizados |
| `sections/ItemsSection.tsx` | 10 slots / 3 ativos, 6 raridades, resistências e loot defensivo legendary+ |
| `sections/HeroesSection.tsx` | Passivas Esquiva, Pele de Ferro, Escudo de Mana com efeito em combate |
| `sections/EnemiesSection.tsx` | Resistências inatas por tema/papel/tier |
| `sections/OverviewSection.tsx` | Menção a combate elemental e gear escalável |

## Mecânicas documentadas (resumo)

- **Elementos:** físico, fogo, gelo, raio, caos (veneno → caos)
- **Skills:** `damageComponents[]` com peso; removido físico/mágico legado
- **Mitigação:** físico por armadura com diminishing returns; elemental por resist %; depois dodge → block 50% → DR
- **DOT:** onHitDot + tick no fim do turno; escala por tier
- **Gear:** uncommon–mythic; resist em armor/accessory; dodge/block/DR em armor legendary+
- **Inimigos:** HP = `floor(60 × scale × roleStat)`; resist inata temática + tier

## Reflexão

A wiki agora reflete o modelo de combate pós-Sprint 4. Manter sincronia com `cbh` exige atualizar `wiki-data.ts` quando skills ou pesos de componentes mudarem no `CombatSkillRegistry`. Um script de export a partir dos testes do domínio reduziria divergência futura.
