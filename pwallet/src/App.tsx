import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import ViewWallet from './components/ViewWallet';
import Header from '../src/components/Header';
import { ChainKey } from './utils/chains';
import { Wallet } from 'ethers';

const App: React.FC = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainKey>('0x1');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    retrieveSeedPhrase();
  }, []);

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

  return (
    <div className="App">
      <Header 
        wallet={wallet}
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        lockWallet={lockWallet}
        location={location}
        navigate={navigate}
      />
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