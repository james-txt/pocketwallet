import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Wallet } from 'ethers';
import nock from 'nock';
import CreateAccount from '../src/components/CreateAccount';
import '@testing-library/jest-dom';

// Mock the chrome.runtime API
const mockChrome = {
  runtime: {
    sendMessage: vi.fn(),
    lastError: null,
  },
};
vi.stubGlobal('chrome', mockChrome);

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateAccount', () => {
  const mockSetSeedPhrase = vi.fn();
  const mockSetWallet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CreateAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
    expect(screen.getByText('Generate Seed Phrase')).toBeInTheDocument();
  });

  it('generates a seed phrase when the button is clicked', async () => {
    const mockSeedPhrase = 'test test test test test test test test test test test junk';
    vi.spyOn(Wallet, 'createRandom').mockReturnValue({
      mnemonic: { phrase: mockSeedPhrase },
    } as any);

    render(
      <MemoryRouter>
        <CreateAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
    
    const generateButton = screen.getByText('Generate Seed Phrase');
    fireEvent.click(generateButton);

    await waitFor(() => {
      const seedPhraseWords = screen.getAllByText(/test|junk/);
      expect(seedPhraseWords).toHaveLength(12);
    });
  });

  it('sets wallet and mnemonic when "Open Your New Wallet!" is clicked', async () => {
    const mockSeedPhrase = 'test test test test test test test test test test test junk';
    const mockWallet = {
      address: '0x1234567890123456789012345678901234567890',
    };

    vi.spyOn(Wallet, 'createRandom').mockReturnValue({
      mnemonic: { phrase: mockSeedPhrase },
    } as any);

    vi.spyOn(Wallet, 'fromPhrase').mockReturnValue(mockWallet as any);

    render(
      <MemoryRouter>
        <CreateAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );

    const generateButton = screen.getByText('Generate Seed Phrase');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Open Your New Wallet!')).toBeInTheDocument();
    });

    const openWalletButton = screen.getByText('Open Your New Wallet!');
    fireEvent.click(openWalletButton);

    await waitFor(() => {
      expect(mockSetSeedPhrase).toHaveBeenCalledWith(mockSeedPhrase);
      expect(mockSetWallet).toHaveBeenCalledWith(mockWallet.address);
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith(
        { action: 'storeSeedPhrase', seedPhrase: mockSeedPhrase },
        expect.any(Function)
      );
    });
  });

  it('navigates to /yourwallet after successful storage', async () => {
    const mockSeedPhrase = 'test test test test test test test test test test test junk';

    vi.spyOn(Wallet, 'createRandom').mockReturnValue({
      mnemonic: { phrase: mockSeedPhrase },
    } as any);

    vi.spyOn(Wallet, 'fromPhrase').mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
    } as any);

    mockChrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({ success: true });
    });

    render(
      <MemoryRouter>
        <CreateAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );

    const generateButton = screen.getByText('Generate Seed Phrase');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Open Your New Wallet!')).toBeInTheDocument();
    });

    const openWalletButton = screen.getByText('Open Your New Wallet!');
    fireEvent.click(openWalletButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/yourwallet');
    });
  });

  it('handles errors when setting wallet and seed phrase', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(Wallet, 'createRandom').mockReturnValue({
      mnemonic: { phrase: 'invalid phrase' },
    } as any);

    vi.spyOn(Wallet, 'fromPhrase').mockImplementation(() => {
      throw new Error('Invalid mnemonic');
    });

    render(
      <MemoryRouter>
        <CreateAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );

    const generateButton = screen.getByText('Generate Seed Phrase');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Open Your New Wallet!')).toBeInTheDocument();
    });

    const openWalletButton = screen.getByText('Open Your New Wallet!');
    fireEvent.click(openWalletButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error setting wallet and seed phrase:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});