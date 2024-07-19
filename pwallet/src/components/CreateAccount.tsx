import { useState } from "react";
import { Wallet } from "ethers";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CreateAccountProps {
  setSeedPhrase: React.Dispatch<React.SetStateAction<string | null>>;
  setWallet: React.Dispatch<React.SetStateAction<string | null>>;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ setSeedPhrase, setWallet }) => {
  const [newSeedPhrase, setNewSeedPhrase] = useState<string | null>(null);
  const navigate = useNavigate();

  async function generateWallet() {
    const wallet = Wallet.createRandom();
    const mnemonic = wallet.mnemonic!.phrase;
    setNewSeedPhrase(mnemonic);
  }

  const setWalletAndMnemonic = async () => {
    if (newSeedPhrase) {
      try {
        const wallet = Wallet.fromPhrase(newSeedPhrase);
        setSeedPhrase(newSeedPhrase);
        setWallet(wallet.address);

        chrome.runtime.sendMessage({ action: 'storeSeedPhrase', seedPhrase: newSeedPhrase }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error storing seed phrase:', chrome.runtime.lastError);
          } else if (response && response.success) {
            console.log('Seed phrase stored successfully.');
            navigate('/yourwallet');
          } else {
            console.log('Failed to store seed phrase.');
          }
        });

        console.log('Seed phrase stored from create account.');
      } catch (error) {
        console.error('Error setting wallet and seed phrase:', error);
      }
    }
  };

  return (
    <div className="content px-4">
      <Alert className="mt-4" variant="destructive">
        <ExclamationTriangleIcon className="h-6 w-6 mb-2" />
        <AlertTitle>WARNING</AlertTitle>
        <AlertDescription>
          Once you generate a seed phrase, you will need to write it down and
          keep it safe.
          <br />
          If you lose your seed phrase, you will lose access to your funds.
        </AlertDescription>
      </Alert>
      <Button
        className="my-7 bg-sky text-blackest w-full shadow-blackest shadow-sm"
        onClick={generateWallet}
      >
        Generate Seed Phrase
      </Button>
      <Card className="seedPhraseContainer bg-black text-base text-offwhite">
        {newSeedPhrase &&
          newSeedPhrase.split(" ").map((word, index, wordsArray) => (
            <span className="pt-1" key={index}>
              {word}
              {index < wordsArray.length - 1 && "\u00A0"}
            </span>
          ))}
      </Card>
      <Button
        className="my-7 bg-amber text-blackest w-full shadow-blackest shadow-sm"
        onClick={setWalletAndMnemonic}
      >
        Open Your New Wallet!
      </Button>
    </div>
  );
}

export default CreateAccount;
