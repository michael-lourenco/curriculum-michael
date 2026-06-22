import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import {
  CAMPAIGN_MAPS,
  GAME_STAGE_MAX_TIER,
  MILESTONES,
  STAGE_SCALING_TABLE,
  STAGE_SCALING_CURVE_MAX,
} from '../wiki-data';

function formatMultiplier(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function CampaignSection() {
  return (
    <WikiSection id="campanha" title="Campanha">
      <p className="text-text-secondary mb-4">
        A <strong>Campanha do Aprendiz</strong> percorre 10 mapas com 50 fases cada — total de{' '}
        <strong>500 fases</strong>. O tier global de dificuldade é calculado como{' '}
        <code className="text-sm bg-surface-hover px-1 rounded">
          (mapIndex − 1) × 50 + phaseNumber
        </code>
        . Exemplo: fase 3-25 = tier 125.
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Mapas</h3>
      <WikiTable
        headers={['#', 'Nome']}
        rows={CAMPAIGN_MAPS.map((m) => [m.index, m.name])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Marcos de capítulo (fases X-50)</h3>
      <WikiTable
        headers={['Fase', 'Nome do encontro', 'Boss principal']}
        rows={MILESTONES.map((m) => [m.phase, m.name, m.boss])}
      />

      <InfoCard>
        <p className="mb-2">
          Fases <strong>X-50</strong> são handcrafted com composições únicas, multiplicador de
          stats elevado (1,45–1,95) e bosses narrativos nos primeiros mapas.
        </p>
        <p>
          O <strong>finale</strong> na fase 10-50 (Trono do Vazio) enfrenta{' '}
          <strong>Vorax</strong>, o Soberano do Vazio — boss épico de tier 5.
        </p>
      </InfoCard>

      <h3 id="stage-scaling" className="text-lg font-semibold text-text-primary mb-3">
        Stage Scaling (multiplicadores de monstros)
      </h3>
      <p className="text-text-secondary mb-3 text-sm">
        Valores em centésimos (100 = ×1,0), interpolados de uma curva de referência com{' '}
        {STAGE_SCALING_CURVE_MAX} pontos distribuídos nos {GAME_STAGE_MAX_TIER} tiers da campanha.
        Tier 1 ≈ estágio 1 da curva; tier {GAME_STAGE_MAX_TIER} = estágio {STAGE_SCALING_CURVE_MAX}.
      </p>
      <WikiTable
        headers={['Tier', 'ATK %', 'HP %', 'Ouro %', 'XP %']}
        rows={STAGE_SCALING_TABLE.map((entry) => [
          String(entry.tier),
          formatMultiplier(entry.atkDmgMultiplier),
          formatMultiplier(entry.hpMultiplier),
          formatMultiplier(entry.goldMultiplier),
          formatMultiplier(entry.expMultiplier),
        ])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3 mt-8">Desbloqueio de inimigos</h3>
      <p className="text-text-secondary">
        Dentro de cada power tier, os inimigos comuns são desbloqueados progressivamente: metade
        do roster na primeira metade do mapa (fases 1–25) e o roster completo na segunda metade
        (fases 26–50). Fases intermediárias usam composições procedurais com ondas variadas.
      </p>
    </WikiSection>
  );
}
