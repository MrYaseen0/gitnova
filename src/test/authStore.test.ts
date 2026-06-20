import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.clear();
  });

  describe('loginAsDemo', () => {
    it('creates a demo user', async () => {
      const { loginAsDemo } = useAuthStore.getState();
      await loginAsDemo();

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
      expect(user).not.toBeNull();
      expect(user?.isDemo).toBe(true);
      expect(user?.name).toBe('Explorer');
      expect(user?.xp).toBe(0);
      expect(user?.level).toBe(1);
    });

    it('stores JWT token in localStorage', async () => {
      await useAuthStore.getState().loginAsDemo();

      const token = localStorage.getItem('gitnova_token');
      expect(token).toBe('mock-demo-token');
    });
  });

  describe('logout', () => {
    it('clears user and isAuthenticated', async () => {
      await useAuthStore.getState().loginAsDemo();
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      await useAuthStore.getState().logout();
      const { user, isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
    });

    it('removes token from localStorage', async () => {
      await useAuthStore.getState().loginAsDemo();
      expect(localStorage.getItem('gitnova_token')).not.toBeNull();

      await useAuthStore.getState().logout();
      expect(localStorage.getItem('gitnova_token')).toBeNull();
    });
  });

  describe('login', () => {
    it('creates a new user on first login', async () => {
      const result = await useAuthStore.getState().login('test@example.com', 'password');

      expect(result).toBe(true);
      const { user, isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
      expect(user?.email).toBe('test@example.com');
      expect(user?.isDemo).toBe(false);
    });

    it('returns false on invalid credentials', async () => {
      vi.mocked(fetch).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        } as Response)
      );

      const result = await useAuthStore.getState().login('wrong@example.com', 'bad');
      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('creates user with provided data', async () => {
      const result = await useAuthStore.getState().register({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        language: 'python',
      });

      expect(result).toBe(true);
      const { user } = useAuthStore.getState();
      expect(user?.name).toBe('John Doe');
      expect(user?.username).toBe('johndoe');
      expect(user?.email).toBe('john@example.com');
      expect(user?.languagePreference).toBe('python');
    });

    it('stores JWT token on register', async () => {
      await useAuthStore.getState().register({
        name: 'Jane',
        username: 'jane',
        email: 'jane@test.com',
        password: 'pass',
        language: 'git',
      });

      const token = localStorage.getItem('gitnova_token');
      expect(token).toBe('mock-token-123');
    });
  });

  describe('updateXP', () => {
    it('adds XP to user', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateXP(100);

      expect(useAuthStore.getState().user?.xp).toBe(100);
    });

    it('levels up when XP exceeds threshold', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateXP(500);

      const user = useAuthStore.getState().user;
      expect(user?.level).toBe(2);
      expect(user?.xp).toBe(0);
      expect(user?.xpToNext).toBe(1000);
      expect(user?.rank).toBe('Follower');
    });

    it('handles multiple level ups', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateXP(1500);

      const user = useAuthStore.getState().user;
      expect(user?.level).toBe(3);
      expect(user?.rank).toBe('Committer');
    });
  });

  describe('completeLevel', () => {
    it('adds level to completedLevels', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().completeLevel('git', 1, 50);

      const user = useAuthStore.getState().user;
      expect(user?.completedLevels.git).toContain(1);
      expect(user?.xp).toBe(50);
    });

    it('does not duplicate completed levels', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().completeLevel('git', 1, 50);
      useAuthStore.getState().completeLevel('git', 1, 50);

      const completed = useAuthStore.getState().user?.completedLevels.git;
      expect(completed?.filter((id: number) => id === 1).length).toBe(1);
    });

    it('tracks different languages separately', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().completeLevel('git', 1, 50);
      useAuthStore.getState().completeLevel('python', 1, 50);

      const user = useAuthStore.getState().user;
      expect(user?.completedLevels.git).toContain(1);
      expect(user?.completedLevels.python).toContain(1);
    });
  });

  describe('incrementStreak', () => {
    it('increments streak by 1', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().incrementStreak();

      const user = useAuthStore.getState().user;
      expect(user?.streak).toBe(1);
      expect(user?.longestStreak).toBe(1);
    });

    it('updates longestStreak when current exceeds it', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().incrementStreak();
      useAuthStore.getState().incrementStreak();

      const user = useAuthStore.getState().user;
      expect(user?.streak).toBe(2);
      expect(user?.longestStreak).toBe(2);
    });
  });

  describe('updateProfile', () => {
    it('updates name', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateProfile({ name: 'New Name' });

      expect(useAuthStore.getState().user?.name).toBe('New Name');
    });

    it('updates language preference', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateProfile({ language: 'python' });

      expect(useAuthStore.getState().user?.languagePreference).toBe('python');
    });

    it('updates notification preferences', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateProfile({ emailNotifications: false });

      expect(useAuthStore.getState().user?.emailNotifications).toBe(false);
    });
  });

  describe('resetProgress', () => {
    it('resets all progress to defaults', async () => {
      await useAuthStore.getState().loginAsDemo();
      useAuthStore.getState().updateXP(500);
      useAuthStore.getState().completeLevel('git', 1, 100);
      useAuthStore.getState().incrementStreak();

      await useAuthStore.getState().resetProgress();

      const user = useAuthStore.getState().user;
      expect(user?.xp).toBe(0);
      expect(user?.level).toBe(1);
      expect(user?.rank).toBe('Newbie');
      expect(user?.streak).toBe(0);
      expect(user?.completedLevels.git).toEqual([]);
    });
  });

  describe('deleteAccount', () => {
    it('clears user and token', async () => {
      await useAuthStore.getState().loginAsDemo();
      await useAuthStore.getState().deleteAccount();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(localStorage.getItem('gitnova_token')).toBeNull();
    });
  });

  describe('getRank', () => {
    it('returns correct ranks for levels', async () => {
      await useAuthStore.getState().loginAsDemo();

      useAuthStore.getState().updateXP(0);
      expect(useAuthStore.getState().user?.rank).toBe('Newbie');

      useAuthStore.getState().updateXP(500);
      expect(useAuthStore.getState().user?.rank).toBe('Follower');
    });
  });
});
