import { WikiSection, WikiTable, FormulaBlock, InfoCard } from '../components/WikiUi';
import { DAMAGE_ELEMENTS, STAGE_SCALING_CURVE_MAX } from '../wiki-data';

export function CombatSection() {
  return (
    <WikiSection id="combate" title="Combate e fórmulas">
      <p className="text-text-secondary mb-4">
        O combate segue timers de ação com pipeline de dano por{' '}
        <strong>elementos</strong>, resistências, armadura física e camadas defensivas
        (esquiva, bloqueio e redução de dano).
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Loop de combate</h3>
      <ol className="list-decimal pl-6 mb-4 text-text-secondary space-y-2">
        <li>Timers avançam a cada tick (1 segundo simulado).</li>
        <li>Quem tem timer ≤ 0 age; a taxa depende de Attack Speed (básico) ou recovery de cast (skills).</li>
        <li>Skills prontas são ordenadas por <code className="text-sm inline-code">usePriority</code>; Ataque Básico é fallback sem recarga.</li>
        <li>
          Ao fim do turno do ator, DOTs ativos causam dano: escala por tier e passam pelo{' '}
          <strong>mesmo pipeline de mitigação</strong> do hit (resist/DEF, esquiva, bloqueio, DR).
        </li>
      </ol>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Elementos de dano</h3>
      <WikiTable
        headers={['Elemento', 'Mitigação']}
        rows={DAMAGE_ELEMENTS.map((e) => [e.label, e.note])}
      />
      <InfoCard>
        <p>
          Skills de dano usam <code className="text-sm inline-code">damageComponents</code> — cada
          componente tem <strong>elemento</strong>, <strong>entrega</strong> (melee, projectile, aoe,
          dot) e <strong>peso</strong> (soma = 1). Veneno foi unificado em{' '}
          <strong>caos</strong>. O float de dano na UI usa a cor do elemento dominante.
        </p>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Poder de skill</h3>
      <p className="text-text-secondary mb-3 text-sm">
        Não há multiplicador global. A força relativa fica nos valores do catálogo (
        <code className="text-sm inline-code">basePower</code>,{' '}
        <code className="text-sm inline-code">powerPerRank</code>,{' '}
        <code className="text-sm inline-code">attributeFactor</code>).
      </p>
      <FormulaBlock>{`Herói (ataque básico): ATK efetivo

Herói (demais skills — cura/buff/dano):
  rankTerm = powerPerRank × nível          // nível 1 já vale powerPerRank
  attrTerm = atributo × attributeFactor
  poder    = max(1, floor(basePower × rankTerm × attrTerm))

Skills de dano físico (componente physical):
  poder = max(poder, floor(ATK_efetivo × 1,35))

Inimigo (demais skills):
  max(1, floor(basePower + stage))   // com balance próprio de inimigos`}</FormulaBlock>
      <InfoCard>
        <p>
          Exemplo: Estilhaço Gélido com <code className="text-sm inline-code">powerPerRank = 5</code>{' '}
          → nível 1 = 5, nível 2 = 10 no termo de rank. Na aba <strong>Status</strong> do herói, o
          hover em cada estatística (Poder, DPS, etc.) mostra o cálculo passo a passo.
        </p>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Pipeline de dano (por hit)</h3>
      <ol className="list-decimal pl-6 mb-4 text-text-secondary space-y-2">
        <li>Calcula poder bruto da skill.</li>
        <li>Aplica bônus elementais/físico do gear no poder de saída.</li>
        <li>Rola crítico: random &lt; critChance → poder × critDamage.</li>
        <li>
          Para cada componente: dano_parcial = poder × peso; mitiga por elemento (ver abaixo); soma
          os parciais (mín. 1).
        </li>
        <li>Camadas defensivas do alvo: esquiva → bloqueio (50% do dano) → redução %.</li>
        <li>Se a skill tem onHitDot e o hit conectou, aplica DOT elemental no alvo.</li>
      </ol>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Mitigação por componente</h3>
      <FormulaBlock>{`Físico:
  threshold = 14 × stageLevel + 12
  reduction = armor² / (armor² + threshold × (armor + 0,4 × dano))
  dano = max(1, floor(dano × (1 − min(0,75, reduction))))

Elemental (fogo, gelo, raio, caos):
  resistEfetiva = resistElemento + resistAllElemental
  se resist ≥ 0: dano × (1 − resist/100)
  se resist < 0:  dano × (1 + |resist|/100)`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Defesa avançada</h3>
      <WikiTable
        headers={['Camada', 'Mecânica', 'Limite']}
        rows={[
          ['Esquiva (dodge)', 'Chance de anular o hit inteiro', 'Máx. 50%'],
          ['Bloqueio (block)', 'Reduz dano do hit para 50%', 'Máx. 50% chance'],
          ['Redução de dano (DR)', 'Multiplica dano restante por (1 − DR)', 'Máx. 75%'],
        ]}
      />
      <FormulaBlock>{`Herói — fontes de defesa:
  dodge  += gear + DEX×0,0015 + Esquiva (2,5%/rank se equipada)
  block  += gear + Escudo de Mana (3%/rank se equipada)
  DR     += gear + Pele de Ferro (4%/rank se equipada)

Inimigo — por papel:
  subboss: dodge 2% · block 1%
  boss:    dodge 4% · block 2%`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">DOT (dano ao longo do tempo)</h3>
      <p className="text-text-secondary mb-3">
        Status <code className="text-sm inline-code">dot</code> aplica dano por turno ao fim da ação
        do combatente afetado. O tick é <strong>escalado por tier</strong> e depois processado pelo{' '}
        <strong>pipeline completo</strong> (mitigação elemental/física, esquiva, bloqueio e DR) —
        sem crítico no perfil do tick. Exemplos: Bola de Fogo, Nevasca, Cuspe Venenoso, Ácido.
      </p>
      <FormulaBlock>{`magnitudeEscalada = max(1, floor(danoBase × (1 + min(1,5, (tier−1)×0,012))))
danoDoTick = resolveOutgoingDamage(magnitudeEscalada, componente DOT, …)
  // critChance do tick = 0`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Resistências</h3>
      <p className="text-text-secondary mb-3">
        Heróis somam resistências do gear equipado (armadura: fogo/gelo/raio; acessório: caos ou
        all-elemental). Inimigos têm resistências inatas por tema (ex.: dragões +fogo, mortos-vivos
        +caos) + bônus de papel e tier.
      </p>
      <FormulaBlock>{`Bônus inato extra por tier global (fase):
  tier ≤ 10 → 0
  tier > 10 → min(12, floor((tier − 10) / 15))

Boss: +6 em cada elemental · Subboss: +3 · Tier de poder: +(tier−1)×2 all-elemental`}</FormulaBlock>
      <p className="text-text-secondary mb-4">
        A ficha de combate e tooltips exibem o resumo: <em>Resist: Fogo 12% · Caos 10% · …</em>
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Stats finais do herói</h3>
      <FormulaBlock>{`ATK = baseAttack + gearATK + (nível−1)×4 + floor(STR×0,5 + DEX×0,3)
DEF = baseDefense + gearDEF + (nível−1)×3 + floor(DEX×0,5 + STR×0,2)
HP  = baseMaxHP   + gearHP  + (nível−1)×15 + STR×2

Ao subir de nível (bases): +3 ATK · +3 DEF · +15 HP · +1 ponto de aprimoramento`}</FormulaBlock>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Escala de inimigos (Stage Scaling)</h3>
      <p className="text-text-secondary mb-3 text-sm">
        Multiplicadores por tier de fase. A curva de referência ({STAGE_SCALING_CURVE_MAX} pontos) é
        distribuída nos 500 tiers da campanha. Tabela completa na seção Campanha.
      </p>
      <FormulaBlock>{`curveStage = 1 + (tier − 1) / 499 × 169   // interpola entre pontos da curva
fator = multiplicador ÷ 100 × phaseMultiplier

ATK = floor(10 × fatorAtk × roleStat)
DEF = floor(4  × fatorAtk × roleStat)   // DEF segue ATK
HP  = floor(60 × fatorHp  × roleStat)
Ouro = floor(8  × fatorGold × roleReward × goldMultiplier)
XP (boss) = floor(15 × fatorExp × roleReward)`}</FormulaBlock>

      <WikiTable
        headers={['Papel', 'Mult. stats', 'Mult. recompensa']}
        rows={[
          ['Comum (trash)', '×1,0', '×1,0'],
          ['Elite', '×1,35', '×1,25'],
          ['Boss', '×1,75', '×1,6'],
        ]}
      />

      <InfoCard>
        <p className="mb-2">
          <strong>Loot por nível de item:</strong> stats primários usam{' '}
          <code className="text-sm inline-code">gearPrimaryStatBase(itemLevel)</code> e escala
          adicional por nível — ver seção Itens.
        </p>
        <p>
          <strong>Seleção de skill:</strong> cura só dispara abaixo do threshold de HP; maior{' '}
          <code className="text-sm inline-code">usePriority</code> vence; Ataque Básico é fallback
          sem CD.
        </p>
      </InfoCard>
    </WikiSection>
  );
}
