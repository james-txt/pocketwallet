import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import ViewWallet from "../src/components/ViewWallet";
import useFetchTokensAndNfts from "../src/hooks/useFetchTokensAndNfts";
import { ChainKey } from "../src/utils/chains";

// Mock the custom hook
vi.mock("../src/hooks/useFetchTokensAndNfts", () => ({
  default: vi.fn(),
}));

// Mock the components that are not directly tested
vi.mock("./Modal", () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="modal">{children}</div>
));
vi.mock("./NftCard", () => () => <div data-testid="nft-card">NftCard</div>);
vi.mock("./TokenCard", () => () => (
  <div data-testid="token-card">TokenCard</div>
));
vi.mock("./HistoryCard", () => () => (
  <div data-testid="history-card">HistoryCard</div>
));

const mockTokens = [
  {
    token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    name: "Ether",
    symbol: "ETH",
    logo: "https://cdn.moralis.io/eth/0x.png",
    thumbnail: "https://cdn.moralis.io/eth/0x_thumb.png",
    decimals: 18,
    balance: "9858362698317937",
    possible_spam: false,
    verified_contract: true,
    usd_price: null,
    usd_price_24hr_percent_change: null,
    usd_price_24hr_usd_change: null,
    usd_value_24hr_usd_change: null,
    usd_value: null,
    portfolio_percentage: 0,
    balance_formatted: "0.009858362698317937",
    native_token: true,
    total_supply: null,
    total_supply_formatted: null,
    percentage_relative_to_total_supply: null,
  },
  {
    token_address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
    name: "ChainLink Token",
    symbol: "LINK",
    logo: "",
    thumbnail: "",
    decimals: 18,
    balance: "1000000000000000000",
    possible_spam: false,
    verified_contract: false,
    usd_price: null,
    usd_price_24hr_percent_change: null,
    usd_price_24hr_usd_change: null,
    usd_value_24hr_usd_change: null,
    usd_value: null,
    portfolio_percentage: 0,
    balance_formatted: "1",
    native_token: false,
    total_supply: "1000000000000000000000000000",
    total_supply_formatted: "1000000000",
    percentage_relative_to_total_supply: 1e-7,
  },
];

const mockNfts = [
  {
    chain: "0xaa36a7",
    contractType: "ERC721",
    tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
    tokenId: "70",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/70",
    metadata: {
      name: "Azuki #70",
      description: "",
      image: "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/70.png",
      attributes: [
        {
          trait_type: "Type",
          value: "Human",
        },
        {
          trait_type: "Hair",
          value: "Teal Bun",
        },
        {
          trait_type: "Neck",
          value: "Tribal Tattoo",
        },
        {
          trait_type: "Clothing",
          value: "Red Floral Kimono",
        },
        {
          trait_type: "Eyes",
          value: "Determined",
        },
        {
          trait_type: "Mouth",
          value: "Lipstick",
        },
        {
          trait_type: "Offhand",
          value: "Banner",
        },
        {
          trait_type: "Background",
          value: "Off White B",
        },
      ],
    },
    name: "Azuki",
    symbol: "Azuki",
    amount: 1,
    blockNumber: "6462871",
    ownerOf: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
    tokenHash: "29d53089e5adde5893772a21a7c6be75",
    lastMetadataSync: "2024-09-20T21:03:37.647Z",
    lastTokenUriSync: "2024-09-20T21:03:37.624Z",
    possibleSpam: false,
  },
  {
    chain: "0xaa36a7",
    contractType: "ERC1155",
    tokenAddress: "0x68a26793bc3175930b81f02b9fda0cde47175159",
    tokenId: "0",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/Qmf3iMVcsrx6kXCCD4CW2NNhznn7YvR8NBkaxszfbtPCZm/0",
    metadata: {
      name: "token-name-0",
      description: "this is example nft token no.0",
      image: "ipfs://QmZY3rt3SVyLu4w7GF14yPbwJLbeBdcCJsD4YwhpMg1qek/0.png",
      attributes: [],
    },
    name: "Example NFT",
    symbol: "EXNFT",
    amount: 1,
    blockNumber: "123456",
    ownerOf: "0x1234567890abcdef1234567890abcdef12345678",
    tokenHash:
      "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    lastMetadataSync: "2024-09-20T21:03:37.647Z",
    lastTokenUriSync: "2024-09-20T21:03:37.624Z",
    possibleSpam: false,
  },
];

const mockHistorys = [
  {
    blockNumber: "6462871",
    blockTimestamp: "2024-08-08T21:12:00.000Z",
    blockHash:
      "0x4e0386079a93e90214e208ac5401de3beb24073cb7f76dcbb2f527c0b076b615",
    transactionHash:
      "0x9b0a8fb4844af8a351a70aa2136b36f3fbf28263cff89c2169fd66eecdf4d0b0",
    transactionIndex: 95,
    logIndex: 198,
    value: "0",
    contractType: "ERC721",
    transactionType: "Single",
    tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
    tokenId: "70",
    fromAddressEntity: null,
    fromAddressEntityLogo: null,
    fromAddress: "0x887e3db0d16807730fa40619c70c4846a79ca854",
    fromAddressLabel: null,
    toAddressEntity: null,
    toAddressEntityLogo: null,
    toAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
    toAddressLabel: null,
    amount: 1,
    verified: 1,
    possibleSpam: false,
    verifiedCollection: false,
    chain: "0xaa36a7",
    tokenDecimals: "18",
    tokenName: "Azuki",
    tokenSymbol: "AZUKI",
    valueDecimal: "0",
  },
  {
    blockNumber: "6462858",
    blockTimestamp: "2024-08-08T21:08:48.000Z",
    blockHash:
      "0x81b2347dea1ece9f91217a37924726657e064305c05320b270a31de9bc8dda1b",
    transactionHash:
      "0x3eca5bf08470b7b36e20767799d97cab926ed5387bde9ab6a0f46f12b887db79",
    transactionIndex: 97,
    logIndex: 463,
    value: "0",
    contractType: "ERC721",
    transactionType: "Single",
    tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
    tokenId: "70",
    fromAddressEntity: null,
    fromAddressEntityLogo: null,
    fromAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
    fromAddressLabel: null,
    toAddressEntity: null,
    toAddressEntityLogo: null,
    toAddress: "0x887e3db0d16807730fa40619c70c4846a79ca854",
    toAddressLabel: null,
    amount: 1,
    verified: 1,
    possibleSpam: false,
    verifiedCollection: false,
    chain: "0xaa36a7",
    tokenDecimals: "18",
    tokenName: "Azuki",
    tokenSymbol: "AZUKI",
    valueDecimal: "0",
  },
];

const TEST_CHAIN_KEY = "0x1" as ChainKey;

describe("ViewWallet", () => {
  beforeEach(() => {
    vi.mocked(useFetchTokensAndNfts).mockReturnValue({
      tokens: mockTokens,
      nfts: mockNfts,
      historys: mockHistorys,
      fetching: false,
      logoUrls: {},
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <ViewWallet
          wallet="0x123"
          seedPhrase="test seed"
          selectedChain={TEST_CHAIN_KEY}
        />
      </MemoryRouter>
    );
    const elements = await screen.findAllByText("$0.00");
    expect(elements).toHaveLength(5);
  });

  it("displays tokens correctly", () => {
    render(
      <MemoryRouter>
        <ViewWallet
          wallet="0x123"
          seedPhrase="test seed"
          selectedChain={TEST_CHAIN_KEY}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Ether")).toBeInTheDocument();
    expect(screen.getByText("ChainLink Token")).toBeInTheDocument();
  });

  it("switches to NFT tab and displays NFTs", async () => {
    render(
      <MemoryRouter>
        <ViewWallet
          wallet="0x123"
          seedPhrase="test seed"
          selectedChain={TEST_CHAIN_KEY}
        />
      </MemoryRouter>
    );

    const nftTab = screen.getByTestId("nft-tab");
    fireEvent.click(nftTab);

    await waitFor(() => {
      expect(screen.getByText("Azuki #70")).toBeInTheDocument();
      expect(screen.getByText("token-name-0")).toBeInTheDocument();
    });
  });

  it("switches to History tab and displays transactions", async () => {
    render(
      <MemoryRouter>
        <ViewWallet
          wallet="0x123"
          seedPhrase="test seed"
          selectedChain={TEST_CHAIN_KEY}
        />
      </MemoryRouter>
    );

    const historyTab = screen.getByTestId("history-tab");
    fireEvent.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText("Recent Activity")).toBeInTheDocument();
      const dateElements = screen.getAllByText("Thu, Aug 8, 2024");
      expect(dateElements).toHaveLength(1);
      const transactionButtons = screen.getAllByRole("button");
      expect(transactionButtons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
