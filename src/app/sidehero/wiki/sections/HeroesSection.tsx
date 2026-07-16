import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import {
  HEROES,
  ASCENSIONS,
  DEFENSIVE_PASSIVES,
  HERO_LEVEL_XP_TABLE,
  HERO_MAX_LEVEL,
  IMPROVEMENT_RESET_NODES,
  IMPROVEMENT_RESET_RULES,
} from '../wiki-data';

function formatXp(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function HeroesSection() {
  return (
    <WikiSection id="herois" title="Heróis">
      <p className="text-text-secondary mb-4">
        Stats abaixo referem-se ao <strong>nível 1</strong>, bases de classe,{' '}
        <strong>sem equipamento</strong> (ATK/DEF/HP finais ainda somam atributos e bônus de
        nível). Ao subir de nível: +3 ATK base, +3 DEF base, +15 HP base, cura total e +1 ponto de
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
            <strong>Ragnar (Berserker):</strong> melhoria na árvore (1000 ouro) após Auto-batalha
            2×
          </li>
          <li>
            <strong>Valerius (Paladino):</strong> melhoria na árvore (2500 ouro) após desbloquear
            o Berserker
          </li>
          <li>
            <strong>Reserva:</strong> heróis fora da party ganham 50% do XP de bosses
          </li>
          <li>
            <strong>Aba Status:</strong> ficha ofensiva/defensiva/resistências, skills de batalha
            com tooltips de fórmula e efeitos do equipamento
          </li>
        </ul>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Skills e slots de batalha</h3>
      <WikiTable
        headers={['Recurso', 'Detalhe']}
        rows={[
          ['Slots ativos', '1 base → 2 (upgrade, herói nv.3) → 3 (upgrade, herói nv.6)'],
          ['Ataque Básico', 'Sempre equipado; não pode ser desativado'],
          [
            'Aprimoramento',
            'Saldo único: +1 por nível; atributos, skills de classe e de evolução gastam o mesmo ponto',
          ],
          ['Custo de ativação', '25 + (rank−1)×10 ouro por skill (anti-swap)'],
          [
            'Passivas defensivas',
            'Esquiva, Pele de Ferro e Escudo de Mana — efeito em combate se equipadas',
          ],
          [
            'Berserker / Paladino',
            'Stats e combate definidos; árvore de skills de classe ainda em desenvolvimento',
          ],
        ]}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Passivas defensivas</h3>
      <WikiTable
        headers={['Skill', 'Efeito (por rank, se equipada)', 'Classe']}
        rows={DEFENSIVE_PASSIVES.map((p) => [p.name, p.effect, p.req])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">
        Ascensão (nível 10+, irreversível)
      </h3>
      <p className="text-text-secondary mb-3">
        Libera skills exclusivas do caminho e concede +2 (ou mais, conforme o tier) pontos de{' '}
        <strong>Aprimoramento</strong> no mesmo saldo do herói — não há pontos de evolução
        separados. Skills de evolução sobem até rank 3 com esse saldo. A{' '}
        <strong>escolha de classe/caminho não pode ser desfeita</strong>, mas os pontos gastos
        nas skills podem ser devolvidos com o{' '}
        <a href="#reset-pontos" className="text-[#e94560] hover:underline">
          Reset de pontos
        </a>
        .
      </p>
      <WikiTable
        headers={['Classe', 'Especializações']}
        rows={ASCENSIONS.map((a) => [a.class, a.options.join(' · ')])}
      />

      <h3 id="reset-pontos" className="text-lg font-semibold text-text-primary mb-3 mt-8">
        Reset de pontos (árvore de Runas)
      </h3>
      <p className="text-text-secondary mb-3">
        Desbloqueado após a <strong>Forja Divina</strong>. Permite devolver pontos já gastos em
        atributos e skills (classe e evolução) para o saldo único de{' '}
        <strong>Aprimoramento</strong> — ponto a ponto ou em massa.
      </p>
      <WikiTable
        headers={['Nível', 'Nó', 'Custo', 'Pré-requisitos', 'Desbloqueia']}
        rows={IMPROVEMENT_RESET_NODES.map((n) => [
          n.level,
          n.name,
          n.cost,
          `${n.parents} · ${n.heroLevel}`,
          n.unlocks,
        ])}
      />
      <InfoCard>
        <ul className="list-disc pl-5 space-y-2">
          {IMPROVEMENT_RESET_RULES.map((rule) => (
            <li key={rule.title}>
              <strong>{rule.title}:</strong> {rule.body}
            </li>
          ))}
        </ul>
      </InfoCard>
    </WikiSection>
  );
}
