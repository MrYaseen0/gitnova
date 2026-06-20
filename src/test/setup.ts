import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock fetch for API calls
const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  xp: 0,
  level: 1,
  streak: 0,
  isDemo: false,
  createdAt: new Date().toISOString(),
  settings: { notifications: true },
};

vi.stubGlobal('fetch', vi.fn((url: string, options?: { method?: string; body?: string; headers?: Record<string, string> }) => {
  const body = options?.body ? JSON.parse(options.body) : {};

  if (url.includes('/api/auth/register')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { ...mockUser, name: body.name, email: body.email, username: body.username }, token: 'mock-token-123' }),
    });
  }
  if (url.includes('/api/auth/login')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: 'mock-token-123' }),
    });
  }
  if (url.includes('/api/auth/demo')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { ...mockUser, isDemo: true, name: 'Explorer', username: 'explorer' }, token: 'mock-demo-token' }),
    });
  }
  if (url.includes('/api/auth/me')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    });
  }
  if (url.includes('/api/auth/logout')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Logged out' }),
    });
  }
  if (url.includes('/api/auth/profile')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    });
  }
  if (url.includes('/api/progress/reset')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Progress reset successfully' }),
    });
  }
  if (url.includes('/api/progress')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ completedLevels: [], stats: { totalLevels: 70, completedCount: 0, percentage: 0 } }),
    });
  }
  if (url.includes('/api/leaderboard')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ leaderboard: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }, currentUserRank: null }),
    });
  }
  if (url.includes('/api/achievements')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ achievements: [], stats: { total: 0, earned: 0, percentage: 0 } }),
    });
  }
  if (url.includes('/api/levels')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ levels: [], grouped: {} }),
    });
  }
  if (url.includes('/api/settings/account')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Account deleted successfully' }),
    });
  }
  if (url.includes('/api/settings')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ settings: { notifications: true, soundEnabled: true, musicEnabled: true } }),
    });
  }
  if (url.includes('/api/health')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'ok' }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
}));

// Reset localStorage before each test
beforeEach(() => {
  window.localStorage.clear();
});
