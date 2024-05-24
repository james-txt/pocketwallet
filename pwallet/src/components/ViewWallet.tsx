import { CheckboxIcon,CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ViewWalletProps {
  wallet: string | null;
}


const ViewWallet: React.FC<ViewWalletProps> = ({ wallet }) => {
  
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet).then(() => {
        setTooltipText('Copied!');
        setOpen(true);
        setCopied(true);
        setTimeout(() => {
          setTooltipText('Copy to clipboard');
          setOpen(false);
          setCopied(false);
        }, 3000);
      });
    }
  };


  return (
      <div className="content">
        <TooltipProvider delayDuration={0}>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <Button
                className="w-1/2 mt-2 mb-4 h-8 bg-blacker hover:bg-char flex items-center justify-between truncate"
                onClick={copyToClipboard}
              >
                <span className="truncate">{wallet}</span>
                {copied ? (
                  <CheckboxIcon className="ml-1 h-4 w-4 flex-shrink-0" />
                ) : (
                  <CopyIcon className="ml-1 h-4 w-4 flex-shrink-0" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="right" sideOffset={-22} alignOffset={-20} className="bg-char border-none shadow-sm shadow-blackest">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <hr className=" border-lightgrey mx-auto w-10/12" />

        <p></p>
      </div>
  );
};

export default ViewWallet;
