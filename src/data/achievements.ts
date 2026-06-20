export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'commit' | 'streak' | 'xp' | 'branch' | 'merge' | 'special';
  requirement: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-commit', icon: '🎯', title: 'First Commit', description: 'Make your first git commit', category: 'commit', requirement: 1 },
  { id: 'streak-3', icon: '🔥', title: 'On Fire', description: 'Maintain a 3-day streak', category: 'streak', requirement: 3 },
  { id: 'streak-7', icon: '🔥', title: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streak', requirement: 7 },
  { id: 'streak-30', icon: '🔥', title: 'Monthly Master', description: 'Maintain a 30-day streak', category: 'streak', requirement: 30 },
  { id: 'speed-run', icon: '⚡', title: 'Speed Runner', description: 'Complete 5 levels in one session', category: 'special', requirement: 5 },
  { id: 'perfect', icon: '🌟', title: 'Perfectionist', description: 'Complete a level without mistakes', category: 'special', requirement: 1 },
  { id: 'boss-slayer', icon: '🏆', title: 'Boss Slayer', description: 'Complete a boss level', category: 'special', requirement: 1 },
  { id: 'branch-master', icon: '🌿', title: 'Branch Master', description: 'Create 5 different branches', category: 'branch', requirement: 5 },
  { id: 'merge-pro', icon: '🔀', title: 'Merge Pro', description: 'Perform 10 merges', category: 'merge', requirement: 10 },
  { id: 'xp-100', icon: '💎', title: 'Diamond', description: 'Earn 100 XP', category: 'xp', requirement: 100 },
  { id: 'xp-500', icon: '👑', title: 'Crown', description: 'Earn 500 XP', category: 'xp', requirement: 500 },
  { id: 'xp-2000', icon: '🌟', title: 'Star', description: 'Earn 2000 XP', category: 'xp', requirement: 2000 },
  { id: 'all-git', icon: '🎓', title: 'Git Graduate', description: 'Complete all Git levels', category: 'commit', requirement: 50 },
  { id: 'polyglot', icon: '🌍', title: 'Polyglot', description: 'Complete levels in 3 languages', category: 'special', requirement: 3 },
  { id: 'night-owl', icon: '🦉', title: 'Night Owl', description: 'Complete a level after midnight', category: 'special', requirement: 1 },
  { id: 'early-bird', icon: '🐦', title: 'Early Bird', description: 'Complete a level before 7 AM', category: 'special', requirement: 1 },
  { id: 'explorer', icon: '🗺️', title: 'Explorer', description: 'Visit all pages', category: 'special', requirement: 1 },
  { id: 'social', icon: '🤝', title: 'Team Player', description: 'Share your progress', category: 'special', requirement: 1 },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}
