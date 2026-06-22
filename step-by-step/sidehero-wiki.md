# Side Hero — Wiki

**Data:** 2025-06-07  
**Objetivo:** Publicar a wiki oficial do Side Hero — Idle RPG no site Next.js, documentando mecânicas extraídas do projeto fonte `cbh` (v0.6.1).

## Fonte de dados

Análise do repositório `/home/michael/devTestes/cbh`:
- `src/domain/entities/Hero.ts` — stats base e fórmulas de ATK/DEF/HP
- `src/domain/services/combat/CombatDamageResolver.ts` — mitigação e crítico
- `src/domain/progression/combat/SkillPowerCalculator.ts` — poder de skills
- `src/domain/campaign/WaveEnemyFactory.ts` — escala de inimigos
- `src/domain/enemies/EnemyRosterCatalog.ts` — roster de 50+ inimigos
- `src/domain/progression/SkillCatalog.ts` — nomes de skills
- `src/domain/services/LootService.ts` — geração de gear
- `src/domain/campaign/CampaignMaps.ts` — mapas e marcos

## Arquivos criados

| Caminho | Função |
|---------|--------|
| `src/app/sidehero/wiki/page.tsx` | Página principal em `/sidehero/wiki` — layout, metadata SEO, índice lateral e composição das seções |
| `src/app/sidehero/wiki/wiki-data.ts` | Dados estáticos: heróis, inimigos por tier, skills, mapas, marcos, raridades de baú |
| `src/app/sidehero/wiki/components/WikiUi.tsx` | Componentes reutilizáveis: `WikiSection`, `WikiTable`, `FormulaBlock`, `InfoCard` |
| `src/app/sidehero/wiki/sections/OverviewSection.tsx` | Visão geral e funcionalidades |
| `src/app/sidehero/wiki/sections/CombatSection.tsx` | Loop de combate, fórmulas de dano, escala de inimigos |
| `src/app/sidehero/wiki/sections/HeroesSection.tsx` | Heróis, party, ascensões |
| `src/app/sidehero/wiki/sections/EnemiesSection.tsx` | Roster por tier, perfil de combate, ondas |
| `src/app/sidehero/wiki/sections/SkillsSection.tsx` | Tabelas de skills de herói e monstro |
| `src/app/sidehero/wiki/sections/ItemsSection.tsx` | Loot, gear, loja, baús |
| `src/app/sidehero/wiki/sections/CampaignSection.tsx` | Mapas, marcos X-50, finale |

## Rota

- **Local:** `http://localhost:3000/sidehero/wiki`
- **Produção:** `https://seu-dominio.com/sidehero/wiki`

## Reflexão (escalabilidade / manutenção)

A wiki foi modularizada em seções e arquivo de dados separado para facilitar atualizações quando o `cbh` evoluir (novos heróis, skills ou tiers). O ideal a médio prazo é gerar `wiki-data.ts` a partir do código-fonte do jogo (script de build) para evitar divergência entre wiki e extensão publicada. A constante `WIKI_VERSION` deve ser alinhada ao `manifest.json` da extensão a cada release.

**Próximos passos sugeridos:** (1) link cruzado na página de privacidade para a wiki; (2) script de sync automático cbh → wiki-data; (3) seção de upgrades da árvore de melhorias; (4) imagens/sprites dos heróis e bosses.
