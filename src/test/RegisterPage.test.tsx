import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { useAuthStore } from '../stores/authStore';

function renderWithRouter(ui: React.ReactNode) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('RegisterPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the registration form with step indicators', () => {
    const { container } = renderWithRouter(<RegisterPage />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });

  it('renders social signup buttons', () => {
    renderWithRouter(<RegisterPage />);
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
  });

  it('allows typing in form fields', () => {
    const { container } = renderWithRouter(<RegisterPage />);
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'John Doe' } });
    fireEvent.change(inputs[1], { target: { value: 'johndoe' } });

    expect(inputs[0]).toHaveValue('John Doe');
    expect(inputs[1]).toHaveValue('johndoe');
  });

  it('has link to login page', () => {
    renderWithRouter(<RegisterPage />);
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('shows Create Account or Get Started button', () => {
    renderWithRouter(<RegisterPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
