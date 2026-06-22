import { WikiSection, WikiTable, InfoCard } from '../components/WikiUi';
import { HERO_SKILLS, MONSTER_SKILLS } from '../wiki-data';

export function SkillsSection() {
  return (
    <WikiSection id="skills" title="Skills">
      <p className="text-text-secondary mb-4">
        Todas as skills de dano usam <strong>kind: damage</strong> com{' '}
        <code className="text-sm inline-code">damageComponents</code> (não há mais
        damage_physical / damage_magic). O poder escala com rank e atributo; inimigos usam{' '}
        <code className="text-sm inline-code">basePower + stage</code>.
      </p>

      <h3 className="text-lg font-semibold text-text-primary mb-3">Skills de herói</h3>
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
            <strong>Dano (damage):</strong> pipeline por componentes elementais + crítico + defesa
          </li>
          <li>
            <strong>Cura (heal_ally):</strong> restaura HP até o máximo
          </li>
          <li>
            <strong>Buff ATK:</strong> aumenta ATK efetivo por N turnos
          </li>
          <li>
            <strong>Debuff DEF:</strong> reduz DEF efetiva (só afeta porção física)
          </li>
          <li>
            <strong>DOT (onHitDot):</strong> aplicado ao acertar; tick no fim do turno do alvo
          </li>
        </ul>
      </InfoCard>
    </WikiSection>
  );
}
