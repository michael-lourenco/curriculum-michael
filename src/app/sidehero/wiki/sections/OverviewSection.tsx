import { WikiSection, WikiTable, FormulaBlock, InfoCard } from '../components/WikiUi';
import { WIKI_VERSION } from '../wiki-data';

export function OverviewSection() {
  return (
    <>
      <WikiSection id="visao-geral" title="Visão geral">
        <p className="text-text-secondary mb-4">
          <strong>Side Hero — Idle RPG</strong> (v{WIKI_VERSION}) é uma extensão para Google
          Chrome que transforma o painel lateral do navegador em um RPG idle. Seus heróis
          batalham automaticamente enquanto você navega normalmente — sem interromper sua
          rotina.
        </p>
        <p className="text-text-secondary mb-4">
          O combate usa timers de ação com pipeline de dano por{' '}
          <strong>elementos de dano</strong> (físico, fogo, gelo, raio, caos), resistências,
          mitigação por armadura e camadas defensivas (esquiva, bloqueio, redução de dano).
        </p>
        <InfoCard>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Party inicial:</strong> Galneon (Cavaleiro), Nix (Feiticeiro) e Elara
              (Sacerdotisa)
            </li>
            <li>
              <strong>Party ativa:</strong> até 3 heróis; reserva ganha 50% do XP de bosses
            </li>
            <li>
              <strong>Campanha:</strong> 10 mapas × 50 fases = 500 fases na Campanha do
              Aprendiz
            </li>
            <li>
              <strong>Progresso:</strong> salvo localmente no navegador (
              <code className="text-sm bg-surface-hover px-1 rounded">chrome.storage.local</code>)
            </li>
          </ul>
        </InfoCard>
      </WikiSection>

      <WikiSection id="funcionalidades" title="Funcionalidades">
        <WikiTable
          headers={['Sistema', 'Descrição']}
          rows={[
            ['Combate idle', 'Batalhas contínuas por timers de ação; avança em segundo plano com upgrade'],
            ['Campanha', 'Ondas de inimigos por fase; marcos especiais a cada X-50 de cada mapa'],
            ['Heróis', 'XP, níveis, atributos (STR/DEX/INT), árvore de skills e ascensão no nv. 10+'],
            ['Equipamento', '3 slots ativos (arma, armadura, acessório); 6 raridades; resistências e defesa no loot'],
            ['Combate elemental', 'Skills multi-elemento, DOT, float colorido, resistências na ficha'],
            ['Baús', 'Loot procedural de monstros, bosses e bosses de capítulo'],
            ['Loja', '3 ofertas fixas (arma comum, armadura rara, acessório épico) com renovação'],
            ['Upgrades', 'Árvore de melhorias: auto-batalha 2x/3x, auto-abrir baús, auto-equipar, stash'],
            ['Repetição', 'Fases já cleared: 50% ouro, 75% XP; baús só na 1ª conclusão'],
          ]}
        />
      </WikiSection>
    </>
  );
}
