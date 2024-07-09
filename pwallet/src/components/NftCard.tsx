import React, { useState } from "react";
import { Nfts, Tokens } from "../hooks/useFetchTokensAndNfts";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Cross1Icon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import { sendNftTransaction } from "../utils/sendNftTransaction.ts";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import useClipboard from '../utils/useClipboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CHAINS_CONFIG, ChainKey } from '../utils/chains.ts';
import { ethers } from "ethers";
import { useGasPrice } from "../utils/useGasPrice.ts";

interface NftCardProps {
  token: Tokens;
  nft: Nfts;
  seedPhrase: string;
  selectedChain: ChainKey;
  refetchBalances: () => void;
  closeModal: () => void;
}

interface TransactionReceipt {
  hash: string;
  from: string;
  txFee: string;
  status: number;
  to: string;
  total: string;
  amount: string;
}

const NftCard: React.FC<NftCardProps> = ({ nft, token, seedPhrase, selectedChain, refetchBalances, closeModal }) => {
  const [amountToSend, setAmountToSend] = useState<string>("");
  const [sendToAddress, setSendToAddress] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null);
  const { tooltipText: tooltipTextTo, open: openTo, copyToClipboard: copyToClipboardTo, setOpen: setOpenTo } = useClipboard();
  const { tooltipText: tooltipTextFrom, open: openFrom, copyToClipboard: copyToClipboardFrom, setOpen: setOpenFrom } = useClipboard();

  const gasLimit = nft.contractType === 'ERC1155' ? 50400 : 93943;
  const { gasPrice, isFetchingGasPrice } = useGasPrice(selectedChain, isProcessing, gasLimit);

  const handleSendNftTransaction = async () => {
    setIsProcessing(true);
    try {
      const receipt = await sendNftTransaction(
        seedPhrase, 
        sendToAddress, 
        amountToSend.toString(), 
        selectedChain, 
        { tokenAddress : nft.tokenAddress, 
          contractType : nft.contractType as "ERC721" | "ERC721A" | "ERC1155", 
          tokenId : nft.tokenId });
      if (receipt) {
  
        setTransactionReceipt(receipt as TransactionReceipt);
        console.log("Transaction successful with hash:", receipt.hash);
  
  
        setSendToAddress("");
        setTimeout(() => {
          refetchBalances();
        }, 1000); 
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
    <div className="">
      <div className="">
        <h2 className="py-3 ml-6 mr-1">
          {nft.metadata.name.length > 19
            ? `${nft.metadata.name.slice(0, 19)}...`
            : nft.metadata.name}
          <span className="text-lightgrey"> x{nft.amount}</span>
        </h2>
      </div>
      <img
        src={nft.metadata.image}
        alt={nft.metadata.name}
        className="rounded-md w-full h-auto mb-4 object-contain shadow-blackest shadow-sm"
      />

      <Card className="rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
        <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide">
            Name:
          </CardTitle>
          <CardDescription className="col-span-3 font-normal text-base text-right text-offwhite truncate">
            {nft.metadata.name}
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide">
            ID #:
          </CardTitle>
          <CardDescription className="col-span-3 font-normal text-base text-right text-offwhite truncate">
            {nft.tokenId}
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2 border-b-2 border-blacker">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-1">
            Description:
          </CardTitle>
          <CardDescription className="text-offwhite opacity-80">
            {nft.metadata.description}
          </CardDescription>
        </CardContent>
        <CardContent className="px-4 pt-2 border-b-2 border-blacker pb-0">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-2">
            Attributes:
          </CardTitle>
          <CardDescription className="flex flex-wrap text-offwhite text-base pb-2">
            {Array.isArray(nft.metadata.attributes) &&
              nft.metadata.attributes
                .filter(
                  (attribute) =>
                    attribute.value !== undefined && attribute.value !== null
                )
                .map((attribute, index) => (
                  <span
                    key={index}
                    className="flex flex-col py-0.5 px-2 mr-2 mb-2 rounded-md border border-lightgrey bg-blacker"
                  >
                    <span className="text-lightgrey font-semibold">
                      {attribute.trait_type}
                    </span>
                    <span className="text-offwhite">{attribute.value}</span>
                  </span>
                ))}
          </CardDescription>
        </CardContent>
        <CardContent className="p-4 py-2">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-1">
            Contract Address:
          </CardTitle>
          <CardDescription className="text-amber tracking-tighter opacity-80">
            {nft.tokenAddress}
          </CardDescription>
        </CardContent>
      </Card>
      <Drawer setBackgroundColorOnScale={false} modal={false} handleOnly={true}>
        <DrawerTrigger className="mb-8 mt-4 w-full h-9 rounded-md px-4 py-2 inline-flex items-center justify-center whitespace-nowrap bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm">
          Send
        </DrawerTrigger>
        <DrawerContent className="modal z-10 top-[-32px] h-[800px] rounded-none border-lightgrey bg-blacker">
          <DrawerHeader className="grid p-0">
            <DrawerClose
              className="absolute col-span-1 -ml-0.5"
              onClick={closeModal}
            >
              <Cross1Icon
                className="z-10 absolute top-4 h-6 w-6 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
                style={{ cursor: "pointer" }}
              />
            </DrawerClose>
            <DrawerTitle className="py-3 ml-6 mr-1 font-semibold text-offwhite">
              {nft.metadata.name.length > 19
                ? `${nft.metadata.name.slice(0, 19)}...`
                : nft.metadata.name}
              <span className="text-lightgrey"> x{nft.amount}</span>
            </DrawerTitle>
            <DrawerDescription>
              {" "}
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="rounded-md mx-auto my-auto w-4/6 h-auto mb-4 object-contain shadow-blackest shadow-sm"
              />
            </DrawerDescription>
          </DrawerHeader>
          <Textarea
            id="sendAddress"
            className="bg-blackest resize-none min-h-[60px] h-16 mb-3 text-offwhite border-lightgrey focus:border-sky"
            value={sendToAddress}
            onChange={(e) => setSendToAddress(e.target.value)}
            placeholder="Recipient's address"
          />
          <Input
            id="sendAmount"
            className="bg-blackest resize-none h-10 min-h-[40px] text-offwhite border-lightgrey focus:border-sky"
            value={nft.contractType !== 'ERC1155' ? '1' : (amountToSend)}
            onChange={(e) => setAmountToSend((e.target.value))}
            onWheel={(event) => event.currentTarget.blur()}
            placeholder="Amount to send"
            type="number"
            disabled={nft.contractType !== 'ERC1155'}
          />
          {isFetchingGasPrice ? (
            <Skeleton className="w-[320px] h-10 mt-4 rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none" />
          ) : (
            <Card className="w-[320px] mt-4 rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
              <CardContent className="grid grid-cols-4 p-4 py-2 border-blacker">
                <CardTitle className="col-span-2 text-base font-semibold text-lightgrey tracking-wide">
                  Estimated Fee:
                </CardTitle>
                <CardDescription className="col-span-2 font-normal text-base text-right text-offwhite truncate">
                  {gasPrice} {CHAINS_CONFIG[selectedChain].symbol}
                </CardDescription>
              </CardContent>
            </Card>
          )}
          <DrawerFooter className="flex flex-row w-full gap-4 p-0 my-4">
            <DrawerClose asChild>
              <Button
                className="w-1/2 bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              className="w-1/2 bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm"
              onClick={handleSendNftTransaction}
              disabled={
                isProcessing || 
                ethers.isAddress(sendToAddress) === false ||
                nft.amount <= 0 ||
                Number(amountToSend) === 0
              }
            >
              Send
            </Button>
          </DrawerFooter>
          {isProcessing ? (
            <Skeleton className="w-[320px] h-12 rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none" />
          ) : transactionReceipt ? (
            <Card className="w-[320px] rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
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
                    href={`${CHAINS_CONFIG[selectedChain].scanUrl}${transactionReceipt?.hash}`}
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
                  Transaction Fee:
                </CardTitle>
                <CardDescription className="col-span-2 font-normal text-base text-right text-red-500 truncate">
                  {`- ${transactionReceipt?.txFee}`}{" "}
                  {CHAINS_CONFIG[selectedChain].symbol}
                </CardDescription>
              </CardContent>
              <CardContent className="p-4 py-2 border-b-2 border-blacker grid grid-cols-4 justify-between">
                <CardTitle className="col-span-2 text-base font-semibold text-lightgrey tracking-wide">
                  Token Amount:
                </CardTitle>
                <CardDescription className="col-span-2 font-normal text-base text-right text-red-500 truncate">
                  {transactionReceipt?.amount &&
                    `- ${transactionReceipt?.amount} ${token.symbol}`}
                </CardDescription>
              </CardContent>
            </Card>
          ) : null}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NftCard;
