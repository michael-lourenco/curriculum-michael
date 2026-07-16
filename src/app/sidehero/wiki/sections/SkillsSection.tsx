import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import { HERO_SKILLS, MONSTER_SKILLS } from '../wiki-data';

export function SkillsSection() {
  return (
    <WikiSection id="skills" title="Skills">
      <p className="text-text-secondary mb-4">
        Skills de dano usam <strong>kind: damage</strong> com{' '}
        <code className="text-sm inline-code">damageComponents</code>. O poder do herói é{' '}
        <strong>multiplicativo</strong>:{' '}
        <code className="text-sm inline-code">
          Base × (powerPerRank × nível) × (atributo × fator)
        </code>
        . No nível 1 o termo de rank já vale <code className="text-sm inline-code">powerPerRank</code>
        . Inimigos usam <code className="text-sm inline-code">basePower + stage</code> (com
        balance próprio).
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Skills de herói</h3>
      <p className="text-text-muted text-sm mb-3">
        CD em segundos de combate (<code className="text-sm inline-code">cooldownTurns</code> × 1s).
        Valores de Base/PPR/fator refletem o catálogo atual; skills de evolução usam a mesma
        fórmula com números próprios.
      </p>
      <WikiTable
        headers={['Skill', 'Elemento(s)', 'Alvo', 'CD', 'Fórmula / efeito', 'Obs.']}
        rows={HERO_SKILLS.map((s) => [
          s.name,
          s.element,
          s.target,
          s.cd,
          s.formula,
          s.notes ?? '—',
        ])}
      />

      <h3 className="text-lg font-semibold text-text-primary mb-3">Skills de monstros</h3>
      <WikiTable
        headers={['Skill', 'Elemento(s)', 'Alvo', 'CD', 'Base', 'Obs.']}
        rows={MONSTER_SKILLS.map((s) => [
          s.name,
          s.element,
          s.target,
          s.cd,
          s.base,
          s.notes ?? '—',
        ])}
      />

      <InfoCard>
        <p className="font-semibold mb-2">Tipos de skill</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Dano (damage):</strong> pipeline por componentes elementais + crítico + defesa;
            físicas têm piso ATK×1,35
          </li>
          <li>
            <strong>Cura (heal_ally):</strong> restaura HP até o máximo (mesma fórmula de poder,
            sem piso físico)
          </li>
          <li>
            <strong>Buff ATK:</strong> aumenta ATK efetivo por N turnos
          </li>
          <li>
            <strong>Debuff DEF:</strong> reduz DEF efetiva (só afeta porção física)
          </li>
          <li>
            <strong>DOT (onHitDot):</strong> aplicado ao acertar; tick no fim do turno do alvo com
            escala de tier + mitigação completa
          </li>
        </ul>
      </InfoCard>

      <h3 className="text-lg font-semibold text-text-primary mb-3 mt-8">Pontos e respec</h3>
      <p className="text-text-secondary mb-3">
        Skills de <strong>classe</strong> e de <strong>evolução</strong> gastam o mesmo saldo de{' '}
        <strong>Aprimoramento</strong> (1 por nível; a ascensão concede pontos extras neste
        saldo). Skills de evolução sobem até rank 3. Com o{' '}
        <a href="#reset-pontos" className="text-[#e94560] hover:underline">
          Reset de pontos
        </a>{' '}
        na árvore de Runas, os ranks podem ser devolvidos e realocados — a classe escolhida
        permanece.
      </p>
    </WikiSection>
  );
}
