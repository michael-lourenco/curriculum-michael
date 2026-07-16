export const WIKI_VERSION = '0.8.4';
export const WIKI_LAST_UPDATED = '16 de julho de 2026';

export { HERO_LEVEL_XP_TABLE, HERO_MAX_LEVEL } from './hero-level-xp-data';
export {
  STAGE_SCALING_TABLE,
  GAME_STAGE_MAX_TIER,
  STAGE_SCALING_CURVE_MAX,
} from './stage-scaling-data';

export const DAMAGE_ELEMENTS = [
  { id: 'physical', label: 'Físico', note: 'Mitigado por armadura (DEF)' },
  { id: 'fire', label: 'Fogo', note: 'Resistência elemental' },
  { id: 'cold', label: 'Gelo', note: 'Resistência elemental' },
  { id: 'lightning', label: 'Raio', note: 'Resistência elemental' },
  { id: 'chaos', label: 'Caos', note: 'Veneno unificado em caos' },
] as const;

export const GEAR_RARITIES = [
  { id: 'common', label: 'Common', mult: '×1,0' },
  { id: 'uncommon', label: 'Uncommon', mult: '×1,25' },
  { id: 'rare', label: 'Rare', mult: '×1,6' },
  { id: 'epic', label: 'Epic', mult: '×2,5' },
  { id: 'legendary', label: 'Legendary', mult: '×3,5' },
  { id: 'mythic', label: 'Mythic', mult: '×5,0' },
] as const;

export const GEAR_SLOTS_ACTIVE = [
  { ui: 'Arma (weapon)', canonical: 'Mão principal (hand)' },
  { ui: 'Armadura (armor)', canonical: 'Armadura (armor)' },
  { ui: 'Acessório (accessory)', canonical: 'Amuleto (amulet)' },
] as const;

export const GEAR_SLOTS_FUTURE = [
  'Mão secundária',
  'Elmo',
  'Luvas',
  'Botas',
  'Anel esquerdo',
  'Anel direito',
  'Bracelete',
] as const;

export const TOC_ITEMS = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'funcionalidades', label: 'Funcionalidades' },
  { id: 'combate', label: 'Combate e fórmulas' },
  { id: 'herois', label: 'Heróis' },
  { id: 'reset-pontos', label: 'Reset de pontos' },
  { id: 'inimigos', label: 'Inimigos' },
  { id: 'skills', label: 'Skills' },
  { id: 'itens', label: 'Itens e loot' },
  { id: 'campanha', label: 'Campanha' },
] as const;

export const HEROES = [
  {
    name: 'Galneon',
    class: 'Cavaleiro',
    emoji: '🛡️',
    starter: true,
    atk: 26,
    def: 8,
    hp: 120,
    str: 12,
    dex: 8,
    int: 5,
    atkSpeed: 0.58,
    crit: '2,5%',
    critDmg: '×1,4',
  },
  {
    name: 'Nix',
    class: 'Feiticeiro',
    emoji: '🔮',
    starter: true,
    atk: 22,
    def: 3,
    hp: 80,
    str: 5,
    dex: 8,
    int: 12,
    atkSpeed: 0.38,
    crit: '5,0%',
    critDmg: '×1,65',
  },
  {
    name: 'Elara',
    class: 'Sacerdotisa',
    emoji: '✨',
    starter: true,
    atk: 14,
    def: 5,
    hp: 100,
    str: 6,
    dex: 7,
    int: 11,
    atkSpeed: 0.58,
    crit: '2,0%',
    critDmg: '×1,4',
  },
  {
    name: 'Ragnar',
    class: 'Berserker',
    emoji: '🪓',
    starter: false,
    unlock: 'Melhoria na árvore (1000 ouro) · pai: Auto-batalha 2×',
    atk: 24,
    def: 4,
    hp: 110,
    str: 14,
    dex: 9,
    int: 4,
    atkSpeed: 0.45,
    crit: '2,5%',
    critDmg: '×1,8',
  },
  {
    name: 'Valerius',
    class: 'Paladino',
    emoji: '⚔️',
    starter: false,
    unlock: 'Melhoria na árvore (2500 ouro) · pai: desbloqueio do Berserker',
    atk: 22,
    def: 10,
    hp: 115,
    str: 11,
    dex: 6,
    int: 8,
    atkSpeed: 0.48,
    crit: '2,0%',
    critDmg: '×1,4',
  },
] as const;

export const ASCENSIONS = [
  { class: 'Cavaleiro', options: ['Guardião (STR ≥14)', 'Devastador (STR ≥14, DEX ≥10)'] },
  { class: 'Feiticeiro', options: ['Piromante (INT ≥14)', 'Arcanista (INT ≥14, DEX ≥10)'] },
  { class: 'Sacerdotisa', options: ['Oráculo (INT ≥14)', 'Inquisidor (INT ≥14, STR ≥10)'] },
] as const;

/** Reset de pontos — nós da árvore de Runas (após Forja Divina). */
export const IMPROVEMENT_RESET_NODES = [
  {
    level: 'I',
    name: 'Reset de pontos',
    cost: '5.000 ouro',
    parents: 'Forja Divina',
    heroLevel: 'Herói nível 12+',
    unlocks: 'Botões (−) em atributos e skills (classe e evolução → Aprimoramento)',
  },
  {
    level: 'II',
    name: 'Reset de pontos em massa',
    cost: '10.000 ouro',
    parents: 'Reset de pontos I',
    heroLevel: 'Herói nível 22+',
    unlocks: 'Botão Reset em massa no detalhe do herói (com prévia)',
  },
] as const;

export const IMPROVEMENT_RESET_RULES = [
  {
    title: 'O que devolve',
    body: 'Atributos alocados e ranks de skills (classe e evolução) voltam ao saldo único de Aprimoramento. Não existe pool separado de Evolução.',
  },
  {
    title: 'O que não muda',
    body: 'A ascensão de classe (caminho escolhido) é permanente — não há desfazer a evolução em si.',
  },
  {
    title: 'Pisos mínimos',
    body: 'Não dá para ficar abaixo do exigido pela ascensão atual (atributos ou skill_rank), por itens ainda equipados, ou por pré-requisitos entre skills. Toasts explicam o bloqueio ou o reset parcial.',
  },
  {
    title: 'Massa',
    body: 'Zera skills (exceto o mínimo da ascensão), desequipa as que forem a 0, reduz atributos até o piso seguro. Modal mostra prévia antes de confirmar; tudo volta a Aprimoramento.',
  },
] as const;

export const CAMPAIGN_MAPS = [
  { index: 1, name: 'Stendra' },
  { index: 2, name: 'Gruftall' },
  { index: 3, name: 'Valdris' },
  { index: 4, name: 'Morthaven' },
  { index: 5, name: 'Céu Quebrado' },
  { index: 6, name: 'Abismo Carmesim' },
  { index: 7, name: 'Forja Eterna' },
  { index: 8, name: 'Bosque Antigo' },
  { index: 9, name: 'Torre do Crepúsculo' },
  { index: 10, name: 'Trono do Vazio' },
] as const;

export const MILESTONES = [
  { phase: '1-50', name: 'Guardião Elemental', boss: 'Saci' },
  { phase: '2-50', name: 'Centelha de Gonodor', boss: 'Gonodor' },
  { phase: '3-50', name: 'Espectro de Valdris', boss: 'Chefe Orc Sangrento' },
  { phase: '4-50', name: 'Duque de Morthaven', boss: 'Troll das Montanhas' },
  { phase: '5-50', name: 'Colosso do Céu Quebrado', boss: 'Hidra de Três Cabeças' },
  { phase: '6-50', name: 'Senhor do Abismo', boss: 'Dragão Verde Jovem' },
  { phase: '7-50', name: 'Forjador Eterno', boss: 'Lich Menor' },
  { phase: '8-50', name: 'Guardião do Bosque', boss: 'Titã Desperto' },
  { phase: '9-50', name: 'Sentinela do Crepúsculo', boss: 'Príncipe Demônio' },
  { phase: '10-50', name: 'Soberano do Vazio', boss: 'Vorax' },
] as const;


export interface EnemyTierGroup {
  tier: number;
  label: string;
  commons: readonly string[];
  subbosses: readonly string[];
  boss: string;
  unique?: string;
}

export const ENEMY_TIERS: readonly EnemyTierGroup[] = [
  {
    tier: 1,
    label: 'Aprendiz',
    commons: [
      'Rato Gigante',
      'Morcego das Cavernas',
      'Lobo Cinzento',
      'Goblin Saqueador',
      'Goblin Arqueiro',
      'Kobold Escavador',
      'Goblin Bombardeiro',
      'Bandido de Estrada',
    ],
    subbosses: ['Xamã Goblin', 'Capitão dos Bandidos'],
    boss: 'Ogro das Colinas',
    unique: 'Saci',
  },
  {
    tier: 2,
    label: 'Efetivado',
    commons: [
      'Orc Guerreiro',
      'Orc Berserker',
      'Gnoll Caçador',
      'Aranha Gigante',
      'Homem-Lagarto',
      'Esqueleto Guerreiro',
      'Zumbi Putrefato',
      'Elemental Menor de Fogo',
    ],
    subbosses: ['Necromante Renegado', 'Chefe Orc do Clã Sangrento'],
    boss: 'Troll das Montanhas',
    unique: 'Gonodor',
  },
  {
    tier: 3,
    label: 'Profissional',
    commons: [
      'Gárgula',
      'Minotauro',
      'Worg de Guerra',
      'Cavaleiro Morto-Vivo',
      'Aracnídeo Sombrio',
      'Mago Cultista',
      'Demônio Menor',
      'Elemental Maior',
    ],
    subbosses: ['Hidra de Três Cabeças', 'General dos Mortos'],
    boss: 'Dragão Verde Jovem',
  },
  {
    tier: 4,
    label: 'Especialista',
    commons: [
      'Gigante da Pedra',
      'Gigante do Gelo',
      'Quimera',
      'Mantícora',
      'Diabo Infernal',
      'Abominação Aberrante',
      'Dragão Negro Adulto',
    ],
    subbosses: ['Lich Menor', 'Senhor da Guerra Demoníaco'],
    boss: 'Titã Desperto',
  },
  {
    tier: 5,
    label: 'Épico',
    commons: [
      'Dragão Ancião',
      'Behemoth Primordial',
      'Devorador de Almas',
      'Arauto do Vazio',
    ],
    subbosses: ['Arquilich', 'Príncipe Demônio'],
    boss: 'Deus Caído da Magia',
    unique: 'Vorax',
  },
];

export interface HeroSkillRow {
  name: string;
  element: string;
  target: string;
  cd: string;
  formula: string;
  notes?: string;
}

export const HERO_SKILLS: readonly HeroSkillRow[] = [
  { name: 'Ataque Básico', element: 'Físico', target: '1 inimigo', cd: '—', formula: 'ATK efetivo' },
  {
    name: 'Ataque Poderoso',
    element: 'Físico',
    target: '1 inimigo',
    cd: '2s',
    formula: '1 × (3×rank) × (STR×0,6333)',
    notes: 'Piso ATK×1,35',
  },
  {
    name: 'Toque Arcano',
    element: 'Raio',
    target: '1 inimigo',
    cd: '—',
    formula: '1 × (5×rank) × (INT×0,82)',
  },
  {
    name: 'Investida',
    element: 'Físico',
    target: '1 inimigo',
    cd: '4s',
    formula: '1 × (5×rank) × (STR×0,72)',
    notes: 'Piso ATK×1,35',
  },
  {
    name: 'Estilhaço Gélido',
    element: 'Gelo',
    target: '1 inimigo',
    cd: '2s',
    formula: '1 × (5×rank) × (INT×0,8)',
  },
  {
    name: 'Nevasca',
    element: 'Gelo (área)',
    target: 'Todos inimigos',
    cd: '5s',
    formula: '1 × (5×rank) × (INT×1,1)',
    notes: 'DOT gelo 55%',
  },
  {
    name: 'Bênção',
    element: '—',
    target: 'Todos aliados',
    cd: '6s',
    formula: '1 × (2×rank) × (attr×0,45)',
    notes: 'Buff ATK · 3 turnos',
  },
  {
    name: 'Castigo',
    element: 'Raio 70% + Físico 30%',
    target: '1 inimigo',
    cd: '2s',
    formula: '1 × (5×rank) × (INT×0,72)',
  },
  {
    name: 'Raio Arcano',
    element: 'Raio',
    target: '1 inimigo',
    cd: '2s',
    formula: '1 × (4×rank) × (INT×1,025)',
  },
  {
    name: 'Bola de Fogo',
    element: 'Fogo',
    target: '1 inimigo',
    cd: '4s',
    formula: '1 × (6×rank) × (INT×0,7167)',
    notes: 'DOT fogo 60%',
  },
  {
    name: 'Fúria',
    element: 'Físico',
    target: '1 inimigo',
    cd: '2s',
    formula: 'Base × (PPR×rank) × (STR×fator)',
    notes: 'Classe Berserker',
  },
  {
    name: 'Fender',
    element: 'Físico (área)',
    target: 'Todos inimigos',
    cd: '6s',
    formula: 'Base × (PPR×rank) × (STR×fator)',
    notes: 'Piso ATK×1,35',
  },
  {
    name: 'Chama Sagrada',
    element: 'Fogo',
    target: '1 inimigo',
    cd: '2s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
  },
  {
    name: 'Julgamento',
    element: 'Raio',
    target: 'Maior HP%',
    cd: '2s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
  },
  {
    name: 'Foco Arcano',
    element: 'Raio',
    target: '1 inimigo',
    cd: '1s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
  },
  {
    name: 'Brasa',
    element: 'Fogo',
    target: '1 inimigo',
    cd: '1s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
    notes: 'DOT fogo',
  },
  {
    name: 'Surto Arcano',
    element: 'Raio',
    target: '1 inimigo',
    cd: '2s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
  },
  {
    name: 'Inferno',
    element: 'Fogo 85% + Físico 15%',
    target: 'Todos inimigos',
    cd: '3s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
  },
  {
    name: 'Golpe do Guardião',
    element: 'Físico',
    target: '1 inimigo',
    cd: '1s',
    formula: 'Base × (PPR×rank) × (STR×fator)',
    notes: 'Piso ATK×1,35',
  },
  {
    name: 'Cura Menor',
    element: '—',
    target: '1 aliado',
    cd: '3s',
    formula: '1 × (10×rank) × (INT×0,35)',
    notes: 'HP < 85%',
  },
  {
    name: 'Santuário',
    element: '—',
    target: 'Todos',
    cd: '4s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
    notes: 'Cura em área · HP < 75%',
  },
  {
    name: 'Restauração',
    element: '—',
    target: '1 aliado',
    cd: '3s',
    formula: 'Base × (PPR×rank) × (INT×fator)',
    notes: 'HP < 85%',
  },
];

export interface MonsterSkillRow {
  name: string;
  element: string;
  target: string;
  cd: string;
  base: number;
  notes?: string;
}

export const MONSTER_SKILLS: readonly MonsterSkillRow[] = [
  { name: 'Mordida Selvagem', element: 'Físico', target: '1 herói', cd: '2s', base: 5 },
  { name: 'Facada', element: 'Físico', target: '1 herói', cd: '2s', base: 6 },
  { name: 'Pancada', element: 'Físico', target: '1 herói', cd: '2s', base: 8 },
  { name: 'Cuspe Venenoso', element: 'Caos', target: '1 herói', cd: '2s', base: 5, notes: 'DOT caos 70%' },
  { name: 'Pancada Sísmica', element: 'Físico (área)', target: 'Todos heróis', cd: '3s', base: 7 },
  { name: 'Regeneração', element: '—', target: '1 inimigo', cd: '4s', base: 15, notes: 'HP < 60%' },
  { name: 'Ácido', element: 'Caos', target: '1 herói', cd: '2s', base: 4, notes: 'DOT caos 85%' },
  { name: 'Drenar Vida', element: 'Caos', target: '1 herói', cd: '2s', base: 6 },
  { name: 'Maldição', element: '—', target: '1 herói', cd: '3s', base: 3, notes: 'Debuff DEF 2 turnos' },
  { name: 'Baforada', element: 'Fogo 90% + Físico 10%', target: 'Todos heróis', cd: '3s', base: 12 },
  { name: 'Mordida', element: 'Físico', target: 'Maior HP%', cd: '2s', base: 8 },
  { name: 'Chama Elemental', element: 'Fogo', target: '1 herói', cd: '2s', base: 11 },
  { name: 'Rajada de Vento', element: 'Raio (área)', target: 'Todos heróis', cd: '3s', base: 7 },
];

export const DEFENSIVE_PASSIVES = [
  { name: 'Esquiva (evasion)', effect: '+2,5% dodge por rank (equipada)', req: 'Universal' },
  { name: 'Pele de Ferro (iron_skin)', effect: '+4% redução de dano por rank', req: 'Cavaleiro' },
  { name: 'Escudo de Mana (mana_shield)', effect: '+3% block por rank', req: 'Feiticeiro' },
] as const;

export const ENEMY_COMBAT_PROFILE = [
  { tier: 1, atkSpeed: 0.95, crit: '0,5%', critDmg: '×1,25' },
  { tier: 2, atkSpeed: 0.9, crit: '1,0%', critDmg: '×1,30' },
  { tier: 3, atkSpeed: 0.85, crit: '2,0%', critDmg: '×1,40' },
  { tier: 4, atkSpeed: 0.75, crit: '2,5%', critDmg: '×1,45' },
  { tier: 5, atkSpeed: 0.65, crit: '3,0%', critDmg: '×1,55' },
] as const;

export const CHEST_RARITY = [
  {
    type: 'Monstro',
    common: '55%',
    uncommon: '25%',
    rare: '14%',
    epic: '5%',
    legendary: '1%',
    mythic: '0%',
  },
  {
    type: 'Boss',
    common: '20%',
    uncommon: '28%',
    rare: '30%',
    epic: '15%',
    legendary: '6%',
    mythic: '1%',
  },
  {
    type: 'Boss de capítulo',
    common: '5%',
    uncommon: '10%',
    rare: '25%',
    epic: '35%',
    legendary: '18%',
    mythic: '7%',
  },
] as const;

export const GEAR_NAMES = {
  weapon: ['Espada Enferrujada', 'Machado Pixel', 'Cajado Arcano', 'Lâmina Side'],
  armor: ['Escudo de Madeira', 'Armadura 8-bit', 'Manto do Herói', 'Placa Chrome'],
  accessory: ['Anel de Cobre', 'Amuleto Idle', 'Pingente RPG', 'Badge Extensão'],
} as const;
