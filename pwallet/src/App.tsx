import React, { useState } from 'react';
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
import { Button } from './components/ui/button';
import { CheckboxIcon, CopyIcon, LockClosedIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useClipboard from './utils/useClipboard';

const App: React.FC = () => {
  const { tooltipText, copied, open, copyToClipboard, setOpen } = useClipboard();
  const [wallet, setWallet] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState('0x1');
  const navigate = useNavigate();
  const location = useLocation();

  const lockWallet = () => {
    setSeedPhrase(null);
    setWallet(null);
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
          onValueChange={(val) => setSelectedChain(val)}
          value={selectedChain}
        >
          <SelectTrigger className="w-14 px-0 mr-3 rounded-full justify-center bg-chared hover:bg-char data-[state=open]:bg-char border-none ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-14 min-w-0 rounded-md bg-chared text-offwhite border-none shadow-sm shadow-blackest"
          position="popper"
          sideOffset={-2}
          >
            <SelectItem value="0xaa36a7" textValue="ETHTEST">
              EthT
            </SelectItem>
            <SelectItem value="0x13882" textValue="POLYTEST">
              PolyT
            </SelectItem>
            <SelectItem value="0x1" textValue="ETH">
              <div className="w-6 h-6 bg-offwhite rounded-full">
                <img src={ethLogo} loading="lazy" alt="ethLogo" className="w-6 h-6 z-10" />
              </div>
            </SelectItem>
            <SelectItem value="0x89" textValue="MATIC">
              <img src={maticLogo} loading="lazy" alt="maticLogo" className="w-6 h-6" />
            </SelectItem>
            <SelectItem value="0xa86a" textValue="AVAX">
              <img src={avaxLogo} loading="lazy" alt="avaxLogo" className="w-6 h-6" />
            </SelectItem>
            <SelectItem value="0xa4b1" textValue="ARB">
              <img src={arbLogo} loading="lazy" alt="arbLogo" className="w-6 h-6" />
            </SelectItem>
            <SelectItem value="0xa" textValue="OP">
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
