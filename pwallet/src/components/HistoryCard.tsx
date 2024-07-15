import { Historys } from "../hooks/useFetchTokensAndNfts";
import noneLogo from "../assets/none.png";
import { Card, CardContent, CardDescription, CardTitle,
} from "@/components/ui/card";
import { ThickArrowRightIcon } from "@radix-ui/react-icons";
import useClipboard from "../utils/useClipboard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { CHAINS_CONFIG,ChainKey  } from '../utils/chains.ts';

interface HistoryCardProps {
  history: Historys;
  wallet: string;
  logoUrls: { [symbol: string]: string };
  selectedChain: ChainKey;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history, wallet, logoUrls, selectedChain,
}) => {
  const { tooltipText: tooltipTextTo, open: openTo, copyToClipboard: copyToClipboardTo, setOpen: setOpenTo,
  } = useClipboard();
  const { tooltipText: tooltipTextFrom, open: openFrom, copyToClipboard: copyToClipboardFrom, setOpen: setOpenFrom,
  } = useClipboard();

  const truncateWalletAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const timestamp = new Date(history.blockTimestamp);
  const formattedTimestamp = timestamp.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="">
      <div className="">
        <h2 className="py-3">
          {history.toAddress.toLowerCase() === wallet.toLowerCase()
            ? "Received"
            : history.fromAddress.toLowerCase() === wallet.toLowerCase()
              ? "Sent"
              : ""}
        </h2>
      </div>
      <h2 className="flex justify-center mb-3">
        {history.contractType === "ERC1155" ||
        history.contractType === "ERC721" ||
        history.contractType === "ERC721A" ? (
          <img
            src={history.image || noneLogo}
            alt={`${history.tokenSymbol} Logo`}
            className="w-24 h-24"
          />
        ) : (
          <img
            src={logoUrls[history.tokenSymbol] || noneLogo}
            alt={`${history.tokenSymbol} Logo`}
            className="w-24 h-24"
          />
        )}
      </h2>
      <h2
        className={`text-center mb-3 ${
          history.toAddress.toLowerCase() === wallet.toLowerCase()
            ? "text-green-500 font-semibold"
            : history.fromAddress.toLowerCase() === wallet.toLowerCase()
              ? "text-red-500 font-light"
              : "text-offwhite"
        }`}
      >
        {history.toAddress.toLowerCase() === wallet.toLowerCase()
          ? `+${history.valueDecimal ? parseFloat(history.valueDecimal).toFixed(3) : history.amount} ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`
          : history.fromAddress.toLowerCase() === wallet.toLowerCase()
            ? `-${history.valueDecimal ? parseFloat(history.valueDecimal).toFixed(3) : history.amount} ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`
            : `0 ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`}
      </h2>
      <Card className="w-[320px] rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
        <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide">
            Date:
          </CardTitle>
          <CardDescription className="col-span-3 font-normal text-base text-right text-offwhite truncate">
            {formattedTimestamp}
          </CardDescription>
        </CardContent>
        <CardContent className="grid grid-cols-9 p-4 py-2 border-b-2 border-blacker">
          <CardTitle className="col-span-5 text-base font-semibold text-lightgrey tracking-wide">
            From:
          </CardTitle>
          <CardTitle className="col-span-3 text-base font-semibold text-lightgrey tracking-wide">
            To:
          </CardTitle>
          <TooltipProvider delayDuration={0}>
            <Tooltip open={openFrom} onOpenChange={setOpenFrom}>
              <TooltipTrigger asChild>
                <CardDescription
                  className="col-span-4 mx-2 hover:bg-char rounded-md font-normal text-base text-center text-offwhite truncate"
                  onClick={() => copyToClipboardFrom(history.fromAddress)}
                  style={{ cursor: "pointer" }}
                >
                  {truncateWalletAddress(history.fromAddress)}
                </CardDescription>
              </TooltipTrigger>
              <TooltipContent
                align="end"
                side="right"
                sideOffset={-22}
                alignOffset={-20}
                className="bg-char border-none shadow-sm shadow-blackest"
              >
                {tooltipTextFrom}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThickArrowRightIcon className="col-span-1 h-6 w-6 justify-self-center" />
          <TooltipProvider delayDuration={0}>
            <Tooltip open={openTo} onOpenChange={setOpenTo}>
              <TooltipTrigger asChild>
                <CardDescription
                  className="col-span-4 mx-2 hover:bg-char rounded-md font-normal text-base text-center text-offwhite truncate"
                  onClick={() => copyToClipboardTo(history.toAddress)}
                  style={{ cursor: "pointer" }}
                >
                  {truncateWalletAddress(history.toAddress)}
                </CardDescription>
              </TooltipTrigger>
              <TooltipContent
                align="end"
                side="left"
                sideOffset={-22}
                alignOffset={-20}
                className="bg-char border-none shadow-sm shadow-blackest"
              >
                {tooltipTextTo}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
        <CardContent className="p-4 py-2 border-b-2 border-blacker">
                <CardTitle className="col-span-4 text-base font-semibold text-lightgrey tracking-wide">
                  Transaction Hash:
                </CardTitle>
                <CardDescription className="col-span-4 font-normal text-base text-right text-sky truncate">
                  <a
                    href={`${CHAINS_CONFIG[selectedChain].scanUrl}${history.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {history.transactionHash}
                  </a>
                </CardDescription>
              </CardContent>
      </Card>
    </div>
  );
};

export default HistoryCard;
