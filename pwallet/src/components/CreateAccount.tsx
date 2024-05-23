import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XButton } from "@/components/ui/xbutton";
import { useState } from "react";
import { Wallet } from "ethers";
import { useNavigate } from "react-router-dom";

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

  async function setWalletAndMnemonic() {
    if (newSeedPhrase && setSeedPhrase && setWallet) {
      setSeedPhrase(newSeedPhrase);
      const wallet = Wallet.fromPhrase(newSeedPhrase);
      setWallet(wallet.address);
      navigate('/yourwallet');
    }
  }

  return (
    <div className="content px-4 my-3">
      <XButton />
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-6 w-6 mb-2" />
        <AlertTitle>WARNING</AlertTitle>
        <AlertDescription>
          Once you generate a seed phrase, you will need to write it down and keep it safe.
          <br />
          If you lose your seed phrase, you will lose access to your funds.
        </AlertDescription>
      </Alert>
      <Button 
        className="mt-6 mb-5 bg-sky text-blackest w-8/12"
        onClick={generateWallet}
      >
        Generate Seed Phrase
      </Button>
      <Card className="seedPhraseContainer bg-black text-offwhite">
        {newSeedPhrase && newSeedPhrase.split(' ').map((word, index) => (
          <span className="pt-1" key={index}>{word} </span>
        ))}
      </Card>
      <Button
        className="mt-6 mb-5 bg-amber text-blackest w-8/12"
        onClick={setWalletAndMnemonic}
      >
        Open Your New Wallet!
      </Button>
    </div>
  );
}

export default CreateAccount;
