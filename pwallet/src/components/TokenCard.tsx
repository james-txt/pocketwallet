import React, { useState } from "react";
import { Tokens } from "../hooks/useFetchTokensAndNfts";
import noneLogo from "../assets/none.png";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Cross1Icon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import { sendTransaction } from "../utils/sendTransaction.ts";
import useClipboard from '../utils/useClipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenCardProps {
  token: Tokens;
  logoUrls: { [symbol: string]: string };
  seedPhrase: string;
}

interface TransactionReceipt {
  hash: string;
  from: string;
  gasPrice: string;
  status: number;
  to: string;
  total: string;
}

  const TokenCard: React.FC<TokenCardProps> = ({ token, logoUrls, seedPhrase }) => {
    const [amountToSend, setAmountToSend] = useState<string>("");
    const [sendToAddress, setSendToAddress] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null as TransactionReceipt | null);
    const { tooltipText: tooltipTextTo, open: openTo, copyToClipboard: copyToClipboardTo, setOpen: setOpenTo } = useClipboard();
    const { tooltipText: tooltipTextFrom, open: openFrom, copyToClipboard: copyToClipboardFrom, setOpen: setOpenFrom } = useClipboard();
  
    const handleSendTransaction = async () => {
      setIsProcessing(true);
      try {
        const receipt = await sendTransaction(seedPhrase, sendToAddress, amountToSend);
        if (receipt) {

          setTransactionReceipt(receipt as TransactionReceipt);
          console.log("Transaction successful with hash:", receipt.hash);
  
          setAmountToSend("");
          setSendToAddress("");
        }
      } catch (error) {
        console.error('Error sending transaction:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    const truncateWalletAddress = (address: string | null) => {
      if (!address) return '';
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };
  
  return (
    <div>
      <h2 className="mt-3 flex justify-center">
        <img
          src={logoUrls[token.symbol] || noneLogo}
          alt={`${token.symbol} Logo`}
          className="w-[32px] h-auto mb-4 rounded-full shadow-blackest shadow-sm"
        />
      </h2>

      <Card className="w-[320px] rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
        <CardContent className="p-4 py-2 border-b-2 border-blacker">
          <CardTitle className="pt-2 pb-1 text-5xl tracking-tight text-center">
            {parseFloat(token.balance_formatted).toFixed(4)}{" "}
            {token.symbol && token.symbol.length <= 5 ? token.symbol : "???"}
          </CardTitle>
          <CardDescription className="text-base pb-2 font-semibold text-center text-lightgrey">
            {token.usd_value ? `$${token.usd_value.toFixed(2)}` : "$0.00"}
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide">
            Name:
          </CardTitle>
          <CardDescription className="col-span-3 font-normal text-base text-right text-offwhite truncate">
            {token.name}(
            {token.symbol && token.symbol.length <= 5 ? token.symbol : "???"})
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide">
            Price:
          </CardTitle>
          <CardDescription className="col-span-3 font-normal text-base text-right text-offwhite truncate">
            {token.usd_price ? `$${token.usd_price.toFixed(2)}` : "$?.??"}
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-1">
            Address:
          </CardTitle>
          <CardDescription className="text-amber tracking-tight opacity-80">
            {token.token_address}
          </CardDescription>
        </CardContent>
      </Card>
      <Drawer setBackgroundColorOnScale={false} modal={false} handleOnly={true}>
        <DrawerTrigger className="mb-8 mt-4 w-full h-9 rounded-md px-4 py-2 inline-flex items-center justify-center whitespace-nowrap bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm">
          Send
        </DrawerTrigger>
        <DrawerContent className="modal z-10 top-[-32px] h-full rounded-none border-lightgrey bg-blacker">
          <DrawerHeader className="p-0">
            <DrawerClose className="absolute">
              <Cross1Icon
                className="z-10 absolute top-4 right-[70px] h-6 w-6 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
                style={{ cursor: "pointer" }}
              />
            </DrawerClose>
            <DrawerTitle className="pt-3 pb-2 scroll-m-20 text-xl font-semibold text-offwhite truncate">
              {token.name.length > 19
                ? `${token.name.slice(0, 19)}...`
                : token.name}
            </DrawerTitle>
            <DrawerDescription>
              {" "}
              <img
                src={logoUrls[token.symbol] || noneLogo}
                alt={`${token.symbol} Logo`}
                className="w-1/2 h-auto mx-auto mb-4 rounded-full shadow-blackest shadow-sm"
              />
            </DrawerDescription>
          </DrawerHeader>
          <Textarea
            className="bg-blackest resize-none min-h-[60px] h-16 mb-3 text-offwhite border-lightgrey focus:border-sky"
            value={sendToAddress}
            onChange={(e) => setSendToAddress(e.target.value)}
            placeholder="Recipient's address"
          />
          <Input
            className="bg-blackest resize-none h-10 min-h-[40px] text-offwhite border-lightgrey focus:border-sky"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            placeholder="Amount to send"
          />
          <DrawerFooter className="flex flex-row w-full gap-4 p-0 mt-4">
            <DrawerClose asChild>
              <Button className="w-1/2 bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              className="w-1/2 bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm"
              onClick={handleSendTransaction}
              disabled={isProcessing}
            >
              Send
            </Button>
          </DrawerFooter>
          {isProcessing ? (
            <Skeleton className="w-[320px] h-12 mt-4 rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none" />
          ) : transactionReceipt ? (
            <Card className="w-[320px] mt-4 rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
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
                        onClick={() =>
                          copyToClipboardFrom(transactionReceipt.from)
                        }
                      >
                        {truncateWalletAddress(transactionReceipt?.from)}
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent
                      align="end"
                      side="right"
                      sideOffset={-22}
                      alignOffset={-20}
                      className="bg-char border-none shadow-sm shadow-blackest"
                    >
                      <p>{tooltipTextFrom}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ThickArrowRightIcon className="col-span-1 h-6 w-6 justify-self-center" />
                <TooltipProvider delayDuration={0}>
                  <Tooltip open={openTo} onOpenChange={setOpenTo}>
                    <TooltipTrigger asChild>
                      <CardDescription
                        className="col-span-4 mx-2 hover:bg-char rounded-md font-normal text-base text-center text-offwhite truncate"
                        onClick={() => copyToClipboardTo(transactionReceipt.to)}
                      >
                        {truncateWalletAddress(transactionReceipt?.to)}
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent
                      align="end"
                      side="left"
                      sideOffset={-22}
                      alignOffset={-20}
                      className="bg-char border-none shadow-sm shadow-blackest"
                    >
                      <p>{tooltipTextTo}</p>
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
                    href={`https://sepolia.etherscan.io/tx/${transactionReceipt?.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transactionReceipt?.hash}
                  </a>
                </CardDescription>
              </CardContent>
              <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
                <CardTitle className="col-span-2 text-base font-semibold text-lightgrey tracking-wide">
                  Status:
                </CardTitle>
                <CardDescription
                  className={`col-span-2 font-normal text-base text-right truncate 
                ${transactionReceipt.status === 1 ? "text-green-500" : transactionReceipt.status === 2 ? "text-red-500" : "text-yellow-500"}`}
                >
                  {transactionReceipt.status === 1
                    ? "Success"
                    : transactionReceipt.status === 2
                      ? "Failed"
                      : "Pending"}
                </CardDescription>
              </CardContent>
              <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
                <CardTitle className="col-span-2 text-base font-semibold text-lightgrey tracking-wide">
                  Gas Price:
                </CardTitle>
                <CardDescription className="col-span-2 font-normal text-base text-right text-offwhite truncate">
                  {transactionReceipt?.gasPrice}
                </CardDescription>
              </CardContent>
              <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
                <CardTitle className="col-span-2 text-base font-semibold text-lightgrey tracking-wide">
                  Total Cost:
                </CardTitle>
                <CardDescription className="col-span-2 font-normal text-base text-right text-offwhite truncate">
                  {transactionReceipt?.total}
                </CardDescription>
              </CardContent>
            </Card>
          ) : null}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TokenCard;
