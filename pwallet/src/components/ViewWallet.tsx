import React, { useState } from "react";
import { DashboardIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import NftCard from "./NftCard";
import TokenCard from "./TokenCard";
import { Skeleton } from "@/components/ui/skeleton";
import noneLogo from "../assets/none.png";
import { calculateTotalNetworth } from "@/utils/calculateNetworth";
import useFetchTokensAndNfts from "../hooks/useFetchTokensAndNfts";
import { Nfts, Tokens } from "../hooks/useFetchTokensAndNfts";

interface ViewWalletProps {
  wallet: string | null;
  selectedChain: string;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, selectedChain }) => {
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");
  const [selectedNft, setSelectedNft] = useState<Nfts | null>(null);
  const [selectedToken, setSelectedToken] = useState<Tokens | null>(null);

  const { tokens, nfts, fetching, logoUrls } = useFetchTokensAndNfts(
    wallet,
    selectedChain
  );

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
    }, 100);
  };

  const openModal = (modalType: "nft" | "token", item: Nfts | Tokens | null = null) => {
    setFadeClass("fade-in");
    if (modalType === "nft") {
      setSelectedNft(item as Nfts);
      setIsNftModalOpen(true);
    } else if (modalType === "token") {
      setSelectedToken(item as Tokens);
      setIsTokenModalOpen(true);
    }
  };
  

  const closeModal = (modalType: "nft" | "token") => {
    setFadeClass("fade-out");
    setTimeout(() => {
      if (modalType === "nft") {
        setIsNftModalOpen(false);
      } else if (modalType === "token") {
        setIsTokenModalOpen(false);
      }
    }, 100);
  };

  const totalNetworth = calculateTotalNetworth(tokens);

  return (
    <div className="content">
      <Tabs
        defaultValue="tokenTab"
        value={currentTab}
        className="w-[320px] rounded-none"
      >
        <div className="relative w-full h-[470px]">
          <TabsContent
            value="tokenTab"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "tokenTab" ? fadeClass : "opacity-0"
            }`}
          >
            {fetching ? (
              <Skeleton className="w-1/2 mx-auto bg-offwhite py-3 mt-5 mb-7" />
            ) : (
              <h2 className="py-3 text-3xl font-semibold tracking-tight">
                ${parseFloat(totalNetworth).toFixed(2)}
              </h2>
            )}
            {fetching ? (
              tokens.map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full py-8 my-3 bg-blackest"
                />
              ))
            ) : tokens.length > 0 ? (
              <div className="">
                {tokens.map((token, tokenIndex) => (
                  <Button
                    className="w-full h-16 py-2 my-3 flex justify-between place-items-center rounded bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm"
                    key={tokenIndex}
                    onClick={() => openModal("token", token)}
                  >
                    <div className="flex gap-2 place-items-center">
                      <img
                        src={logoUrls[token.symbol] || noneLogo}
                        alt={`${token.symbol} Logo`}
                        className="w-12 h-12"
                      />
                      <div className="">
                        <p className="text-left truncate">
                          {token.name.length > 15
                            ? `${token.name.slice(0, 15)}...`
                            : token.name}
                        </p>
                        <p className="text-right truncate">
                          {parseFloat(token.balance_formatted).toFixed(4)}{" "}
                          {token.symbol && token.symbol.length <= 5
                            ? token.symbol
                            : "???"}
                        </p>
                      </div>
                    </div>
                    <p className="text-right place-items-right">
                      {token.usd_value
                        ? `$${token.usd_value.toFixed(2)}`
                        : "$?.??"}
                    </p>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-lightgrey">No tokens found.</p>
            )}
          </TabsContent>
          <TabsContent
            value="nftTab"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "nftTab" ? fadeClass : "opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              {fetching ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="w-full rounded-md h-32" />
                ))
              ) : nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <Button
                    key={index}
                    onClick={() => openModal("nft", nft)}
                    style={{ cursor: "pointer" }}
                    className="relative rounded-md w-full h-full overflow-hidden p-0 hover:bg-chared bg-chared shadow-blackest shadow-sm"
                  >
                    <img
                      src={nft.metadata.image}
                      alt={`nft-${index}`}
                      className="object-contain"
                    />
                    <h4 className="absolute bottom-0 left-0 right-0 bg-blackest bg-opacity-80 text-offwhite rounded-md m-2 px-2 py-0.5 truncate">
                      {nft.metadata.name}
                    </h4>
                  </Button>
                ))
              ) : (
                <p className="col-span-2 text-center text-lightgrey">
                  No NFTs found.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="activityTab"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "activityTab" ? fadeClass : "opacity-0"
            }`}
          >
            Display activity log of your account here.
          </TabsContent>
          <TabsContent
            value="transferTab"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "transferTab" ? fadeClass : "opacity-0"
            }`}
          >
            Make transfers in your account here.
          </TabsContent>
        </div>
        <TabsList className="fixed grid w-[320px] grid-cols-4 h-[64px] rounded-none bg-blacker focus:bg-blacker">
          <TabsTrigger
            value="tokenTab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("tokenTab")}
          >
            <FontAwesomeIcon size="xl" icon={faWallet} />
          </TabsTrigger>
          <TabsTrigger
            value="nftTab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("nftTab")}
          >
            <DashboardIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="activityTab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("activityTab")}
          >
            <ActivityLogIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="transferTab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("transferTab")}
          >
            <FontAwesomeIcon size="xl" icon={faArrowRightArrowLeft} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {currentTab === "tokenTab" && (
        <Modal isOpen={isTokenModalOpen} onClose={() => closeModal("token")}>
          {selectedToken && <TokenCard token={selectedToken} logoUrls={logoUrls} />}
        </Modal>
      )}
      {currentTab === "nftTab" && (
        <Modal isOpen={isNftModalOpen} onClose={() => closeModal("nft")}>
          {selectedNft && <NftCard nft={selectedNft} />}
        </Modal>
      )}
    </div>
  );
};

export default ViewWallet;
