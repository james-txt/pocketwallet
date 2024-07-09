import { ethers } from 'ethers';
import { CHAINS_CONFIG, ChainKey } from './chains';

interface ChainConfig {
  hex: string;
  name: string;
  rpcUrl: string;
  symbol: string;
}

interface Receipt {
  hash: string;
  to: string | null;
  from: string;
  txFee: string;
  amount: string;
  status: number | null;
}

const Receipt: Receipt | null = null;

export async function sendNftTransaction(
  seedPhrase: string,
  sendToAddress: string,
  amountToSend: string, // Amount is only for ERC-1155
  selectedChain: ChainKey,
  nft: { tokenAddress: string, contractType: 'ERC721' | 'ERC721A' | 'ERC1155', tokenId: string }
): Promise<Receipt | null> {
  try {
    const chain: ChainConfig = CHAINS_CONFIG[selectedChain];
    if (!chain) {
      throw new Error(`Unsupported chain: ${selectedChain}`);
    }

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const wallet = ethers.Wallet.fromPhrase(seedPhrase).connect(provider);

    let txResponse;
    let transferAmount: string | null = null;

    const tokenContract = new ethers.Contract(nft.tokenAddress, [
      // Common ERC functions
      "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) public",
      "function transferFrom(address from, address to, uint256 tokenId) public",
      "event Transfer(address indexed from, address indexed to, uint256 tokenId)",
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
    ], wallet);

    switch (nft.contractType) {
      case 'ERC721':
      case 'ERC721A':
        txResponse = await tokenContract.transferFrom(wallet.address, sendToAddress, nft.tokenId);
        break;

      case 'ERC1155': {
        if (!amountToSend) {
          throw new Error('Amount must be provided for ERC-1155 token transfers.');
        }
        
        txResponse = await tokenContract.safeTransferFrom(wallet.address, sendToAddress, nft.tokenId, ethers.toBigInt(amountToSend), '0x');
        transferAmount = amountToSend;
        break;
      }

      default:
        throw new Error(`Unsupported token type: ${nft.contractType}`);
    }

    console.log("Transaction Response:", txResponse);

    const txReceipt = await txResponse.wait();
    console.log('Transaction Receipt:', txReceipt);

    // Extract transfer event data for ERC-721 and ERC-721A
    let transferEvent;
    if (nft.contractType === 'ERC721' || nft.contractType === 'ERC721A') {
      const logs = await provider.getLogs({
        address: nft.tokenAddress,
        fromBlock: txReceipt.blockNumber,
        toBlock: txReceipt.blockNumber,
        topics: [ethers.id("Transfer(address,address,uint256)")],
      });

      transferEvent = logs
        .map((log: ethers.Log) => {
          try {
            return tokenContract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log) => log && log.name === 'Transfer');
    }

    const transferToAddress = nft.contractType === 'ERC721' || nft.contractType === 'ERC721A'
      ? transferEvent?.args.to || sendToAddress
      : sendToAddress;

      return {
        hash: txReceipt.hash,
        to: transferToAddress,
        from: txReceipt.from,
        txFee: parseFloat(ethers.formatEther(txReceipt.fee)).toFixed(5),
        amount: transferAmount || "0",
        status: txReceipt.status,
      };
    } catch (error) {
      console.error('Error sending token transaction:', error);
      return null;
    }
  }
