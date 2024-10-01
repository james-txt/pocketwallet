import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoSM from "../assets/logoSM.png";
import { Button } from './ui/button';
import { CheckboxIcon, CopyIcon, LockClosedIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useClipboard from '../utils/useClipboard';
import { ChainKey } from '../utils/chains';
import ChainSelector from '../components/ChainSelector';

interface HeaderProps {
  wallet: string | null;
  selectedChain: ChainKey;
  setSelectedChain: (chain: ChainKey) => void;
  lockWallet: () => void;
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
}

const Header: React.FC<HeaderProps> = ({ 
  wallet, 
  selectedChain, 
  setSelectedChain, 
  lockWallet, 
  location, 
  navigate 
}) => {
  const { tooltipText, copied, open, copyToClipboard, setOpen } = useClipboard();

  const truncateWalletAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleCopyToClipboard = () => {
    if (wallet) {
      copyToClipboard(wallet);
    }
  };

  const handleLockWallet = () => {
    lockWallet();
  };

  const menuHeader = () => {
    const currentPath = location.pathname;

    if (currentPath === "/") {
      return (
        <img
          src={logoSM}
          className="h-[50px] ml-3"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
          loading="lazy"
          alt="logoSM"
        />
      );
    } else if (currentPath === "/yourwallet") {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <LockClosedIcon
                className="h-6 w-6 mr-9 -mt-1 ml-4 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
                onClick={handleLockWallet}
                style={{ cursor: "pointer" }}
                aria-label="lock-wallet"
              />
            </TooltipTrigger>
            <TooltipContent align="end" side="right" sideOffset={-5} alignOffset={-20} className="bg-char border border-none shadow-sm shadow-blackest">
              <p>Lock Wallet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (currentPath === "/create" || currentPath === "/recover") {
      return (
        <Cross1Icon
          className="h-6 w-6 -mt-1 ml-4 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      );
    }
    return null;
  };

  return (
    <header className='z-20'>
      {menuHeader()}
      {wallet && (
        <TooltipProvider delayDuration={0}>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <Button
                className="w-auto h-8 bg-blacker hover:bg-char flex items-center justify-center truncate"
                onClick={handleCopyToClipboard}
              >
                <span className="truncate">
                  {truncateWalletAddress(wallet)}
                </span>
                {copied ? (
                  <CheckboxIcon className="ml-1 h-4 w-4 flex-shrink-0" />
                ) : (
                  <CopyIcon className="ml-1 h-4 w-4 flex-shrink-0" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              align="end"
              side="right"
              sideOffset={-22}
              alignOffset={-20}
              className="bg-char border-none shadow-sm shadow-blackest"
            >
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <ChainSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />
    </header>
  );
};

export default Header;