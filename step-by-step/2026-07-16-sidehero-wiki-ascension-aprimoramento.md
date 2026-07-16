# Wiki Side Hero — Aprimoramento unificado na ascensão

Data: 2026-07-16  
Rota: `/sidehero/wiki` (`src/app/sidehero/wiki`)

## Objetivo

Alinhar a wiki ao jogo: ascensão **não** cria pool de Evolução; concede Aprimoramento e libera skills do caminho (rank até 3 no mesmo saldo).

## Arquivos

| Arquivo | Função |
|---------|--------|
| `wiki-data.ts` | Regras/nós do reset — tudo volta a Aprimoramento; sem pool Evolução |
| `sections/OverviewSection.tsx` | Funcionalidades: heróis + reset com saldo único |
| `sections/HeroesSection.tsx` | Tabela Aprimoramento; texto de ascensão; seção reset |
| `sections/SkillsSection.tsx` | Bloco “Pontos e respec” — classe e evolução no mesmo saldo |
| `sections/ItemsSection.tsx` | Forja → Reset devolve a Aprimoramento |

## Conteúdo coberto

- +1 Aprimoramento por nível; ascensão soma `pointsGranted` no mesmo saldo
- Skills de evolução até rank 3 com Aprimoramento
- Reset unitário/massa devolve attrs + skills (classe e evolução) para Aprimoramento
- Ascensão de classe permanece irreversível
