import { CheckboxIcon, CopyIcon, DashboardIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'

interface ViewWalletProps {
  wallet: string | null;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet }) => {
  const [tooltipAddressText, setTooltipAddressText] = useState("Copy to clipboard");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("token");
  const [fadeClass, setFadeClass] = useState("fade-in-left");

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

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
    }, 100);
  };

  useEffect(() => {
    setFadeClass("fade-in-left");
  }, [currentTab]);

  return (
    <div className="content">
      <TooltipProvider delayDuration={0}>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <Button
              className="w-1/2 mt-2 mb-5 h-8 bg-blacker hover:bg-char flex items-center justify-between truncate"
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

      <Tabs defaultValue="token" value={currentTab} className="w-[320px] rounded-none">
        <div className="relative w-full h-[406px]">
          <TabsContent
            value="token"
            className={`absolute w-full h-full transition-opacity duration-50 ${currentTab === "token" ? fadeClass : "opacity-0"}`}
          >
            Make changes to your account here.Make changes to your account here.Make changes to your account here.
          </TabsContent>
          <TabsContent
            value="nft"
            className={`grid grid-cols-2 absolute w-full h-full transition-opacity duration-50 ${currentTab === "nft" ? fadeClass : "opacity-0"}`}
          >
            Make changes to your account here.Make changes to your account here.
            Make changes to your account here.
          </TabsContent>
          <TabsContent
            value="transfer"
            className={`absolute w-full h-full transition-opacity duration-50 ${currentTab === "transfer" ? fadeClass : "opacity-0"}`}
          >
            Make changes to your account here.Make changes to your account here.Make changes to your account here.
          </TabsContent>
        </div>
        <TabsList className="grid w-full grid-cols-3 h-[48px] rounded-none bg-blacker focus:bg-blacker">
          <TabsTrigger
            value="token"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("token")}
          >
            <FontAwesomeIcon size="xl" icon={faWallet} />
          </TabsTrigger>
          <TabsTrigger 
            value="nft"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("nft")}
          >
            <DashboardIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="transfer"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("transfer")}
          >
            <FontAwesomeIcon size="xl" icon={faArrowRightArrowLeft} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ViewWallet;
