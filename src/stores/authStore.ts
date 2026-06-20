import { create } from 'zustand';
import { User, Language } from '../types';
import { api, authApi } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: string) => Promise<boolean>;
  register: (data: { name: string; username: string; email: string; password: string; language: Language }) => Promise<boolean>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; username?: string; email?: string; language?: Language; emailNotifications?: boolean; streakReminders?: boolean }) => void;
  resetProgress: () => void;
  deleteAccount: () => void;
  updateXP: (amount: number) => void;
  completeLevel: (language: Language, levelId: number, xp: number) => void;
  incrementStreak: () => void;
}

const getRank = (level: number): string => {
  const ranks = ['Newbie', 'Follower', 'Committer', 'Pusher', 'Merger', 'Brancher', 'Rebaser', 'Collaborator', 'Maintainer', 'Git Master'];
  return ranks[Math.min(level - 1, ranks.length - 1)] || 'Newbie';
};

const getXpToNext = (level: number): number => level * 500;

interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  level?: number;
  xp?: number;
  streak?: number;
  createdAt?: string;
  isDemo?: boolean;
  settings?: { notifications?: boolean };
}

function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    username: apiUser.username,
    email: apiUser.email,
    avatar: apiUser.avatar || '🦊',
    level: apiUser.level || 1,
    xp: apiUser.xp || 0,
    xpToNext: getXpToNext(apiUser.level || 1),
    rank: getRank(apiUser.level || 1),
    streak: apiUser.streak || 0,
    longestStreak: apiUser.streak || 0,
    joinedAt: apiUser.createdAt || new Date().toISOString(),
    isDemo: apiUser.isDemo || false,
    languagePreference: 'git',
    completedLevels: { git: [], python: [], c: [], cpp: [], java: [] },
    achievements: [],
    emailNotifications: apiUser.settings?.notifications ?? true,
    streakReminders: apiUser.settings?.notifications ?? true,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user: apiUser, token } = await authApi.login({ email, password });
      api.setToken(token);
      const user = apiUserToUser(apiUser);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  loginWithProvider: async (provider: string) => {
    set({ isLoading: true });
    try {
      const { user: apiUser, token } = await authApi.demo();
      api.setToken(token);
      const user = apiUserToUser(apiUser);
      user.name = `${provider} User`;
      user.email = `user@${provider}.com`;
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const { user: apiUser, token } = await authApi.register({
        email: data.email,
        name: data.name,
        username: data.username,
        password: data.password,
      });
      api.setToken(token);
      const user = apiUserToUser(apiUser);
      user.languagePreference = data.language;
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  loginAsDemo: async () => {
    try {
      const { user: apiUser, token } = await authApi.demo();
      api.setToken(token);
      const user = apiUserToUser(apiUser);
      set({ user, isAuthenticated: true });
    } catch {
      const demoUser: User = {
        id: 'demo-' + Date.now(),
        name: 'Explorer',
        username: 'explorer',
        email: '',
        avatar: '🦊',
        level: 1,
        xp: 0,
        xpToNext: 500,
        rank: 'Newbie',
        streak: 0,
        longestStreak: 0,
        joinedAt: new Date().toISOString(),
        isDemo: true,
        languagePreference: 'git',
        completedLevels: { git: [], python: [], c: [], cpp: [], java: [] },
        achievements: [],
        emailNotifications: true,
        streakReminders: true,
      };
      set({ user: demoUser, isAuthenticated: true });
    }
  },

  logout: () => {
    api.setToken(null);
    set({ user: null, isAuthenticated: false });
  },

  updateXP: (amount: number) => {
    const { user } = get();
    if (!user) return;
    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXpToNext = user.xpToNext;
    while (newXP >= newXpToNext) {
      newXP -= newXpToNext;
      newLevel++;
      newXpToNext = getXpToNext(newLevel);
    }
    const updated = { ...user, xp: newXP, level: newLevel, xpToNext: newXpToNext, rank: getRank(newLevel) };
    set({ user: updated });
  },

  completeLevel: (language: Language, levelId: number, xp: number) => {
    const { user } = get();
    if (!user) return;
    const completed = { ...user.completedLevels };
    if (!completed[language].includes(levelId)) {
      completed[language] = [...completed[language], levelId];
    }
    let newXP = user.xp + xp;
    let newLevel = user.level;
    let newXpToNext = user.xpToNext;
    while (newXP >= newXpToNext) {
      newXP -= newXpToNext;
      newLevel++;
      newXpToNext = getXpToNext(newLevel);
    }
    const updated = { ...user, completedLevels: completed, xp: newXP, level: newLevel, xpToNext: newXpToNext, rank: getRank(newLevel) };
    set({ user: updated });
  },

  incrementStreak: () => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, streak: user.streak + 1, longestStreak: Math.max(user.longestStreak, user.streak + 1) };
    set({ user: updated });
  },

  updateProfile: (data) => {
    const { user } = get();
    if (!user) return;
    const { language, ...rest } = data;
    const updates: Record<string, unknown> = { ...rest };
    if (language !== undefined) updates.languagePreference = language;
    const updated = { ...user, ...updates };
    set({ user: updated });

    if (!user.isDemo) {
      authApi.updateProfile({ name: data.name }).catch(() => {});
    }
  },

  resetProgress: () => {
    const { user } = get();
    if (!user) return;
    const updated = {
      ...user,
      xp: 0,
      level: 1,
      xpToNext: 500,
      rank: 'Newbie',
      streak: 0,
      longestStreak: 0,
      completedLevels: { git: [] as number[], python: [] as number[], c: [] as number[], cpp: [] as number[], java: [] as number[] },
      achievements: [] as string[],
    };
    set({ user: updated });
  },

  deleteAccount: () => {
    api.setToken(null);
    set({ user: null, isAuthenticated: false });
  },
}));
