import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChainSelector from '../src/components/ChainSelector';
import '@testing-library/jest-dom';

// Mock the image imports
vi.mock('../assets/arb.png', () => ({ default: 'arb.png' }));
vi.mock('../assets/avax.png', () => ({ default: 'avax.png' }));
vi.mock('../assets/eth.png', () => ({ default: 'eth.png' }));
vi.mock('../assets/matic.png', () => ({ default: 'matic.png' }));
vi.mock('../assets/op.png', () => ({ default: 'op.png' }));
vi.mock('../assets/test.png', () => ({ default: 'test.png' }));

describe('ChainSelector', () => {
  const mockSetSelectedChain = vi.fn();

  it('renders with the correct initial value', () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    expect(screen.getByRole('combobox')).toHaveValue('0x1');
  });

  it('displays the correct tooltip content', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    fireEvent.mouseEnter(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByText('Ethereum Mainnet')).toBeInTheDocument();
    });
  });

  it('opens the dropdown when clicked', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByText('Sepolia Testnet')).toBeInTheDocument();
      expect(screen.getByText('Amoy Testnet')).toBeInTheDocument();
      expect(screen.getByText('Polygon Mainnet')).toBeInTheDocument();
      expect(screen.getByText('Avalanche Mainnet')).toBeInTheDocument();
      expect(screen.getByText('Arbitrum Mainnet')).toBeInTheDocument();
      expect(screen.getByText('Optimism Mainnet')).toBeInTheDocument();
    });
  });

  it('calls setSelectedChain with the correct value when a new chain is selected', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Polygon Mainnet'));
    });
    expect(mockSetSelectedChain).toHaveBeenCalledWith('0x89');
  });

  it('renders the correct logo for each chain', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByAltText('ethLogo')).toHaveAttribute('src', 'eth.png');
      expect(screen.getByAltText('maticLogo')).toHaveAttribute('src', 'matic.png');
      expect(screen.getByAltText('avaxLogo')).toHaveAttribute('src', 'avax.png');
      expect(screen.getByAltText('arbLogo')).toHaveAttribute('src', 'arb.png');
      expect(screen.getByAltText('opLogo')).toHaveAttribute('src', 'op.png');
    });
  });
});