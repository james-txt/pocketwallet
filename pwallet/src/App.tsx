import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import ViewWallet from './components/ViewWallet';
import logoSM from "./assets/logoSM.png";
import arbLogo from "./assets/arb.png";
import avaxLogo from "./assets/avax.png";
import ethLogo from "./assets/eth.png";
import maticLogo from "./assets/matic.png";
import opLogo from "./assets/op.png";
import testLogo from "./assets/test.png";
import { Button } from './components/ui/button';
import { CheckboxIcon, CopyIcon, LockClosedIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useClipboard from './utils/useClipboard';
import { ChainKey } from './utils/chains';
import { Wallet } from 'ethers';

const App: React.FC = () => {
  const { tooltipText, copied, open, copyToClipboard, setOpen } = useClipboard();
  const [wallet, setWallet] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainKey>('0x1');
  const navigate = useNavigate();
  const location = useLocation();

  const retrieveSeedPhrase = () => {
    chrome.runtime.sendMessage({ action: 'getSeedPhrase' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving seed phrase:', chrome.runtime.lastError);
      } else if (response && response.seedPhrase) {
        setSeedPhrase(response.seedPhrase);
        setWallet(Wallet.fromPhrase(response.seedPhrase).address);
        navigate("/yourwallet");
      } else {
        console.log('No seed phrase found in storage.');
      }
    });
  };

  useEffect(() => {
    retrieveSeedPhrase();
  }, []);

  const lockWallet = () => {
    setSeedPhrase(null);
    setWallet(null);
    console.log('Seed phrase cleared.');

    chrome.runtime.sendMessage({ action: 'clearSeedPhrase' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error handling response:', chrome.runtime.lastError);
      } else if (response && response.success) {
        console.log('Seed phrase was successfully cleared from storage.');
      } else {
        console.log('Failed to clear seed phrase from storage.');
      }
    });

    navigate("/");
  };
  

  const truncateWalletAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleCopyToClipboard = () => {
    if (wallet) {
      copyToClipboard(wallet);
    }
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
          onClick={lockWallet}
          style={{ cursor: "pointer" }}
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
    <div className="App">
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
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/recover"
          element={
            <RecoverAccount
              setSeedPhrase={setSeedPhrase}
              setWallet={setWallet}
            />
          }
        />
        <Route
          path="/create"
          element={
            <CreateAccount
              setSeedPhrase={setSeedPhrase}
              setWallet={setWallet}
            />
          }
        />
        {wallet && seedPhrase && (
          <Route
            path="/yourwallet"
            element={
              <ViewWallet 
              wallet={wallet} 
              selectedChain={selectedChain}
              seedPhrase={seedPhrase}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
