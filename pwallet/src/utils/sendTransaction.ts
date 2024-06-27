import { ethers } from 'ethers';
import { CHAINS_CONFIG , ChainKey} from './chains';

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
  gasPrice: string;
  total: string;
  status: number | null;
}

const Receipt: Receipt | null = null;

export async function sendTransaction(
  seedPhrase: string, 
  sendToAddress: string, 
  amountToSend: string,
  selectedChain: ChainKey,
) {
  try {
    const chain: ChainConfig = CHAINS_CONFIG[selectedChain];
    if (!chain) {
      throw new Error(`Unsupported chain: ${selectedChain}`);
    }

    const provider = ethers.getDefaultProvider(chain.rpcUrl);
    const wallet = ethers.Wallet.fromPhrase(seedPhrase).connect(provider);
    // const tokenAddress = new ethers.Contract(tokenAddress, wallet);
    const amountInWei = ethers.parseUnits(amountToSend);

    const tx = {
      to: sendToAddress,
      value: amountInWei,
    };

    const txResponse = await wallet.sendTransaction(tx);

    console.log('Transaction Response:', txResponse);

    const txReceipt = await txResponse.wait();
    
    console.log('Transaction Receipt:', txReceipt);
    
    if (txReceipt) {
      return {
        hash: txReceipt.hash, 
        to: txReceipt.to, 
        from: txReceipt.from,
        gasPrice: parseFloat(ethers.formatEther(txReceipt.fee)).toFixed(4),
        total: (parseFloat(ethers.formatEther(txReceipt.fee)) + parseFloat(amountToSend)).toFixed(4),
        status: txReceipt.status
      };
    } else {
      throw new Error('Transaction receipt is null.');
    }
  }
  catch (error) {
    console.error('Error sending transaction:', error);
    return null;
  }
}