# Side Hero — Stage Scaling

## Adaptação 500 fases

- Curva de referência: 170 pontos de escala
- Side Hero: tier global 1–500 (`(mapIndex − 1) × 50 + phaseNumber`)
- Curva distribuída linearmente: tier 500 = estágio 170 da curva

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `wiki/stage-scaling-data.ts` | `STAGE_SCALING_TABLE` (500 linhas) |
| `wiki/sections/CampaignSection.tsx` | Tabela na wiki |
| `wiki/sections/CombatSection.tsx` | Fórmulas de spawn |

Espelha `cbh/src/domain/progression/StageScalingCatalog.ts`.
