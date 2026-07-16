import Link from 'next/link';
import { Metadata } from 'next';
import { TOC_ITEMS, WIKI_LAST_UPDATED, WIKI_VERSION } from './wiki-data';
import { OverviewSection } from './sections/OverviewSection';
import { CombatSection } from './sections/CombatSection';
import { HeroesSection } from './sections/HeroesSection';
import { EnemiesSection } from './sections/EnemiesSection';
import { SkillsSection } from './sections/SkillsSection';
import { ItemsSection } from './sections/ItemsSection';
import { CampaignSection } from './sections/CampaignSection';

export const metadata: Metadata = {
  title: 'Wiki — Side Hero',
  description:
    'Wiki oficial do Side Hero — Idle RPG: heróis, inimigos, skills, combate, itens e campanha.',
};

export default function SideHeroWikiPage() {
  return (
    <div className="page-shell">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="lg:sticky lg:top-8 bg-surface rounded-lg shadow-md border border-border p-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
              Índice
            </p>
            <ul className="space-y-1">
              {TOC_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-sm text-text-muted hover:text-[#e94560] py-1 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <Link
                href="/sidehero/privacy"
                className="block text-sm text-[#e94560] hover:text-[#c73a52] underline"
              >
                Política de Privacidade
              </Link>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="page-card">
            <header className="mb-8 text-center border-b border-border pb-6">
              <p className="text-[#e94560] font-semibold text-sm uppercase tracking-wide mb-1">
                Side Hero — Idle RPG
              </p>
              <h1 className="text-4xl font-bold text-text-primary mb-2">Wiki</h1>
              <p className="text-text-muted">
                v{WIKI_VERSION} · Atualizado em {WIKI_LAST_UPDATED}
              </p>
            </header>

            <OverviewSection />
            <CombatSection />
            <HeroesSection />
            <EnemiesSection />
            <SkillsSection />
            <ItemsSection />
            <CampaignSection />

            <footer className="mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
              <p>© 2026 Michael Lourenço — Side Hero</p>
              <p className="mt-2">
                <Link
                  href="/sidehero/privacy"
                  className="text-[#e94560] hover:text-[#c73a52] underline"
                >
                  Política de Privacidade
                </Link>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
