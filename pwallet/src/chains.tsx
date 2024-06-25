// Define the type for the chain configuration
export interface ChainConfig {
  hex: string;
  name: string;
  rpcUrl: string;
  ticker: string;
}

// Define the type for the keys of CHAINS_CONFIG
export type ChainKey = '0x1' | '0xaa36a7' | '0x89' | '0x13882' | '0xa' | '0xa86a';

export const CHAINS_CONFIG: Record<ChainKey, ChainConfig> = {
  '0x1': {
    hex: '0x1',
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
    ticker: 'ETH',
  },
  '0xaa36a7': {
    hex: '0xaa36a7',
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
    ticker: 'ETH',
  },
  '0x89': {
    hex: '0x89',
    name: 'Polygon',
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
    ticker: 'MATIC',
  },
  '0x13882': {
    hex: '0x13882',
    name: 'Polygon',
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
    ticker: 'MATIC',
  },
  '0xa': {
    hex: '0xa',
    name: 'Optimism',
    rpcUrl: 'https://optimism-mainnet.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
    ticker: 'OP',
  },
  '0xa86a': {
      hex: '0xa86a',
      name: 'Avalanche',
      rpcUrl: 'https://avalanche-mainnet.infura.io/v3/1baf67a323d34c5b8762244e4b8b5c36',
      ticker: 'AVAX',
    }
  }

