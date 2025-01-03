import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import NftCard from "./NftCard";
import TokenCard from "./TokenCard";
import HistoryCard from "./HistoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import noneLogo from "../assets/none.png";
import { calculateTotalNetworth, calculateNetworth24hrUsdChange, calculateNetworth24hrPctChange } from "@/utils/calculateNetworth";
import useFetchTokensAndNfts from "../hooks/useFetchTokensAndNfts";
import { Nfts, Tokens, Historys } from "../hooks/useFetchTokensAndNfts";
import { ChainKey } from '../utils/chains';

interface ViewWalletProps {
  wallet: string;
  seedPhrase: string;
  selectedChain: ChainKey;
}

const groupHistoryByDate = (historys: Historys[]) => {
  return historys.reduce((groups: { [key: string]: Historys[] }, history) => {
    const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(history.blockTimestamp));
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(history);
    return groups;
  }, {});
};

// ** Insert Local Testing Script Here ** //

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, selectedChain, seedPhrase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"nft" | "token" | "history" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Nfts | Tokens | Historys | null>(null);
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");

  const { tokens, nfts, historys, fetching, logoUrls, refetch } = useFetchTokensAndNfts(
    wallet,
    selectedChain
  );

  const groupedHistorys = useMemo(() => groupHistoryByDate(historys), [historys]);

  const handleTabChange = useCallback((value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
      closeModal();
    }, 100);
  }, []);

  const openModal = useCallback((type: "nft" | "token" | "history", item: Nfts | Tokens | Historys | null = null) => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalType(null);
  }, []);

  useEffect(() => {
    closeModal();
  }, [selectedChain, closeModal]);

  const { totalNetworth, totalNetworth24hrUsdChange, totalNetworth24hrPctChange } = useMemo(() => ({
    totalNetworth: parseFloat(calculateTotalNetworth(tokens).toFixed(2)),
    totalNetworth24hrUsdChange: parseFloat(calculateNetworth24hrUsdChange(tokens).toFixed(2)),
    totalNetworth24hrPctChange: parseFloat(calculateNetworth24hrPctChange(tokens).toFixed(2))
  }), [tokens]);

  const refetchBalances = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const renderTokenTab = () => (
    <>
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
        <Skeleton key={index} className="w-full py-8 my-3 bg-char" />
      ))
    ) : tokens.length > 0 ? (
      <div>
        {tokens.map((token, tokenIndex) => (
          <Button
            className="w-full h-16 py-2 my-3 flex justify-between place-items-center rounded bg-chared font-normal text-offwhite hover:bg-char shadow-blackest shadow-sm"
            key={tokenIndex}
            data-testid={`token-${token.symbol}`}
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
              <div>
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
                    {token.symbol.slice(0, 5)}
                  </p>
                )}
              </div>
            </div>
            <div>
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
                    (token.usd_value_24hr_usd_change ?? 0) > 0.001
                      ? "text-green-500 font-semibold"
                      : (token.usd_value_24hr_usd_change ?? 0) < -0.001
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
    </>
  );

  const renderNftTab = () => (
    <>
    <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
    {fetching ? (
      Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full rounded-md h-[156px] bg-blacker"
        />
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
  </>
  );

  const renderHistoryTab = () => (
    <>
      <h2 className="text-center text-offwhite mb-2">Recent Activity</h2>
      {fetching ? (
        <Skeleton className="w-full py-8 mt-10 bg-char" />
      ) : Object.keys(groupedHistorys).length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          {Object.entries(groupedHistorys).map(
            ([date, historyItems], index) => (
              <div key={index} className="w-full max-w-sm mb-1">
                <h4 className="text-left text-lightgrey mb-2">{date}</h4>
                {historyItems.map((history, historyIndex) => (
                  <Button
                    className="w-full h-16 p-2 px-4 mt-1 mb-3 flex justify-between place-items-center rounded bg-chared font-normal text-offwhite hover:bg-char shadow-blackest shadow-sm"
                    key={historyIndex}
                    onClick={() => openModal("history", history)}
                  >
                    <div className="flex gap-2 place-items-center">
                      {fetching ? (
                        <Skeleton className="w-12 h-12 bg-offwhite rounded-full" />
                      ) : history.contractType === "ERC1155" ||
                        history.contractType === "ERC721" ||
                        history.contractType === "ERC721A" ? (
                        <img
                          src={history.image || noneLogo}
                          alt={`${history.tokenSymbol} Logo`}
                          className="w-12 h-12"
                        />
                      ) : (
                        <img
                          src={logoUrls[history.tokenSymbol] || noneLogo}
                          alt={`${history.tokenSymbol} Logo`}
                          className="w-12 h-12"
                        />
                      )}
                      <div>
                        {fetching ? (
                          <Skeleton className="h-4 w-3/4 bg-offwhite mb-1" />
                        ) : (
                          <p className="text-left truncate">
                            {history.toAddress.toLowerCase() ===
                            wallet.toLowerCase()
                              ? "Received"
                              : history.fromAddress.toLowerCase() ===
                                  wallet.toLowerCase()
                                ? "Sent"
                                : ""}
                          </p>
                        )}
                        {fetching ? (
                          <Skeleton className="h-4 w-1/2 bg-offwhite" />
                        ) : (
                          <p className="text-left truncate">
                            {history.toAddress.toLowerCase() ===
                            wallet.toLowerCase()
                              ? `From: ${history.fromAddress.slice(0, 10)}...`
                              : history.fromAddress.toLowerCase() ===
                                  wallet.toLowerCase()
                                ? `To: ${history.toAddress.slice(0, 10)}...`
                                : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      {fetching ? (
                        <Skeleton className="h-4 w-3/4 bg-offwhite mb-1" />
                      ) : (
                        <p
                          className={`text-right truncate ${
                            history.toAddress.toLowerCase() ===
                            wallet.toLowerCase()
                              ? "text-green-500 font-semibold"
                              : history.fromAddress.toLowerCase() ===
                                  wallet.toLowerCase()
                                ? "text-red-500 font-light"
                                : "text-offwhite"
                          }`}
                        >
                          {history.toAddress.toLowerCase() ===
                          wallet.toLowerCase()
                            ? `+${history.valueDecimal ? parseFloat(history.valueDecimal).toFixed(3) : history.amount} ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`
                            : history.fromAddress.toLowerCase() ===
                                wallet.toLowerCase()
                              ? `-${history.valueDecimal ? parseFloat(history.valueDecimal).toFixed(3) : history.amount} ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`
                              : `0 ${history.tokenSymbol ? history.tokenSymbol.slice(0, 5) : ""}`}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-center text-lightgrey">No history found.</p>
      )}
    </>
  );

  const renderSwapTab = () => (
  <>
  Make token swaps in your account here.
  </>
  );

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
            aria-label="Tokens"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "tokenTab" ? fadeClass : "opacity-0"
            }`}
          >
            {renderTokenTab()}
          </TabsContent>
          <TabsContent
            value="nftTab"
            aria-label="NFTs"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "nftTab" ? fadeClass : "opacity-0"
            }`}
          >
            {renderNftTab()}
          </TabsContent>
          <TabsContent
            value="historyTab"
            aria-label="History"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "historyTab" ? fadeClass : "opacity-0"
            }`}
          >
            {renderHistoryTab()}
          </TabsContent>
          <TabsContent
            value="swapTab"
            aria-label="Swap"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "swapTab" ? fadeClass : "opacity-0"
            }`}
          >
            {renderSwapTab()}
          </TabsContent>
        </div>
        <TabsList className="z-10 fixed grid w-[320px] grid-cols-4 h-[64px] rounded-none bg-blacker focus:bg-blacker">
          <TabsTrigger
            value="tokenTab"
            data-testid="token-tab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("tokenTab")}
          >
            <FontAwesomeIcon size="xl" icon={faWallet} />
          </TabsTrigger>
          <TabsTrigger
            value="nftTab"
            data-testid="nft-tab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("nftTab")}
          >
            <DashboardIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="historyTab"
            data-testid="history-tab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("historyTab")}
          >
            <ActivityLogIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="swapTab"
            data-testid="swap-tab"
            className="bg-blacker rounded-none text-base p-4 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:shadow-none data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("swapTab")}
          >
            <FontAwesomeIcon size="xl" icon={faArrowRightArrowLeft} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {isModalOpen && modalType && selectedItem && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === "nft" && (
            <NftCard
              nft={selectedItem as Nfts}
              token={selectedItem as Tokens}
              seedPhrase={seedPhrase}
              selectedChain={selectedChain}
              refetchBalances={refetchBalances}
              closeModal={closeModal}
            />
          )}
          {modalType === "token" && (
            <TokenCard
              token={selectedItem as Tokens}
              logoUrls={logoUrls}
              seedPhrase={seedPhrase}
              selectedChain={selectedChain}
              refetchBalances={refetchBalances}
              closeModal={closeModal}
            />
          )}
          {modalType === "history" && (
            <HistoryCard
              history={selectedItem as Historys}
              wallet={wallet}
              logoUrls={logoUrls}
              selectedChain={selectedChain}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default ViewWallet;
