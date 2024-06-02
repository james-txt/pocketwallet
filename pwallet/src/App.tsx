import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import ViewWallet from './components/ViewWallet';
import logoSM from "./assets/logoSM.png";
import arbLogo from "./assets/arb.png";
import avaxLogo from "./assets/avax.png";
import baseLogo from "./assets/base.png";
import bnbLogo from "./assets/bnb.png";
import ethLogo from "./assets/eth.png";
import maticLogo from "./assets/matic.png";
import opLogo from "./assets/op.png";
import { Button } from './components/ui/button';
import { CheckboxIcon, CopyIcon, LockClosedIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const App: React.FC = () => {
  const [tooltipAddressText, setTooltipAddressText] = useState("Copy to clipboard");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
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

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet).then(() => {
        setTooltipAddressText("Copied!");
        setOpen(true);
        setCopied(true);
        setTimeout(() => {
          setTooltipAddressText("Copy to clipboard");
          setOpen(false);
          setCopied(false);
        }, 3000);
      });
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
      <header>
        {menuHeader()}
        {wallet && (
          <TooltipProvider delayDuration={0}>
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger asChild>
                <Button
                  className="w-auto h-8 bg-blacker hover:bg-char flex items-center justify-center truncate"
                  onClick={copyToClipboard}
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
                <p>{tooltipAddressText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Select
          onValueChange={(val) => setSelectedChain(val)}
          value={selectedChain}
        >
          <SelectTrigger className="w-16 mr-3 rounded-full bg-blackest border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-16 min-w-0 rounded-md bg-blackest text-offwhite border-blacker">
            <SelectItem value="0x4268" textValue="ETHTEST">
              EthTestnet
            </SelectItem>
            <SelectItem value="0x13882" textValue="POLYTEST">
              PolyTestnet
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
            <SelectItem value="0x38" textValue="BNB">
              <img src={bnbLogo} loading="lazy" alt="bnbLogo" className="w-6 h-6" />
            </SelectItem>
            <SelectItem value="0xa4b1" textValue="ARB">
              <img src={arbLogo} loading="lazy" alt="arbLogo" className="w-6 h-6" />
            </SelectItem>
            <SelectItem value="0x2105" textValue="BASE">
              <img src={baseLogo} loading="lazy" alt="baseLogo" className="w-6 h-6" />
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
              <ViewWallet wallet={wallet} selectedChain={selectedChain} />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
