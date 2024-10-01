import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChainKey } from '../utils/chains';
import arbLogo from "../assets/arb.png";
import avaxLogo from "../assets/avax.png";
import ethLogo from "../assets/eth.png";
import maticLogo from "../assets/matic.png";
import opLogo from "../assets/op.png";
import testLogo from "../assets/test.png";

interface ChainSelectorProps {
  selectedChain: ChainKey;
  setSelectedChain: (chain: ChainKey) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain }) => {
  const CHAIN_TEXT_VALUES: { [key: string]: string } = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13882': 'Amoy Testnet',
    '0xa': 'Optimism Mainnet',
    '0xa86a': 'Avalanche Mainnet',
    '0xa4b1': 'Arbitrum Mainnet'
  };

  return (
    <Select
      onValueChange={(val) => setSelectedChain(val as ChainKey)}
      value={selectedChain}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-14 px-0 mr-3 rounded-full justify-center bg-chared hover:bg-char data-[state=open]:bg-char border-none ">
              <SelectValue />
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent align="end" side="left" sideOffset={-20} alignOffset={-20} className="bg-char border border-none shadow-sm shadow-blackest">
            <p>{CHAIN_TEXT_VALUES[selectedChain]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SelectContent className="w-14 min-w-0 rounded-md bg-chared text-offwhite border-none shadow-sm shadow-blackest"
      position="popper"
      sideOffset={-2}
      >
        <SelectItem value="0xaa36a7" textValue="Sepolia Testnet">
          <div className="w-6 h-6 bg-offwhite rounded-full">
            <img src={testLogo} loading="lazy" alt="ethLogo" className="w-6 h-6 z-20 absolute opacity-100" />
            <img src={ethLogo} loading="lazy" alt="ethLogo" className="w-6 h-6 z-10 grayscale" />
          </div>
        </SelectItem>
        <SelectItem value="0x13882" textValue="Amoy Testnet">
          <img src={testLogo} loading="lazy" alt="ethLogo" className="w-6 h-6 z-20 absolute opacity-100" />
          <img src={maticLogo} loading="lazy" alt="maticLogo" className="w-6 h-6 grayscale" />
        </SelectItem>
        <SelectItem value="0x1" textValue="Ethereum Mainnet">
          <div className="w-6 h-6 bg-offwhite rounded-full">
            <img src={ethLogo} loading="lazy" alt="ethLogo" className="w-6 h-6 z-10" />
          </div>
        </SelectItem>
        <SelectItem value="0x89" textValue="Polygon Mainnet">
          <img src={maticLogo} loading="lazy" alt="maticLogo" className="w-6 h-6" />
        </SelectItem>
        <SelectItem value="0xa86a" textValue="Avalanche Mainnet">
          <img src={avaxLogo} loading="lazy" alt="avaxLogo" className="w-6 h-6" />
        </SelectItem>
        <SelectItem value="0xa4b1" textValue="Arbitrum Mainnet">
          <img src={arbLogo} loading="lazy" alt="arbLogo" className="w-6 h-6" />
        </SelectItem>
        <SelectItem value="0xa" textValue="Optimism Mainnet">
          <img src={opLogo} loading="lazy" alt="opLogo" className="w-6 h-6" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ChainSelector;