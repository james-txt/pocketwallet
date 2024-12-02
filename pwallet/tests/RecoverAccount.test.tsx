import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Wallet } from 'ethers';
import RecoverAccount from '../src/components/RecoverAccount';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock chrome.runtime API
const mockChrome = {
  runtime: {
    sendMessage: vi.fn(),
  },
};
vi.stubGlobal('chrome', mockChrome);

describe('RecoverAccount', () => {
  const mockSetSeedPhrase = vi.fn();
  const mockSetWallet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <RecoverAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Type your seed phrase in the field below to recover your wallet./)).toBeInTheDocument();
  });

  it('disables the Recover Wallet button when input is invalid', () => {
    render(
      <MemoryRouter>
        <RecoverAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
    const recoverButton = screen.getByText('Recover Wallet');
    expect(recoverButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Type your seed phrase here');
    fireEvent.change(input, { target: { value: 'invalid seed phrase' } });
    expect(recoverButton).toBeDisabled();
  });

  it('enables the Recover Wallet button when input is valid', () => {
    render(
      <MemoryRouter>
        <RecoverAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
    const recoverButton = screen.getByText('Recover Wallet');
    const input = screen.getByPlaceholderText('Type your seed phrase here');
    fireEvent.change(input, { target: { value: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12' } });
    expect(recoverButton).not.toBeDisabled();
  });

  it('recovers wallet and navigates on valid seed phrase', async () => {
    const mockWallet = {
      address: '0x1234567890123456789012345678901234567890',
    };
    vi.spyOn(Wallet, 'fromPhrase').mockReturnValue(mockWallet as any);

    render(
      <MemoryRouter>
        <RecoverAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Type your seed phrase here');
    const validSeed = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';
    fireEvent.change(input, { target: { value: validSeed } });

    const recoverButton = screen.getByText('Recover Wallet');
    fireEvent.click(recoverButton);

    await waitFor(() => {
      expect(mockSetSeedPhrase).toHaveBeenCalledWith(validSeed);
      expect(mockSetWallet).toHaveBeenCalledWith(mockWallet.address);
      expect(mockChrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'storeSeedPhrase',
        seedPhrase: validSeed,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/yourwallet');
    });
  });

  it('shows error message on invalid seed phrase', async () => {
    vi.spyOn(Wallet, 'fromPhrase').mockImplementation(() => {
      throw new Error('Invalid mnemonic');
    });
  
    render(
      <MemoryRouter>
        <RecoverAccount setSeedPhrase={mockSetSeedPhrase} setWallet={mockSetWallet} />
      </MemoryRouter>
    );
  
    const input = screen.getByPlaceholderText('Type your seed phrase here');
    const invalidSeed = 'invalid seed phrase word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11';
    fireEvent.change(input, { target: { value: invalidSeed } });
  
    const recoverButton = screen.getByText('Recover Wallet');
    fireEvent.click(recoverButton);
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.queryByText(/invalid seed phrase/i)).toBeInTheDocument();
    });
  
    expect(mockSetSeedPhrase).not.toHaveBeenCalled();
    expect(mockSetWallet).not.toHaveBeenCalled();
    expect(mockChrome.runtime.sendMessage).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});