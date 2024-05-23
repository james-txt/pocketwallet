import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';
import ViewWallet from './components/ViewWallet';

const App: React.FC = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);

  return (
    <div className="App">
      {wallet && seedPhrase ? (
        <Routes>
          <Route
            path="/yourwallet"
            element={
              <ViewWallet 
              wallet={wallet}
              //selectedChain={selectedChain}
              />
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/recover"
            element={
              <RecoverAccount
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
        </Routes>
      )}
    </div>
  );
}

export default App;
