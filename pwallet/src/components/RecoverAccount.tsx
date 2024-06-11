import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";
import { Wallet } from "ethers";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";


interface RecoverAccountProps {
  setSeedPhrase: React.Dispatch<React.SetStateAction<string | null>>;
  setWallet: React.Dispatch<React.SetStateAction<string | null>>;
}

const RecoverAccount: React.FC<RecoverAccountProps> = ({ setWallet, setSeedPhrase }) => {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState<string | null>(null);
  const [nonValidSeed, setNonValidSeed] = useState<boolean>(false);

  function seedAdjust(e: ChangeEvent<HTMLTextAreaElement>) {
    setNonValidSeed(false);
    setTypedSeed(e.target.value);
  }

  function recoverWallet() {
    let recoveredWallet;
    try {
      if (typedSeed === null) {
        throw new Error("Invalid seed phrase");
      }
      recoveredWallet = Wallet.fromPhrase(typedSeed);
    } catch (err) {
      setNonValidSeed(true);
      return;
    }

    setSeedPhrase(typedSeed);
    setWallet(recoveredWallet.address);
    navigate("/yourwallet");
  }

  return (
    <div className="content px-4">
      <Alert className="mt-4 text-amber bg-blacker border-amber">
        <InfoCircledIcon className="h-6 w-6 mb-2" />
        <AlertDescription>
          Type your seed phrase in the field below to recover your wallet.
          <br />
          It needs to include 12 words separated by spaces.
        </AlertDescription>
      </Alert>
      <Textarea
        value={typedSeed || ""}
        onChange={seedAdjust}
        className="seedPhraseContainer mt-7 pt-3 px-4 min-h-[100px] bg-black text-offwhite border-sky"
        placeholder="Type your seed phrase here"
      ></Textarea>
            <Button
              disabled={typedSeed === null || typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "}
              className="mt-7 bg-sky text-blackest w-full shadow-blackest shadow-sm"
              onClick={() => recoverWallet()}
            >
              Recover Wallet
            </Button>
          {nonValidSeed && (
            <p className="text-red-600 mt-3">
              Invalid seed phrase
            </p>
          )}
    </div>
  );
};

export default RecoverAccount;
