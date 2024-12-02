import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import NftCard from "../src/components/NftCard";

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

// Mock sendNftTransaction utility
vi.mock("../src/utils/sendNftTransaction", () => ({
  sendNftTransaction: vi.fn()
}));

// Mock useGasPrice hook
vi.mock("../src/utils/useGasPrice", () => ({
  useGasPrice: vi.fn().mockReturnValue({
    gasPrice: "0.00001",
    isFetchingGasPrice: false
  })
}));

// Define mock data types
type Nfts = {
  tokenAddress: string;
  tokenId: string;
  amount: number;
  contractType: "ERC721" | "ERC721A" | "ERC1155";
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
};

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
const mockNft: Nfts = {
  tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
  tokenId: "123",
  amount: 1,
  contractType: "ERC721",
  metadata: {
    name: "Test NFT",
    description: "A test NFT for unit testing",
    image: "ipfs://testnftimage/0.png",
    attributes: [
      { trait_type: "Color", value: "Blue" },
      { trait_type: "Rarity", value: "Rare" }
    ]
  }
};

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
  balance_formatted: "100.00",
  native_token: false,
};

const mockSeedPhrase = "test seed phrase";
const TEST_CHAIN_KEY = "0x1";

describe("NftCard", () => {
  // Provide mock implementations for hooks and props
  const mockRefetchBalances = vi.fn();
  const mockCloseModal = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockRefetchBalances.mockClear();
    mockCloseModal.mockClear();
    vi.clearAllMocks();
  });

  it("renders NFT information correctly", () => {
    render(
      <NftCard
        nft={mockNft}
        token={mockToken}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Check NFT details are rendered
    const nftnames = screen.getAllByText("Test NFT");
    expect(nftnames).toHaveLength(2);
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("A test NFT for unit testing")).toBeInTheDocument();
    expect(screen.getByText("0x1234567890abcdef1234567890abcdef12345678")).toBeInTheDocument();

    // Check NFT image is rendered
    const image = screen.getByAltText("Test NFT");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'ipfs://testnftimage/0.png');
    
    // Check attributes are rendered
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Rarity")).toBeInTheDocument();
    expect(screen.getByText("Rare")).toBeInTheDocument();
  });

  it("handles transaction input and validation for ERC721", async () => {
    render(
      <NftCard
        nft={mockNft}
        token={mockToken}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Open send modal
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

    // Amount should be fixed to 1 for ERC721
    expect(amountInput).toBeDisabled();
    expect(amountInput).toHaveValue(1);
  });

  it("handles transaction input and validation for ERC1155", async () => {
    const mockERC1155Nft: Nfts = {
      ...mockNft,
      contractType: "ERC1155",
      amount: 10
    };

    render(
      <NftCard
        nft={mockERC1155Nft}
        token={mockToken}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Open send modal
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

    // Enter valid amount for ERC1155
    fireEvent.change(amountInput, {
      target: { value: "5" },
    });

    // Wait and find the send button within the modal
    await waitFor(() => {
      const modalSendButton = screen.getAllByText("Send").find(
        button => button.closest('[role="dialog"]') !== null
      );
      
      expect(modalSendButton).not.toBeDisabled();
    });
  });

  it("disables send button for invalid inputs", async () => {
    render(
      <NftCard
        nft={mockNft}
        token={mockToken}
        seedPhrase={mockSeedPhrase}
        selectedChain={TEST_CHAIN_KEY}
        refetchBalances={mockRefetchBalances}
        closeModal={mockCloseModal}
      />
    );

    // Open send modal
    fireEvent.click(screen.getByText("Send"));

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Recipient's address")).toBeInTheDocument();
    });

    // Get input elements
    const recipientInput = screen.getByPlaceholderText("Recipient's address");

    // Enter invalid recipient address
    fireEvent.change(recipientInput, {
      target: { value: "invalid address" },
    });

    // Wait and find the send button within the modal
    await waitFor(() => {
      const modalSendButton = screen.getAllByText("Send").find(
        button => button.closest('[role="dialog"]') !== null
      );
      
      expect(modalSendButton).toBeDisabled();
    });
  });
});