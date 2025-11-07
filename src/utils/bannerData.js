// Banner catalog with unlock requirements and costs

export const BANNER_CATALOG = [
  // NOVICE TIER (Streak 1-5) - Light Blue (#b0c3d9)
  {
    id: 'novice-sky',
    name: 'Sky Blue',
    description: 'Clear blue skies ahead',
    tier: 'Novice',
    tierThreshold: 1,
    cost: { leg: 3 },
    rarity: 'Common',
    gradient: ['#4a5568', '#6b7fa8', '#b0c3d9', '#e0f0ff'],
  },
  {
    id: 'novice-cloud',
    name: 'Cloud Nine',
    description: 'New beginnings',
    tier: 'Novice',
    tierThreshold: 1,
    cost: { push: 3 },
    rarity: 'Common',
    gradient: ['#8aa5c0', '#b0c3d9', '#d5e8ff', '#ffffff'],
  },
  
  // INTERMEDIATE TIER (Streak 6-14) - Medium Blue (#5e98d9)
  {
    id: 'intermediate-ocean',
    name: 'Ocean Breeze',
    description: 'Deep sea vibes',
    tier: 'Intermediate',
    tierThreshold: 6,
    cost: { pull: 5, cardio: 2 },
    rarity: 'Common',
    gradient: ['#1a2f4a', '#2d5570', '#5e98d9', '#a0d0ff'],
  },
  {
    id: 'intermediate-wave',
    name: 'Wave Rider',
    description: 'Ride the momentum',
    tier: 'Intermediate',
    tierThreshold: 6,
    cost: { leg: 5, push: 2 },
    rarity: 'Common',
    gradient: ['#5e98d9', '#7fb3ea', '#90c5ff', '#d0e8ff'],
  },
  {
    id: 'intermediate-sapphire',
    name: 'Sapphire Flow',
    description: 'Precious progress',
    tier: 'Intermediate',
    tierThreshold: 6,
    cost: { fullBody: 4, pull: 3 },
    rarity: 'Common',
    gradient: ['#203850', '#3d6890', '#5e98d9', '#70a8e9'],
  },
  
  // ADVANCED TIER (Streak 15-30) - Bright Blue (#4b69ff)
  {
    id: 'advanced-electric',
    name: 'Electric Blue',
    description: 'High voltage energy',
    tier: 'Advanced',
    tierThreshold: 15,
    cost: { push: 7, leg: 5 },
    rarity: 'Rare',
    gradient: ['#0a0a1f', '#1a2850', '#4b69ff', '#7d95ff', '#afc8ff'],
  },
  {
    id: 'advanced-neon',
    name: 'Neon Glow',
    description: 'Bright and bold',
    tier: 'Advanced',
    tierThreshold: 15,
    cost: { cardio: 8, broSplit: 4 },
    rarity: 'Rare',
    gradient: ['#4b69ff', '#6c8aff', '#8daeff', '#b0d5ff'],
  },
  {
    id: 'advanced-azure',
    name: 'Azure Strike',
    description: 'Swift and powerful',
    tier: 'Advanced',
    tierThreshold: 15,
    cost: { pull: 7, fullBody: 5 },
    rarity: 'Rare',
    gradient: ['#0d1b3a', '#2d4590', '#4b69ff', '#6080ff'],
  },
  
  // EXPERT TIER (Streak 31-49) - Purple (#8847ff)
  {
    id: 'expert-royal',
    name: 'Royal Purple',
    description: 'Fit for royalty',
    tier: 'Expert',
    tierThreshold: 31,
    cost: { leg: 10, push: 8, pull: 5 },
    rarity: 'Rare',
    gradient: ['#000000', '#1a0a2e', '#4a1f7a', '#8847ff', '#a867ff'],
  },
  {
    id: 'expert-violet',
    name: 'Violet Storm',
    description: 'Mystic power',
    tier: 'Expert',
    tierThreshold: 31,
    cost: { fullBody: 10, leg: 8 },
    rarity: 'Rare',
    gradient: ['#0f0520', '#3d1f60', '#7537df', '#8847ff', '#c890ff'],
  },
  {
    id: 'expert-amethyst',
    name: 'Amethyst Glow',
    description: 'Precious and powerful',
    tier: 'Expert',
    tierThreshold: 31,
    cost: { cardio: 12, push: 7 },
    rarity: 'Rare',
    gradient: ['#1a0a35', '#5020a0', '#8847ff', '#b880ff', '#e0b0ff'],
  },
  
  // MASTER TIER (Streak 50-75) - Pink/Magenta (#d32ce6)
  {
    id: 'master-magenta',
    name: 'Magenta Surge',
    description: 'Electric intensity',
    tier: 'Master',
    tierThreshold: 50,
    cost: { pull: 15, push: 12, leg: 10 },
    rarity: 'Epic',
    gradient: ['#1a0520', '#5a1570', '#a020b0', '#d32ce6', '#ff60ff'],
  },
  {
    id: 'master-fuchsia',
    name: 'Fuchsia Blast',
    description: 'Vibrant power',
    tier: 'Master',
    tierThreshold: 50,
    cost: { broSplit: 15, cardio: 10, leg: 8 },
    rarity: 'Epic',
    gradient: ['#d32ce6', '#e050f0', '#ff70ff', '#ffa0ff'],
  },
  {
    id: 'master-rose',
    name: 'Electric Rose',
    description: 'Beauty and strength',
    tier: 'Master',
    tierThreshold: 50,
    cost: { fullBody: 15, pull: 12 },
    rarity: 'Epic',
    gradient: ['#0a0015', '#3a0855', '#9018c0', '#d32ce6', '#ff5ce6'],
  },
  
  // ELITE TIER (Streak 76-99) - Red (#eb4b4b)
  {
    id: 'elite-crimson',
    name: 'Crimson Rage',
    description: 'Fierce determination',
    tier: 'Elite',
    tierThreshold: 76,
    cost: { leg: 20, push: 15, broSplit: 10 },
    rarity: 'Epic',
    gradient: ['#1a0000', '#4a0a0a', '#8a1a1a', '#eb4b4b', '#ff7070'],
  },
  {
    id: 'elite-scarlet',
    name: 'Scarlet Force',
    description: 'Unstoppable power',
    tier: 'Elite',
    tierThreshold: 76,
    cost: { pull: 20, fullBody: 15, cardio: 10 },
    rarity: 'Epic',
    gradient: ['#2a0505', '#6a1515', '#ba2b2b', '#eb4b4b', '#ff8888'],
  },
  {
    id: 'elite-ruby',
    name: 'Ruby Inferno',
    description: 'Burning passion',
    tier: 'Elite',
    tierThreshold: 76,
    cost: { fullBody: 20, leg: 15, push: 10 },
    rarity: 'Epic',
    gradient: ['#eb4b4b', '#ff5b5b', '#ff8080', '#ffa0a0'],
  },
  
  // CHAMPION TIER (Streak 100-149) - Gold/Bronze (#b28a33)
  {
    id: 'champion-gold',
    name: 'Golden Glory',
    description: 'Champion status',
    tier: 'Champion',
    tierThreshold: 100,
    cost: { cardio: 25, push: 20, pull: 15 },
    rarity: 'Legendary',
    gradient: ['#1a1208', '#4a3018', '#8a6028', '#b28a33', '#d2aa53', '#f2ca73'],
  },
  {
    id: 'champion-bronze',
    name: 'Bronze Warrior',
    description: 'Battle tested',
    tier: 'Champion',
    tierThreshold: 100,
    cost: { broSplit: 25, leg: 20, fullBody: 15 },
    rarity: 'Legendary',
    gradient: ['#2a1a05', '#6a4a15', '#a27a25', '#b28a33', '#c2aa53'],
  },
  
  // LEGEND TIER (Streak 150-299) - Lime Green (#ade55c)
  {
    id: 'legend-lime',
    name: 'Lime Lightning',
    description: 'Electric legend',
    tier: 'Legend',
    tierThreshold: 150,
    cost: { pull: 30, push: 30, leg: 30, cardio: 20 },
    rarity: 'Legendary',
    gradient: ['#0a1505', '#2a4515', '#6a9530', '#ade55c', '#d0ff88'],
  },
  {
    id: 'legend-neon',
    name: 'Neon Legend',
    description: 'Legendary glow',
    tier: 'Legend',
    tierThreshold: 150,
    cost: { fullBody: 35, leg: 30, push: 25 },
    rarity: 'Legendary',
    gradient: ['#1a2510', '#5a8535', '#8dc540', '#ade55c', '#e0ff90'],
  },
  
  // IMMORTAL TIER (Streak 300+) - Yellow (#fff34f)
  {
    id: 'immortal-divine',
    name: 'Divine Radiance',
    description: 'God-tier achieved',
    tier: 'Immortal',
    tierThreshold: 300,
    cost: { pull: 50, push: 50, leg: 50, fullBody: 40, cardio: 30, broSplit: 30 },
    rarity: 'Mythic',
    gradient: ['#2a2510', '#7a6520', '#caa830', '#fff34f', '#ffff80', '#fffff0'],
  },
  {
    id: 'immortal-eternal',
    name: 'Eternal Light',
    description: 'Forever shining',
    tier: 'Immortal',
    tierThreshold: 300,
    cost: { leg: 60, push: 50, broSplit: 40, cardio: 35 },
    rarity: 'Mythic',
    gradient: ['#1a1a08', '#5a5a20', '#baba38', '#fff34f', '#ffff70'],
  },
];

// Default banner for new users
export const DEFAULT_BANNER = {
  id: 'default',
  name: 'Starter',
  description: 'Your journey begins',
  tier: 'Beginner',
  tierThreshold: 0,
  cost: {},
  rarity: 'Common',
  gradient: ['#374151', '#4B5563'],
};

export function getBannerById(bannerId) {
  if (bannerId === 'default') return DEFAULT_BANNER;
  return BANNER_CATALOG.find(b => b.id === bannerId) || DEFAULT_BANNER;
}

export function getBannersByTier(tierName) {
  return BANNER_CATALOG.filter(b => b.tier === tierName);
}

export function getAvailableBanners(currentStreak) {
  return BANNER_CATALOG.filter(b => currentStreak >= b.tierThreshold);
}

