const VITE_INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;

export const CHAINS_CONFIG = {
  '0x1': {
    hex: '0x1',
    name: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'ETH',
    scanUrl: 'https://etherscan.io/tx/',
  },
  '0xaa36a7': {
    hex: '0xaa36a7',
    name: 'Sepolia Testnet',
    rpcUrl: `https://sepolia.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'ETH',
    scanUrl: 'https://sepolia.etherscan.io/tx/',
  },
  '0x89': {
    hex: '0x89',
    name: 'Polygon Mainnet',
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'MATIC',
    scanUrl: 'https://polygonscan.com/tx/',
  },
  '0x13882': {
    hex: '0x13882',
    name: 'Amoy Testnet',
    rpcUrl: `https://polygon-amoy.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'MATIC',
    scanUrl: 'https://amoy.polygonscan.com/tx/',
  },  
  '0xa86a': {
    hex: '0xa86a',
    name: 'Avalanche Mainnet',
    rpcUrl: `https://avalanche-mainnet.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'AVAX',
    scanUrl: 'https://cchain.explorer.avax.network/tx/',
  },
  '0xa4b1': {
    hex: '0xa4b1',
    name: 'Arbitrum Mainnet',
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'ARB',
    scanUrl: 'https://arbiscan.io/tx/',
  },
  '0xa': {
    hex: '0xa',
    name: 'Optimism Mainnet',
    rpcUrl: `https://optimism-mainnet.infura.io/v3/${VITE_INFURA_PROJECT_ID}`,
    symbol: 'OP',
    scanUrl: 'https://optimistic.etherscan.io/tx/',
  }
} as const;

export type ChainKey = keyof typeof CHAINS_CONFIG;