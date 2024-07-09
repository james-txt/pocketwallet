import { useEffect, useState } from "react";
import { fetchGasPrice } from "../hooks/fetchGasPrice.ts";
import { CHAINS_CONFIG, ChainKey } from '../utils/chains';

export const useGasPrice = (selectedChain: ChainKey, isProcessing: boolean, gasLimit: number) => {
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [isFetchingGasPrice, setIsFetchingGasPrice] = useState<boolean>(false);

  useEffect(() => {
    if (isProcessing) {
      return;
    }

    const chain = CHAINS_CONFIG[selectedChain];
    if (chain) {
      const updateGasPrice = async () => {
        setIsFetchingGasPrice(true);

        try {
          const newGasPrice = await fetchGasPrice(chain.rpcUrl, gasLimit);
          setGasPrice(newGasPrice);
        } catch (error) {
          console.error('Error fetching gas price:', error);
        } finally {
          setIsFetchingGasPrice(false);
        }
      };

      updateGasPrice();
      const interval = setInterval(updateGasPrice, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedChain, isProcessing, gasLimit]);

  return { gasPrice, isFetchingGasPrice };
};
