import React, { useState, useEffect } from "react";
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
import { calculateTotalNetworth, calculateNetworth24hrUsdChange, calculateNetworth24hrPctChange } from "@/utils/calculateNetworth";
import useFetchTokensAndNfts from "../hooks/useFetchTokensAndNfts";
import { Nfts, Tokens } from "../hooks/useFetchTokensAndNfts";
import { ChainKey } from '../utils/chains';

interface ViewWalletProps {
  wallet: string;
  seedPhrase: string;
  selectedChain: ChainKey;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, selectedChain, seedPhrase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"nft" | "token" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Nfts | Tokens | null>(null);
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");

  const { tokens, nfts, fetching, logoUrls, refetch } = useFetchTokensAndNfts(
    wallet,
    selectedChain
  );

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
      closeModal();
    }, 100);
  };
  const openModal = (type: "nft" | "token", item: Nfts | Tokens | null = null) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalType(null);
  };

  useEffect(() => {
    closeModal();
  }, [selectedChain]);

  const totalNetworth = parseFloat(calculateTotalNetworth(tokens).toFixed(2));
  const totalNetworth24hrUsdChange = parseFloat(calculateNetworth24hrUsdChange(tokens).toFixed(2));
  const totalNetworth24hrPctChange = parseFloat(calculateNetworth24hrPctChange(tokens).toFixed(2));

  const refetchBalances = () => {
    if (refetch) {
      refetch();
      setTimeout(() => {
      }, 1000);
    }
  };

  
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
              <Skeleton className="w-1/2 bg-offwhite mx-auto py-4 mb-5 mt-8" />
            ) : (
              <h1 className="pt-6 pb-2 text-5xl tracking-tight">
                ${totalNetworth ? totalNetworth : "0.00"}
              </h1>
            )}
            <div className="flex gap-2 justify-center mb-8 tracking-tight">
              {fetching ? (
                <Skeleton className="w-1/6 bg-offwhite py-2 my-1" />
              ) : (
                <h3
                  className={`${
                    totalNetworth24hrUsdChange > 0.001
                      ? "text-green-500 font-semibold"
                      : totalNetworth24hrUsdChange < -0.001
                        ? "text-red-500 font-light"
                        : "text-offwhite"
                  }`}
                >
                  {totalNetworth24hrUsdChange > 0.001 
                    ? `+$${totalNetworth24hrUsdChange.toFixed(2)}` 
                    : totalNetworth24hrUsdChange < -0.001 
                    ? `-$${Math.abs(totalNetworth24hrUsdChange).toFixed(2)}`
                    : "0.00"}
                </h3>
              )}
              {fetching ? (
                <Skeleton className="w-1/6 bg-offwhite py-2 my-1" />
              ) : (
                <h3
                  className={`${
                    totalNetworth24hrPctChange > 0.001
                      ? "text-green-500 bg-green-500 rounded bg-opacity-10 px-2 font-semibold"
                      : totalNetworth24hrPctChange < -0.001
                        ? "text-red-500 bg-red-500 rounded bg-opacity-10 px-2 font-light"
                        : "text-offwhite"
                  }`}
                >
                  {totalNetworth24hrPctChange > 0.001 
                  ? `+${totalNetworth24hrPctChange.toFixed(2)}%` 
                  : totalNetworth24hrPctChange < -0.001
                  ? `${totalNetworth24hrPctChange.toFixed(2)}%`
                  : "0.00"}
                </h3>
              )}
            </div>
            {fetching ? (
              tokens.map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full py-8 my-3 bg-char"
                />
              ))
            ) : tokens.length > 0 ? (
              <div className="">
                {tokens.map((token, tokenIndex) => (
                  <Button
                    className="w-full h-16 py-2 my-3 flex justify-between place-items-center rounded bg-chared font-normal text-offwhite hover:bg-char shadow-blackest shadow-sm"
                    key={tokenIndex}
                    onClick={() => openModal("token", token)}
                  >
                    <div className="flex gap-2 place-items-center">
                      {fetching ? (
                        <Skeleton className="w-12 h-12 bg-offwhite rounded-full" />
                      ) : (
                        <img
                          src={logoUrls[token.symbol] || noneLogo}
                          alt={`${token.symbol} Logo`}
                          className="w-12 h-12"
                        />
                      )}
                      <div className="">
                        {fetching ? (
                          <Skeleton className="h-4 w-3/4 bg-offwhite mb-1" />
                        ) : (
                          <p className="text-left truncate">
                            {token.name.length > 15
                              ? `${token.name.slice(0, 15)}...`
                              : token.name}
                          </p>
                        )}
                        {fetching ? (
                          <Skeleton className="h-4 w-1/2 bg-offwhite" />
                        ) : (
                          <p className="text-left truncate">
                            {parseFloat(token.balance_formatted).toFixed(4)}{" "}
                            {token.symbol && token.symbol.length <= 5
                              ? token.symbol
                              : "???"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="">
                      {fetching ? (
                        <Skeleton className="h-4 w-3/4 bg-offwhite mb-1" />
                      ) : (
                        <p className="text-right">
                          {token.usd_value
                            ? `$${token.usd_value.toFixed(2)}`
                            : "$0.00"}
                        </p>
                      )}
                      {fetching ? (
                        <Skeleton className="h-4 w-1/2 bg-offwhite" />
                      ) : (
                        <p
                          className={`text-right ${
                            token.usd_value_24hr_usd_change > 0.001
                              ? "text-green-500 font-semibold"
                              : token.usd_value_24hr_usd_change < -0.001
                                ? "text-red-500 font-light"
                                : "text-offwhite"
                          }`}
                        >
                          {token.usd_value && token.usd_value_24hr_usd_change
                            ? `-$${Math.abs(token.usd_value_24hr_usd_change).toFixed(2)}`
                            : "$0.00"}
                        </p>
                      )}
                    </div>
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
            <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
              {fetching ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="w-full rounded-md h-[156px] bg-blacker" />
                ))
              ) : nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <Button
                    key={index}
                    onClick={() => openModal("nft", nft)}
                    style={{ cursor: "pointer" }}
                    className="relative rounded-md w-full h-full overflow-hidden p-0 hover:bg-inherit bg-blacker shadow-blackest shadow-sm"
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
        <TabsList className="z-10 fixed grid w-[320px] grid-cols-4 h-[64px] rounded-none bg-blacker focus:bg-blacker">
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
      {isModalOpen && modalType && selectedItem && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === "nft" && 
          <NftCard 
          nft={selectedItem as Nfts}
          token={selectedItem as Tokens}
          seedPhrase={seedPhrase}
          selectedChain={selectedChain}
          refetchBalances={refetchBalances}
          closeModal={closeModal}
           />}
          {modalType === "token" &&             
          <TokenCard 
            token={selectedItem as Tokens}
            logoUrls={logoUrls}
            seedPhrase={seedPhrase}
            selectedChain={selectedChain}
            refetchBalances={refetchBalances}
            closeModal={closeModal}
          />}
        </Modal>
      )}
    </div>
  );
};

export default ViewWallet;
