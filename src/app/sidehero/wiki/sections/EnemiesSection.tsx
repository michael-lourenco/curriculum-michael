import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import { ENEMY_TIERS, ENEMY_COMBAT_PROFILE } from '../wiki-data';

export function EnemiesSection() {
  return (
    <WikiSection id="inimigos" title="Inimigos">
      <p className="text-text-secondary mb-4">
        A campanha possui <strong>50 inimigos</strong> organizados em 5 tiers de poder, além
        de 3 bosses narrativos únicos: <strong>Saci</strong>, <strong>Gonodor</strong> e{' '}
        <strong>Vorax</strong>. O power tier global é{' '}
        <code className="text-sm bg-surface-hover px-1 rounded">ceil(globalTier / 100)</code>,
        limitado a 1–5.
      </p>

      <WikiTable
        headers={['Tier', 'Atk Spd base', 'Crít', 'Crít Dmg']}
        rows={ENEMY_COMBAT_PROFILE.map((p) => [
          p.tier,
          p.atkSpeed,
          p.crit,
          p.critDmg,
        ])}
      />

      <InfoCard>
        <p className="mb-2">
          <strong>Subboss:</strong> atk speed ×0,92 · crit +1,5% (máx. 8%)
        </p>
        <p>
          <strong>Boss:</strong> atk speed ×0,85 · crit +2% (máx. 10%) · crit dmg +0,1
        </p>
      </InfoCard>

      {ENEMY_TIERS.map((group) => (
        <div key={group.tier} className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Tier {group.tier} — {group.label}
          </h3>
          <WikiTable
            headers={['Papel', 'Inimigos']}
            rows={[
              ['Comuns', group.commons.join(', ')],
              ['Subbosses', group.subbosses.join(', ')],
              ['Boss de tier', group.boss],
              ...(group.unique ? [['Único narrativo', group.unique] as [string, string]] : []),
            ]}
          />
        </div>
      ))}

      <h3 className="text-lg font-semibold text-text-primary mb-3">Resistências inatas</h3>
      <p className="text-text-secondary mb-4">
        Inimigos ganham resistências por <strong>tema</strong> (ex.: dragões +fogo, mortos-vivos
        +caos, elementais de gelo +cold), bônus de <strong>papel</strong> (subboss +3, boss +6 em
        cada elemental), <strong>tier de poder</strong> (+all-elemental) e{' '}
        <strong>tier global da fase</strong> (até +12 flat após fase 10). A ficha de combate
        mostra o resumo de resistências.
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Estrutura de ondas</h3>
      <WikiTable
        headers={['Regra', 'Valor']}
        rows={[
          ['Fase 1', '1 onda'],
          ['Fases normais', '2–4 ondas (cresce a cada 10 fases)'],
          ['Última onda', 'Boss wave — concede XP'],
          ['Baú de monstro', '12% ao limpar onda intermediária (só 1ª conclusão da fase)'],
          ['Baú de boss', 'A cada 3 vitórias de boss'],
        ]}
      />
    </WikiSection>
  );
}
