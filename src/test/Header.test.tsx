import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { useAuthStore } from '../stores/authStore';

function renderWithRouter(ui: React.ReactNode) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Header', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.clear();
  });

  it('renders the logo', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Git')).toBeInTheDocument();
    expect(screen.getByText('Nova')).toBeInTheDocument();
  });

  it('shows nav links for unauthenticated users', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows nav links for authenticated users', () => {
    useAuthStore.setState({
      user: {
        id: '1', name: 'Test User', username: 'test', email: 'test@test.com',
        avatar: '🎓', level: 5, xp: 1000, xpToNext: 2500, rank: 'Pusher',
        streak: 3, longestStreak: 5, joinedAt: new Date().toISOString(),
        isDemo: false, languagePreference: 'git',
        completedLevels: { git: [], python: [], c: [], cpp: [], java: [] },
        achievements: [], emailNotifications: true, streakReminders: true,
      },
      isAuthenticated: true,
    });

    renderWithRouter(<Header />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Playground')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('shows user name when authenticated', () => {
    useAuthStore.setState({
      user: {
        id: '1', name: 'Test User', username: 'test', email: 'test@test.com',
        avatar: '🎓', level: 5, xp: 1000, xpToNext: 2500, rank: 'Pusher',
        streak: 3, longestStreak: 5, joinedAt: new Date().toISOString(),
        isDemo: false, languagePreference: 'git',
        completedLevels: { git: [], python: [], c: [], cpp: [], java: [] },
        achievements: [], emailNotifications: true, streakReminders: true,
      },
      isAuthenticated: true,
    });

    renderWithRouter(<Header />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('shows Get Started button when not authenticated', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows streak count when authenticated', () => {
    useAuthStore.setState({
      user: {
        id: '1', name: 'Test User', username: 'test', email: 'test@test.com',
        avatar: '🎓', level: 5, xp: 1000, xpToNext: 2500, rank: 'Pusher',
        streak: 7, longestStreak: 10, joinedAt: new Date().toISOString(),
        isDemo: false, languagePreference: 'git',
        completedLevels: { git: [], python: [], c: [], cpp: [], java: [] },
        achievements: [], emailNotifications: true, streakReminders: true,
      },
      isAuthenticated: true,
    });

    renderWithRouter(<Header />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
