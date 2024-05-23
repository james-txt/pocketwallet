import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from './Header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ViewWalletProps {
  wallet: string | null;
  seedPhrase: string | null;
}


const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, seedPhrase }) => {
  
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');
  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet).then(() => {
        setTooltipText('Copied!');
        setOpen(true);
        setTimeout(() => {
          setTooltipText('Copy to clipboard');
          setOpen(false);
        }, 5000);
      });
    }
  };


  return (
    <div>
      <Header/>
      <div className="content">
        <TooltipProvider delayDuration={0}>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <Button
                className="w-1/2 mt-4 bg-blacker hover:bg-char flex items-center justify-between truncate"
                onClick={copyToClipboard}
              >
                <span className="truncate">{wallet}</span>
                <CopyIcon className="ml-1 h-4 w-4 flex-shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="right" sideOffset={-22} alignOffset={-20} className="bg-blackest border border-char shadow-sm shadow-blackest">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

<br></br>

        <p>{seedPhrase}</p>
      </div>
    </div>
  );
};

export default ViewWallet;
