const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
}

export interface CompletedLevel {
  id: string;
  levelId: string;
  completed: boolean;
  score: number;
  completedAt: string | null;
  level: {
    id: string;
    title: string;
    language: string;
    difficulty: string;
  };
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  requirement: number;
  xpReward: number;
  earned?: boolean;
  earnedAt?: string | null;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  percentage: number;
}

export interface LeaderboardEntry {
  username: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  streak?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Settings {
  theme?: string;
  language?: string;
  notifications?: boolean;
  [key: string]: unknown;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  xpReward: number;
  order: number;
}

export interface Report {
  id: string;
  name: string;
  email: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('gitnova_token', token);
    } else {
      localStorage.removeItem('gitnova_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('gitnova_token');
    }
    return this.token;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;
    const authToken = token || this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth
export const authApi = {
  register: (data: { email: string; name: string; username: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', data),
  demo: () =>
    api.post<{ user: User; token: string }>('/auth/demo'),
  me: () =>
    api.get<{ user: User }>('/auth/me'),
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put<{ user: User }>('/auth/profile', data),
  forgotPassword: (email: string) =>
    api.post<{ message: string; resetToken?: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
  uploadAvatar: (avatar: string) =>
    api.post<{ avatar: string }>('/auth/avatar', { avatar }),
};

// Progress
export const progressApi = {
  complete: (data: { levelId: string; score?: number; language?: string }) =>
    api.post<{ xpGained: number; totalXp: number; newLevel?: number; alreadyCompleted?: boolean }>('/progress/complete', data),
  get: () =>
    api.get<{ completedLevels: CompletedLevel[]; stats: { totalLevels: number; completedCount: number; percentage: number } }>('/progress'),
  heatmap: () =>
    api.get<{ heatmap: Record<string, number> }>('/progress/heatmap'),
  analytics: () =>
    api.get<{ xpOverTime: Record<string, number>; byLanguage: Record<string, number>; byDifficulty: Record<string, number>; activityByDate: Record<string, number>; weeklyTrend: { week: string; count: number }[]; totals: { xp: number; level: number; streak: number; completedCount: number; joinedAt: string } }>('/progress/analytics'),
};

// Leaderboard
export interface UserProfileAchievement {
  id: string;
  achievementId: string;
  earnedAt: string | null;
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
  };
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  completedLevels: CompletedLevel[];
  achievements: UserProfileAchievement[];
  heatmap?: Record<string, number>;
}

export const leaderboardApi = {
  get: (page = 1, limit = 20) =>
    api.get<{ leaderboard: LeaderboardEntry[]; pagination: Pagination; currentUserRank: number | null }>(`/leaderboard?page=${page}&limit=${limit}`),
  getProfile: (username: string) =>
    api.get<{ profile: UserProfile; rank: number }>(`/leaderboard/${username}`),
};

// Achievements
export const achievementsApi = {
  getAll: () =>
    api.get<{ achievements: Achievement[] }>('/achievements'),
  getMine: () =>
    api.get<{ achievements: Achievement[]; stats: AchievementStats }>('/achievements/mine'),
  report: (data: { type: string; title: string; description: string; page: string }) =>
    api.post<{ id: string }>('/achievements/report', data),
};

// Settings
export const settingsApi = {
  get: () =>
    api.get<{ settings: Settings }>('/settings'),
  update: (data: Record<string, unknown>) =>
    api.put<{ settings: Settings }>('/settings', data),
  deleteAccount: () =>
    api.delete<{ message: string }>('/settings/account'),
};

// Levels
export const levelsApi = {
  getAll: (language?: string) =>
    api.get<{ levels: Level[]; grouped: Record<string, Level[]> }>(`/levels${language ? `?language=${language}` : ''}`),
  getOne: (id: string) =>
    api.get<{ level: Level }>(`/levels/${id}`),
};

// Reports
export const reportsApi = {
  submit: (data: { name: string; email: string; type: string; title: string; description: string; priority?: string; steps?: string }) =>
    api.post<{ report: Report; message: string }>('/achievements/report', data),
};
