import { WikiSection, WikiTable, FormulaBlock, InfoCard } from '../components/WikiUi';
import {
  CHEST_RARITY,
  GEAR_NAMES,
  GEAR_RARITIES,
  GEAR_SLOTS_ACTIVE,
  GEAR_SLOTS_FUTURE,
} from '../wiki-data';

export function ItemsSection() {
  return (
    <WikiSection id="itens" title="Itens e loot">
      <p className="text-text-secondary mb-4">
        O modelo de gear do Side Hero prevê <strong>10 slots canônicos</strong> definidos, com{' '}
        <strong>3 slots ativos</strong> hoje (arma → mão principal, armadura, acessório → amuleto).
        Seis raridades com multiplicadores crescentes.
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Slots ativos</h3>
      <WikiTable
        headers={['UI', 'Slot canônico']}
        rows={GEAR_SLOTS_ACTIVE.map((s) => [s.ui, s.canonical])}
      />
      <p className="text-text-muted text-sm mb-4">
        Slots futuros (desabilitados): {GEAR_SLOTS_FUTURE.join(', ')}.
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Raridades</h3>
      <WikiTable
        headers={['Raridade', 'Mult. stats']}
        rows={GEAR_RARITIES.map((r) => [r.label, r.mult])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Geração de stats primários</h3>
      <FormulaBlock>{`base = floor((2 + floor(stage/2) + statBump) × lootPrimaryStatScale(tier))
lootPrimaryStatScale = 1 + min(0,35, (tier−1)×0,003)

Arma:       ATK = floor(base × mult)
Armadura:   DEF = floor(base × mult)
Acessório:  HP  = floor(base × mult × 3)`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Resistências no loot</h3>
      <WikiTable
        headers={['Slot', 'A partir de', 'Bônus possíveis']}
        rows={[
          ['Armadura', 'Uncommon+', 'Resist. fogo, gelo ou raio (cap por raridade)'],
          ['Acessório', 'Uncommon+', 'Resist. caos (55%) ou all-elemental (45%)'],
          ['Arma', '—', 'Sem resistências'],
        ]}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Stats defensivos no loot</h3>
      <p className="text-text-secondary mb-3">
        Armaduras <strong>legendary</strong> e <strong>mythic</strong> podem rolar um bônus
        defensivo: esquiva, bloqueio ou redução de dano (2–8% conforme raridade).
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Stats secundários (chance)</h3>
      <WikiTable
        headers={['Slot', 'Bônus possíveis']}
        rows={[
          ['Arma', '+attack speed · +crit chance'],
          ['Acessório', '+cast speed · +crit chance · +crit damage'],
          ['Armadura', 'Sem stats secundários ofensivos'],
        ]}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Nomes por slot</h3>
      <WikiTable
        headers={['Slot', 'Nomes possíveis']}
        rows={[
          ['Arma', GEAR_NAMES.weapon.join(', ')],
          ['Armadura', GEAR_NAMES.armor.join(', ')],
          ['Acessório', GEAR_NAMES.accessory.join(', ')],
        ]}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Raridade por tipo de baú</h3>
      <WikiTable
        headers={['Baú', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']}
        rows={CHEST_RARITY.map((c) => [
          c.type,
          c.common,
          c.uncommon,
          c.rare,
          c.epic,
          c.legendary,
          c.mythic,
        ])}
      />

      <InfoCard>
        <p>
          Bônus de stage: até +12% de chance de raridade maior. Tooltips de gear mostram
          resistências e stats defensivos quando &gt; 0.
        </p>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Loja</h3>
      <WikiTable
        headers={['Slot', 'Raridade', 'Preço base']}
        rows={[
          ['Arma', 'Common', '25 + (stage−1)×5 ouro'],
          ['Armadura', 'Rare', '55 + (stage−1)×8 ouro'],
          ['Acessório', 'Epic', '110 + (stage−1)×12 ouro'],
        ]}
      />
      <p className="text-text-secondary">
        Renovar loja: <strong>15 + (stage−1)×5</strong> ouro.
      </p>
    </WikiSection>
  );
}
