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
      <FormulaBlock>{`base = floor(gearPrimaryStatBase(itemLevel) × lootPrimaryStatScale(itemLevel) × bump)
gearPrimaryStatBase(L) = floor(6 + L×3,5 + L²×0,38)
lootPrimaryStatScale(L) = 1 + L^1,28 × 0,016

Arma:       ATK = floor(base × multRaridade)
Armadura:   DEF = floor(base × multRaridade)
Acessório:  HP  = floor(base × multRaridade × 3)`}</FormulaBlock>

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
          ['Arma', '+attack speed · +crit chance · +dano elemental/% · +CDR'],
          ['Acessório', '+cast speed · +crit chance · +crit damage · resists'],
          ['Armadura', 'Resists e defesa avançada em raridades altas'],
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

      <h3 className="text-lg font-semibold text-text-primary mb-3">Baú de itens e Forja Divina</h3>
      <p className="text-text-secondary mb-3">
        O <strong>baú</strong> (stash) guarda gear extra com capacidade definida pela árvore de
        melhorias. A <strong>Forja Divina</strong> lista itens do inventário e do baú. Após
        comprá-la, a árvore de Runas libera o{' '}
        <a href="#reset-pontos" className="text-[#e94560] hover:underline">
          Reset de pontos
        </a>{' '}
        (devolver pontos ao saldo de Aprimoramento).
      </p>
      <WikiTable
        headers={['Ação', 'Regra']}
        rows={[
          ['Fundir', '9 itens da mesma raridade → 1 da raridade seguinte (mythic não funde)'],
          ['Destruir', '1 item → ouro; lendários únicos não podem ser destruídos'],
          ['Limpar seleção', 'Botão no dock remove todos os itens selecionados de uma vez'],
        ]}
      />
      <FormulaBlock>{`ouroSalvage = floor(BASE[rarity] × (1 + floor(stage/10)×0,15))
BASE: common 10 · uncommon 25 · rare 60 · epic 150 · legendary 400 · mythic 1000`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Loja</h3>
      <p className="text-text-secondary mb-3">
        A loja oferece <strong>8 ofertas procedurais</strong> por renovação (slot, raridade e preço
        derivados da economia de referência e do progresso). Renovar consome ouro conforme o
        estágio e o limite de renovações da árvore de melhorias.
      </p>
    </WikiSection>
  );
}
