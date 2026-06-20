import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useAuthStore } from '../stores/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../lib/api', () => ({
  api: {
    setToken: vi.fn(),
    getToken: vi.fn(() => null),
  },
  authApi: {
    login: vi.fn(() => Promise.resolve({
      user: { id: '1', email: 'test@test.com', name: 'Test', username: 'test', xp: 0, level: 1, streak: 0, isDemo: false, createdAt: new Date().toISOString(), settings: { notifications: true } },
      token: 'mock-token',
    })),
    demo: vi.fn(() => Promise.resolve({
      user: { id: 'demo-1', email: 'demo@test.com', name: 'Explorer', username: 'explorer', xp: 0, level: 1, streak: 0, isDemo: true, createdAt: new Date().toISOString(), settings: { notifications: true } },
      token: 'mock-demo-token',
    })),
    register: vi.fn(),
    me: vi.fn(),
    updateProfile: vi.fn(),
  },
  progressApi: { complete: vi.fn(), get: vi.fn(), heatmap: vi.fn() },
  leaderboardApi: { get: vi.fn(), getProfile: vi.fn() },
  achievementsApi: { getAll: vi.fn(), getMine: vi.fn() },
  settingsApi: { get: vi.fn(), update: vi.fn(), deleteAccount: vi.fn() },
  levelsApi: { getAll: vi.fn(), getOne: vi.fn() },
  reportsApi: { submit: vi.fn() },
}));

function renderWithRouter(ui: React.ReactNode) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('renders the login form with email and password inputs', () => {
    renderWithRouter(<LoginPage />);
    expect(document.getElementById('login-email')).toBeInTheDocument();
    expect(document.getElementById('login-password')).toBeInTheDocument();
  });

  it('renders social login buttons', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Microsoft/i)).toBeInTheDocument();
  });

  it('shows demo mode button', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText(/Try Demo/i)).toBeInTheDocument();
  });

  it('allows typing in email and password fields', () => {
    renderWithRouter(<LoginPage />);
    const emailInput = document.getElementById('login-email')!;
    const passwordInput = document.getElementById('login-password')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('disables submit button or shows loading during login', () => {
    renderWithRouter(<LoginPage />);
    const emailInput = document.getElementById('login-email')!;
    const passwordInput = document.getElementById('login-password')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(useAuthStore.getState().isLoading || screen.getByText(/signing in/i)).toBeTruthy();
  });

  it('demo button calls loginAsDemo', async () => {
    renderWithRouter(<LoginPage />);
    fireEvent.click(screen.getByText(/Try Demo/i));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    }, { timeout: 10000 });
    expect(useAuthStore.getState().user?.isDemo).toBe(true);
  });

  it('has link to register page', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });
});
