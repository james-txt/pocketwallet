import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import ChainSelector from '../src/components/ChainSelector';
import '@testing-library/jest-dom';

vi.mock('../assets/arb.png', () => ({ default: 'mocked-arb.png' }));
vi.mock('../assets/avax.png', () => ({ default: 'mocked-avax.png' }));
vi.mock('../assets/eth.png', () => ({ default: 'mocked-eth.png' }));
vi.mock('../assets/base.png', () => ({ default: 'mocked-base.png' }));
vi.mock('../assets/matic.png', () => ({ default: 'mocked-matic.png' }));
vi.mock('../assets/op.png', () => ({ default: 'mocked-op.png' }));
vi.mock('../assets/test.png', () => ({ default: 'mocked-test.png' }));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn();
});

describe('ChainSelector', () => {
  const mockSetSelectedChain = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial selected chain', () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    expect(screen.getByAltText('Ethereum Mainnet logo')).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('changes the selected chain when a new option is selected', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    await waitFor(() => {
      const polygonOption = screen.getByRole('option', { name: /Polygon Mainnet/i });
      expect(polygonOption).toBeInTheDocument();
      return polygonOption;
    }).then((polygonOption) => userEvent.click(polygonOption));
    expect(mockSetSelectedChain).toHaveBeenCalledWith('0x89');
  });

  it('displays the correct tooltip content', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.hover(trigger);
    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: /Ethereum Mainnet/i })).toBeInTheDocument();
    });
  });

  it('renders secondary logo for testnet chains', () => {
    render(<ChainSelector selectedChain="0xaa36a7" setSelectedChain={mockSetSelectedChain} />);
    expect(screen.getByAltText('Sepolia Testnet logo')).toBeInTheDocument();
    expect(screen.getByAltText('Sepolia Testnet secondary logo')).toBeInTheDocument();
  });

  it('closes the dropdown when an option is selected', async () => {
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    await waitFor(() => {
      const polygonOption = screen.getByRole('option', { name: /Polygon Mainnet/i });
      expect(polygonOption).toBeInTheDocument();
      return polygonOption;
    }).then((polygonOption) => userEvent.click(polygonOption));
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  
  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ChainSelector selectedChain="0x1" setSelectedChain={mockSetSelectedChain} />);
    const trigger = screen.getByRole('combobox');
    await user.tab();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}'); 
    await waitFor(() => {
      expect(mockSetSelectedChain).toHaveBeenCalled();
    });
  });
  });