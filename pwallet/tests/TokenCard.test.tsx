import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import TokenCard from "../src/components/TokenCard";
import { ChainKey } from "../src/utils/chains";

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the entire chains module to match the actual implementation
vi.mock("../src/utils/chains", () => ({
  CHAINS_CONFIG: {
    '0x1': {
      hex: '0x1',
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/test-project-id',
      symbol: 'ETH',
      scanUrl: 'https://etherscan.io/tx/',
    },
  },
  ChainKey: vi.fn(),
}));

// Define Token Type
type Token = {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_price: number;
  usd_price_24hr_percent_change: number;
  usd_price_24hr_usd_change: number;
  usd_value_24hr_usd_change: number;
  usd_value: number;
  portfolio_percentage: number;
  balance_formatted: string;
  native_token: boolean;
};

// Mock Data
const mockToken: Token = {
  token_address: "0x1234...",
  name: "Test Token",
  symbol: "TEST",
  logo: "test-logo-url",
  thumbnail: "test-thumbnail-url",
  decimals: 18,
  balance: "100",
  possible_spam: false,
  verified_contract: true,
  usd_price: 1.23,
  usd_price_24hr_percent_change: 0.5,
  usd_price_24hr_usd_change: 0.1,
  usd_value_24hr_usd_change: 0.2,
  usd_value: 123,
  portfolio_percentage: 10,
  balance_formatted: "100.00", // Updated to match test expectation
  native_token: false,
};

// Mock hooks and other dependencies
vi.mock("../hooks/fetchGasPrice", () => ({
  fetchGasPrice: vi.fn().mockResolvedValue("0.00001")
}));

const mockLogoUrls = {
  ETH: "https://example.com/eth-logo.png",
};

const mockSeedPhrase = "test seed";
const TEST_CHAIN_KEY = "0x1" as ChainKey;

describe("TokenCard", () => {
  // Provide mock implementations for any hooks or context providers
  const mockRefetchBalances = vi.fn();
  const mockCloseModal = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockRefetchBalances.mockClear();
    mockCloseModal.mockClear();
  });

  it("renders token information correctly", () => {
    render(
      <TokenCard
        token={mockToken}
        logoUrls={mockLogoUrls}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    expect(screen.getByText("100.0000 TEST")).toBeInTheDocument();
    expect(screen.getByText("$123.00")).toBeInTheDocument();
  });

  it("handles transaction input and validation", async () => {
    render(
      <TokenCard
        token={mockToken}
        logoUrls={mockLogoUrls}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Simulate opening send modal
    const sendButton = screen.getByText("Send");
    fireEvent.click(sendButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Recipient's address")).toBeInTheDocument();
    });

    // Get input elements
    const recipientInput = screen.getByPlaceholderText("Recipient's address");
    const amountInput = screen.getByPlaceholderText("Amount to send");

    // Enter valid recipient address
    fireEvent.change(recipientInput, {
      target: { value: "0x9876543210987654321098765432109876543210" },
    });

    // Enter valid amount (less than balance)
    fireEvent.change(amountInput, {
      target: { value: "50" },
    });

    // Wait and find the send button within the modal
    await waitFor(() => {
      const modalSendButton = screen.getAllByText("Send").find(
        button => button.closest('[role="dialog"]') !== null
      );
      
      console.log('Modal Send Button:', modalSendButton);
      console.log('Button Disabled:', modalSendButton?.hasAttribute('disabled'));
      
      expect(modalSendButton).not.toBeDisabled();
    });
  });

  it("disables send button for invalid inputs", async () => {
    render(
      <TokenCard
        token={mockToken}
        logoUrls={mockLogoUrls}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Simulate opening send modal
    fireEvent.click(screen.getByText("Send"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Recipient's address")).toBeInTheDocument();
    });

    // Get input elements
    const recipientInput = screen.getByPlaceholderText("Recipient's address");
    const amountInput = screen.getByPlaceholderText("Amount to send");

    // Enter invalid recipient address
    fireEvent.change(recipientInput, {
      target: { value: "invalid address" },
    });

    // Enter amount exceeding balance
    fireEvent.change(amountInput, {
      target: { value: "200" },
    });

    // Wait and find the send button within the modal
    await waitFor(() => {
      const modalSendButton = screen.getAllByText("Send").find(
        button => button.closest('[role="dialog"]') !== null
      );
      
      console.log('Invalid Inputs - Modal Send Button:', modalSendButton);
      console.log('Button Disabled:', modalSendButton?.hasAttribute('disabled'));
      
      expect(modalSendButton).toBeDisabled();
    });
  });
});