import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../src/components/Home';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../src/assets/logo.png', () => ({
  default: 'mocked-logo-path',
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('pocket')).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-logo-path');
  });

  it('has a "Create a Wallet" button', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Create a Wallet')).toBeInTheDocument();
  });

  it('has a "Sign in With Seed Phrase" button', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign in With Seed Phrase')).toBeInTheDocument();
  });

  it('navigates to /create when "Create a Wallet" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const createButton = screen.getByText('Create a Wallet');
    fireEvent.click(createButton);
    expect(mockNavigate).toHaveBeenCalledWith('/create');
  });

  it('navigates to /recover when "Sign in With Seed Phrase" is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const recoverButton = screen.getByText('Sign in With Seed Phrase');
    fireEvent.click(recoverButton);
    expect(mockNavigate).toHaveBeenCalledWith('/recover');
  });

  it('displays the copyright notice', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('© 2024 pocket wallet™')).toBeInTheDocument();
  });
});