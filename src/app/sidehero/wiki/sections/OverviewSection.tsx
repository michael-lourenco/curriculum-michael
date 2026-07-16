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
              <strong>Campanha:</strong> Ascensão de Nix — 10 mapas × 50 fases (500 tiers). Release
              base libera os 4 primeiros mapas (Stendra → Morthaven).
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
            ['Campanha', 'Mapa-mundo + região; ondas por fase; marcos handcrafted em X-50'],
            [
              'Heróis',
              'XP, níveis, STR/DEX/INT, Aprimoramento único (classe + evolução), ascensões e aba Status',
            ],
            ['Equipamento', '3 slots ativos; 6 raridades; resistências, defesa e bônus ofensivos no loot'],
            ['Combate elemental', 'Skills multi-elemento, DOT mitigado, float colorido, resists na ficha'],
            ['Baús', 'Loot procedural de monstros, bosses e bosses de capítulo'],
            ['Loja', '8 ofertas procedurais por renovação (economia de referência + raridade)'],
            ['Baú de itens', 'Stash com capacidade por melhoria; inventário ↔ baú'],
            ['Forja Divina', 'Fundir 9 itens da mesma raridade → 1 superior; destruir por ouro; limpar seleção'],
            [
              'Reset de pontos',
              'Árvore de Runas (após Forja): devolver Aprimoramento (atributos + skills de classe/evolução) — unitário (−) ou em massa — sem desfazer a classe',
            ],
            ['Achievements', 'Progresso persistente separado do save de campanha; first clear 1-1'],
            ['Upgrades', 'Árvore de melhorias: auto-batalha, baús, stash, forja, reset de pontos, desbloqueio de heróis'],
            ['Repetição', 'Fases já cleared: 50% ouro, 75% XP; baús só na 1ª conclusão'],
          ]}
        />
      </WikiSection>
    </>
  );
}
