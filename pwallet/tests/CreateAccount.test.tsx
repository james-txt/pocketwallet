import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CreateAccount from '../src/components/CreateAccount';


describe('CreateAccount Component', () => {
  it('renders the initial UI correctly', () => {
    render(
      <MemoryRouter>
    <CreateAccount setSeedPhrase={() => {}} setWallet={() => {}} />
      </MemoryRouter>
      );
    
    expect(screen.getByText(/WARNING/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Seed Phrase/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Your New Wallet!/i)).toBeInTheDocument();
  });
});
