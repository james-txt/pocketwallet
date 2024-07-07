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

export async function sendTransaction(
  seedPhrase: string,
  sendToAddress: string,
  amountToSend: string,
  selectedChain: ChainKey,
  token: { token_address: string, native_token: boolean }
): Promise<Receipt | null> {
  try {
    const chain: ChainConfig = CHAINS_CONFIG[selectedChain];
    if (!chain) {
      throw new Error(`Unsupported chain: ${selectedChain}`);
    }

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const wallet = ethers.Wallet.fromPhrase(seedPhrase).connect(provider);
    const amountInWei = ethers.parseUnits(amountToSend, 18);

    let txResponse;
    let transferToAddress: string | null = null;
    let transferAmount: string | null = null;

    if (token.native_token) {
      // Send native token transaction
      txResponse = await wallet.sendTransaction({
        to: sendToAddress,
        value: amountInWei,
      });
    } else {
      // Send ERC-20 token transaction
      const tokenContract = new ethers.Contract(token.token_address, [
        "function transfer(address to, uint amount) public returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ], wallet);

      txResponse = await tokenContract.transfer(sendToAddress, amountInWei);
    }

    console.log("Transaction Response:", txResponse);

    const txReceipt = await txResponse.wait();
    console.log('Transaction Receipt:', txReceipt);

    if (!token.native_token) {
      // Fetch logs for ERC-20 token transaction
      const filter = {
        address: token.token_address,
        fromBlock: txReceipt.blockNumber,
        toBlock: txReceipt.blockNumber,
        topics: [ethers.id("Transfer(address,address,uint256)")],
      };

      const logs = await provider.getLogs(filter);
      const tokenContract = new ethers.Contract(token.token_address, [
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ], wallet);

      const transferEvent = logs
        .map((log: ethers.Log) => {
          try {
            return tokenContract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log) => log && log.name === 'Transfer');

      if (transferEvent) {
        transferToAddress = transferEvent.args.to;
        transferAmount = ethers.formatUnits(transferEvent.args.value, 18);
        console.log(`Transfer event: 
        from ${transferEvent.args.from} 
        to ${transferEvent.args.to} 
        value ${ethers.formatUnits(transferEvent.args.value, 18)}`);
      } else {
        console.warn('Transfer event not found in logs.');
      }
    }


    return {
      hash: txReceipt.hash,
      to: transferToAddress || txReceipt.to,
      from: txReceipt.from,
      txFee: parseFloat(ethers.formatEther(txReceipt.fee)).toFixed(5),
      amount: transferAmount || parseFloat(ethers.formatEther(txResponse.value + txReceipt.fee)).toFixed(5),
      status: txReceipt.status,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    return null;
  }
}
