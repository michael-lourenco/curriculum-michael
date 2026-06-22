import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import { HEROES, ASCENSIONS, DEFENSIVE_PASSIVES, HERO_LEVEL_XP_TABLE, HERO_MAX_LEVEL } from '../wiki-data';

function formatXp(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function HeroesSection() {
  return (
    <WikiSection id="herois" title="Heróis">
      <p className="text-text-secondary mb-4">
        Stats abaixo referem-se ao <strong>nível 1</strong>, sem equipamento. Ao subir de
        nível: +2 ATK base, +2 DEF base, +10 HP base, cura total e +1 ponto de
        aprimoramento. A XP por nível segue a tabela oficial do jogo (nível máximo{' '}
        {HERO_MAX_LEVEL}).
      </p>

      <WikiTable
        headers={[
          'Herói',
          'Classe',
          'ATK',
          'DEF',
          'HP',
          'STR',
          'DEX',
          'INT',
          'Atk Spd',
          'Crít',
        ]}
        rows={HEROES.map((h) => [
          `${h.emoji} ${h.name}`,
          h.class,
          h.atk,
          h.def,
          h.hp,
          h.str,
          h.dex,
          h.int,
          h.atkSpeed,
          `${h.crit} ${h.critDmg}`,
        ])}
      />

      <h3 id="xp-niveis" className="text-lg font-semibold text-text-primary mb-3 mt-8">
        Experiência por nível
      </h3>
      <p className="text-text-secondary mb-3 text-sm">
        Valor necessário para subir do nível indicado para o próximo. Nível 1 exige{' '}
        {formatXp(HERO_LEVEL_XP_TABLE[0].expForLevelUp)} XP para alcançar o nível 2.
      </p>
      <WikiTable
        headers={['Nível', 'XP para subir']}
        rows={HERO_LEVEL_XP_TABLE.map((entry) => [
          String(entry.level),
          formatXp(entry.expForLevelUp),
        ])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3 mt-8">Party e desbloqueio</h3>
      <InfoCard>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Iniciais:</strong> Galneon, Nix e Elara — party de até 3 heróis ativos
          </li>
          <li>
            <strong>Ragnar (Berserker):</strong> 150 ouro · fase ≥3 · 8 vitórias
          </li>
          <li>
            <strong>Seraphine (Paladino):</strong> 200 ouro · fase ≥4 · herói nível ≥5
          </li>
          <li>
            <strong>Reserva:</strong> heróis fora da party ganham 50% do XP de bosses
          </li>
        </ul>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Skills e slots de batalha</h3>
      <WikiTable
        headers={['Recurso', 'Detalhe']}
        rows={[
          ['Slots ativos', '1 base → 2 (upgrade, herói nv.3) → 3 (upgrade, herói nv.6)'],
          ['Ataque Básico', 'Sempre equipado; não pode ser desativado'],
          ['Custo de ativação', '25 + (rank−1)×10 ouro por skill (anti-swap)'],
          ['Passivas defensivas', 'Esquiva, Pele de Ferro e Escudo de Mana — efeito em combate se equipadas'],
          ['Berserker / Paladino', 'Stats e combate definidos; árvore de skills de classe ainda em desenvolvimento'],
        ]}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Passivas defensivas</h3>
      <WikiTable
        headers={['Skill', 'Efeito (por rank, se equipada)', 'Classe']}
        rows={DEFENSIVE_PASSIVES.map((p) => [p.name, p.effect, p.req])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Ascensão (nível 10+, irreversível)</h3>
      <p className="text-text-secondary mb-3">
        Concede +2 pontos de ascensão para skills exclusivas. Requisito base: nível 10.
      </p>
      <WikiTable
        headers={['Classe', 'Especializações']}
        rows={ASCENSIONS.map((a) => [a.class, a.options.join(' · ')])}
      />
    </WikiSection>
  );
}
