import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from '../src/components/Header';
import { ChainKey } from '../src/utils/chains';
import '@testing-library/jest-dom';

// Mock assets
vi.mock('../assets/logoSM.png', () => ({ default: 'logoSM.png' }));
vi.mock('@radix-ui/react-icons', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    CheckboxIcon: () => <div data-testid="checkbox-icon" />,
    CopyIcon: () => <div data-testid="copy-icon" />,
    LockClosedIcon: () => <div data-testid="lock-closed-icon" />,
    Cross1Icon: () => <div data-testid="cross1-icon" />,
    CaretSortIcon: () => <svg data-testid="caret-sort-icon" />,
  };
});

// Mock clipboard utility
const mockCopyToClipboard = vi.fn();
vi.mock('../src/utils/useClipboard', () => ({
  default: () => ({
    tooltipText: 'Copied!',
    copied: false,
    open: false,
    copyToClipboard: mockCopyToClipboard,
    setOpen: vi.fn(),
  }),
}));

// Mock ChainSelector component
vi.mock('../src/components/ChainSelector', () => ({
  default: ({ selectedChain, setSelectedChain }) => (
    <div data-testid="chain-selector">
      <span>{selectedChain}</span>
      <button onClick={() => setSelectedChain('0x89')}>Change Chain</button>
    </div>
  ),
}));

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

describe('Header', () => {
  const mockSetSelectedChain = vi.fn();
  const mockLockWallet = vi.fn();
  const mockLocation = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  };

  const defaultProps = {
    wallet: '0x1234567890123456789012345678901234567890',
    selectedChain: '0x1' as ChainKey,
    setSelectedChain: mockSetSelectedChain,
    lockWallet: mockLockWallet,
    location: mockLocation,
    navigate: mockNavigate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo on the home page', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByAltText('logoSM')).toBeInTheDocument();
  });

  it('renders the lock icon on the yourwallet page', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} location={{ ...mockLocation, pathname: '/yourwallet' }} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('lock-closed-icon')).toBeInTheDocument();
  });

  it('renders the cross icon on create and recover pages', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} location={{ ...mockLocation, pathname: '/create' }} />
        <Header {...defaultProps} location={{ ...mockLocation, pathname: '/recover' }} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('cross1-icon')).toHaveLength(2);
  });

  it('truncates the wallet address correctly', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('0x12...7890')).toBeInTheDocument();
  });

  it('calls copyToClipboard when the wallet address is clicked', async () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('0x12...7890'));
    
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(defaultProps.wallet);
    });
  });
  
  it('renders the ChainSelector component', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('chain-selector')).toBeInTheDocument();
  });

  it('calls setSelectedChain when the chain is changed', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Change Chain'));
    expect(mockSetSelectedChain).toHaveBeenCalledWith('0x89');
  });

  it('calls setSelectedChain when the chain is changed', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Change Chain'));
    expect(mockSetSelectedChain).toHaveBeenCalledWith('0x89');
  });

  it('calls navigate when the logo is clicked on the home page', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByAltText('logoSM'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not render wallet button when wallet is null', () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} wallet={null} />
      </MemoryRouter>
    );
    expect(screen.queryByText('0x12...7890')).not.toBeInTheDocument();
  });
});