import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import ViewWallet from './components/ViewWallet';
import logoSM from "./assets/logoSM.png";
import { LockClosedIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const App: React.FC = () => {
  const [wallet, setLocalWallet] = useState<string | null>(null);
  const [seedPhrase, setLocalSeedPhrase] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChain, setSelectedChain] = useState("0x1");

  const lockWallet = () => {
    setLocalSeedPhrase(null);
    setLocalWallet(null);
    navigate("/");
  };

  const renderHeader = () => {
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
          className="h-6 w-6 -mt-1 ml-4 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
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
    <div className="App z-0">
      <header>
        {renderHeader()}
        <Select
          onValueChange={(val) => setSelectedChain(val)}
          value={selectedChain}
        >
          <SelectTrigger className="w-28 mr-3 bg-blackest border-none">
            <SelectValue placeholder="Ethereum" />
          </SelectTrigger>
          <SelectContent className="min-w-0 bg-blackest text-offwhite border-blacker">
            <SelectItem value="0x1">Ethereum</SelectItem>
            <SelectItem value="0x89">Polygon</SelectItem>
            <SelectItem value="0xa86a">Avalanche</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recover" element={<RecoverAccount />} />
        <Route
          path="/create"
          element={
            <CreateAccount
              setSeedPhrase={setLocalSeedPhrase}
              setWallet={setLocalWallet}
            />
          }
        />
        {wallet && seedPhrase && (
          <Route
            path="/yourwallet"
            element={
              <ViewWallet 
                wallet={wallet}
                seedPhrase={seedPhrase}
                // selectedChain={selectedChain}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
