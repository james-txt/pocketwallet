import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChainKey } from '../utils/chains';
import arbLogo from "../assets/arb.png";
import avaxLogo from "../assets/avax.png";
import ethLogo from "../assets/eth.png";
import baseLogo from "../assets/base.png";
import maticLogo from "../assets/matic.png";
import opLogo from "../assets/op.png";
import testLogo from "../assets/test.png";

interface ChainOption {
  id: ChainKey;
  name: string;
  logo: string;
  secondaryLogo?: string;
}

interface ChainSelectorProps {
  selectedChain: ChainKey;
  setSelectedChain: (chain: ChainKey) => void;
}

const chainOptions: ChainOption[] = [
  { id: '0xaa36a7', name: 'Sepolia Testnet', logo: testLogo, secondaryLogo: ethLogo },
  { id: '0x13882', name: 'Amoy Testnet', logo: testLogo, secondaryLogo: maticLogo },
  { id: '0x1', name: 'Ethereum Mainnet', logo: ethLogo },
  { id: '0x2105', name: 'Base Mainnet', logo: baseLogo },
  { id: '0x89', name: 'Polygon Mainnet', logo: maticLogo },
  { id: '0xa86a', name: 'Avalanche Mainnet', logo: avaxLogo },
  { id: '0xa4b1', name: 'Arbitrum Mainnet', logo: arbLogo },
  { id: '0xa', name: 'Optimism Mainnet', logo: opLogo },
];

const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedChainOption = chainOptions.find(option => option.id === selectedChain);

  return (
    <Select
      onValueChange={(val) => {
        setSelectedChain(val as ChainKey);
        setIsOpen(false);
      }}
      value={selectedChain}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className="w-14 px-0 mr-3 rounded-full justify-center bg-chared hover:bg-char data-[state=open]:bg-char border-none">
              <SelectValue>
                {selectedChainOption && (
                  <div className="w-6 h-6 bg-offwhite rounded-full relative">
                    <img src={selectedChainOption.logo} loading="lazy" alt={`${selectedChainOption.name} logo`} className="w-6 h-6 z-10" />
                    {selectedChainOption.secondaryLogo && (
                      <img src={selectedChainOption.secondaryLogo} loading="lazy" alt={`${selectedChainOption.name} secondary logo`} className="w-3 h-3 absolute bottom-0 right-0 z-20" />
                    )}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent align="end" side="left" sideOffset={-20} alignOffset={-20} className="bg-char border border-none shadow-sm shadow-blackest">
            <p>{selectedChainOption?.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SelectContent className="w-auto min-w-0 rounded-md bg-chared text-offwhite border-none shadow-sm shadow-blackest"
        position="popper"
        sideOffset={-2}
      >
        {chainOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
              <div className="w-6 h-6 bg-offwhite rounded-full mr-2 relative">
                <img src={option.logo} loading="lazy" alt={`${option.name} logo`} className="w-6 h-6 z-10" />
                {option.secondaryLogo && (
                  <img src={option.secondaryLogo} loading="lazy" alt={`${option.name} secondary logo`} className="w-3 h-3 absolute bottom-0 right-0 z-20" />
                )}
              </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChainSelector;