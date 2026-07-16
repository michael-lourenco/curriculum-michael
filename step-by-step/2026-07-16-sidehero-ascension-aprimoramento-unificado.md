# Step-by-step — Ascensão usa Aprimoramento unificado

**Data:** 16 jul 2026  
**Projeto:** Side Hero (cbh) + wiki (curriculum-michael)

## Objetivo

Eliminar o pool separado de pontos de evolução. A ascensão só libera skills (e no futuro passivas) do caminho, e concede pontos no saldo único de **Aprimoramento**. Skills de evolução gastam esse mesmo saldo até rank 3.

## Alterações no domínio (cbh)

| Arquivo | Função |
|---------|--------|
| `HeroProgression.ts` | `ascend` soma em `unspentImprovementPoints`; spend/refund de skills de evolução usam Aprimoramento |
| `SkillService.ts` | `canAllocateAscension` / `allocateAscension` checam e gastam Aprimoramento |
| `SkillCatalog.ts` | `maxRank` das skills `pointType: 'ascension'` → 3 |
| `ImprovementResetService.ts` | Refund unitário e massa devolvem tudo a `unspentImprovementPoints` |
| `GameStateMigration.ts` | Soma `unspentAscensionPoints` legado em Aprimoramento e zera o campo antigo |

## UI

| Arquivo | Função |
|---------|--------|
| `HeroImprovementPointsPresentation.ts` | Remove chip "Evolução"; tooltip do Aprimoramento unificado |
| `HeroSkillsTabRenderer.ts` | Label "Aprimoramento" também nas skills de evolução |
| `AscendClassConfirmPresentation.ts` / `HeroClassAscensionPresentation.ts` | Textos `+N pts de aprimoramento` / `+N Aprim.` |
| `ImprovementResetConfirm*` / `HeroDetailFlow` | Prévia e toast com um único total de Aprimoramento |

## Specs / skill / wiki

- `specs/skills-progression.spec.md`, `specs/improvement-reset.spec.md`
- `.cursor/skills/skills-progression/SKILL.md`
- Wiki: Heroes, Skills, Overview, Items, `wiki-data` (regras de reset)

## Testes atualizados (não executados pelo agente)

- `ClassAscensionService.test.ts`, `SkillService.ascension.test.ts`
- `ImprovementResetService.test.ts`, `GameStateMigration.test.ts`
- Apresentações de pontos, confirmação de ascensão e reset em massa
