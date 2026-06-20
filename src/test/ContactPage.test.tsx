import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from '../pages/ContactPage';

function renderWithRouter(ui: React.ReactNode) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('ContactPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the contact form with input fields', () => {
    const { container } = renderWithRouter(<ContactPage />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a textarea for the message', () => {
    const { container } = renderWithRouter(<ContactPage />);
    const textareas = container.querySelectorAll('textarea');
    expect(textareas.length).toBeGreaterThanOrEqual(1);
  });

  it('renders a submit button', () => {
    renderWithRouter(<ContactPage />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('allows typing in name field', () => {
    renderWithRouter(<ContactPage />);
    const nameInput = screen.getByPlaceholderText('John Doe');
    fireEvent.change(nameInput, { target: { value: 'John' } });
    expect(nameInput).toHaveValue('John');
  });

  it('allows typing in email field', () => {
    renderWithRouter(<ContactPage />);
    const emailInput = screen.getByPlaceholderText('john@example.com');
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    expect(emailInput).toHaveValue('john@test.com');
  });
});
