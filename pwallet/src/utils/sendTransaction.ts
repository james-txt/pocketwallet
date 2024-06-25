import { ethers } from 'ethers';

const VITE_INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const INFURA_URL = `https://sepolia.infura.io/v3/${VITE_INFURA_PROJECT_ID}`;

const provider = new ethers.JsonRpcProvider(INFURA_URL);

interface Receipt {
  hash: string;
  to: string | null;
  from: string;
  gasPrice: string;
  total: string;
  status: number | null;
}

let receipt: Receipt | null = null;

export async function sendTransaction(seedPhrase: string, sendToAddress: string, amountToSend: string) {
  try {
    const wallet = ethers.Wallet.fromPhrase(seedPhrase).connect(provider);
    const amountInWei = ethers.parseEther(amountToSend);

    const tx = {
      to: sendToAddress,
      value: amountInWei,
    };

    const txResponse = await wallet.sendTransaction(tx);

    console.log('Transaction Response:', txResponse);

    const txReceipt = await txResponse.wait();

    console.log('Transaction Receipt:', txReceipt);

    if (txReceipt !== null) {
      const txGasPrice = parseFloat(ethers.formatEther(txReceipt.fee)).toFixed(4);
      const txTotal = (parseFloat(ethers.formatEther(txReceipt.fee)) + parseFloat(amountToSend)).toFixed(4);
    
      receipt = { 
        hash: txReceipt.hash, 
        to: txReceipt.to, 
        from: txReceipt.from,
        gasPrice: txGasPrice,
        total: txTotal,
        status: txReceipt.status
      };
      return receipt;
    } else {
      throw new Error('Transaction receipt is null.');
    }
  } catch (error) {
    // Handle the error here
    console.error(error);
  }
}