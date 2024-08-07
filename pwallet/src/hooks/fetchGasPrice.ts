import { ethers } from 'ethers';

export const fetchGasPrice = async (rpcUrl: string, gasLimit: number): Promise<string> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const latestGasPrice = await provider.getFeeData();
    return latestGasPrice.gasPrice ? (parseFloat(ethers.formatUnits(latestGasPrice.gasPrice, 18)) * gasLimit).toFixed(5).toString() : '0';
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return '0';
  }
};