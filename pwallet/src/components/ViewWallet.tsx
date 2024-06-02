import React, { useState, useEffect, useCallback } from "react";
import { DashboardIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import NftCard from "./NftCard";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import arbLogo from "./assets/arb.png";
import avaxLogo from "./assets/avax.png";
import baseLogo from "./assets/base.png";
import bnbLogo from "./assets/bnb.png";
import ethLogo from "./assets/eth.png";
import maticLogo from "./assets/matic.png";
import noneLogo from "./assets/none.png";
import opLogo from "./assets/op.png";


interface ViewWalletProps {
  wallet: string | null;
  selectedChain: string;
}

interface Chains {
  chain: string;
  native_balance_formatted: string;
  networth_usd: string;
  name: string;
  symbol: string;
}

interface Tokens {
  chain: string;
  native_balance_formatted: string;
  networth_usd: string;
  name: string;
  symbol: string;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, selectedChain }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");
  const [nfts, setNfts] = useState<string[]>([]);
  const [chains, setChains] = useState<Chains[]>([]);
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const [totalNetworth, setTotalNetworth] = useState<string>("0.00");
  const [fetching, setFetching] = useState(false);

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
    }, 100);
  };

  const getChainLogo = (symbol: string) => {
    switch (symbol) {
      case "arb":
        return arbLogo;
      case "avax":
        return avaxLogo;
      case "base":
        return baseLogo;
      case "bnb":
        return bnbLogo;
      case "eth":
        return ethLogo;
      case "matic":
        return maticLogo;
      case "op":
        return opLogo;
      default:
        return noneLogo;
    }
  };

  const getAccountTokens = useCallback(async () => {
    setFetching(true);

    try {
      const res = await axios.get("http://localhost:3000/getTokens", {
        params: {
          userAddress: wallet,
          chain: selectedChain,
        },
      });

      const response = res.data;
      console.log(response);

      if (response.nfts.length > 0) {
        setNfts(response.nfts);
      }
      setChains(response.chains);
      setTokens(response.tokens);
      setTotalNetworth(response.networth_usd);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  }, [wallet, selectedChain]);

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts([]);
    setChains([]);
    setTotalNetworth("0.00");
    getAccountTokens();
  }, [getAccountTokens, selectedChain, wallet]);

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
            <h2 className="pt-3 pb-5 text-3xl font-semibold tracking-tight">
              ${parseFloat(totalNetworth).toFixed(2)}
            </h2>
            {fetching ? (
              <Skeleton className="w-full py-8 my-3" />
            ) : chains.length > 0 ? (
              <div>
                {chains.map((chain, index) => (
                  <div key={index}>
                    <h2 className="text-lg font-bold">{chain.name}</h2>
                    <img
                      src={getChainLogo(chain.symbol)}
                      alt={`${chain.symbol} Logo`}
                      className="w-6 h-6"
                    />

                    <p className="">
                      {parseFloat(chain.native_balance_formatted).toFixed(5)}{" "}
                      {chain.symbol}
                    </p>
                    <p className="">
                      ${parseFloat(chain.networth_usd).toFixed(2)}
                    </p>

                    {tokens.map((token, tokenIndex) => (
                      <Button
                        className="w-full py-8 my-3 flex justify-between rounded bg-char font-normal text-offwhite hover:bg-lightgrey"
                        key={tokenIndex}
                      >
                        <div className="flex flex-col">
                          <img
                            src={getChainLogo(chain.symbol)}
                            alt={`${chain.symbol} Logo`}
                            className="w-6 h-6"
                          />
                          <p className="">{token.name}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="">
                            {parseFloat(token.native_balance_formatted).toFixed(
                              5
                            )}{" "}
                            {token.symbol}
                          </p>
                          <p className="">
                            ${parseFloat(token.networth_usd).toFixed(2)}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-lightgrey">No tokens found.</p>
            )}
          </TabsContent>
          <TabsContent
            value="nft"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "nft" ? fadeClass : "opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 pt-2">
              {fetching ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-32" />
                ))
              ) : nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <img
                    key={index}
                    src={nft}
                    alt={`nft-${index}`}
                    className=""
                    onClick={() => setIsModalOpen(true)}
                    style={{ cursor: "pointer" }}
                  />
                ))
              ) : (
                <p className="col-span-2 text-center text-lightgrey">
                  No NFTs found.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent
            value="activity"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "activity" ? fadeClass : "opacity-0"
            }`}
          >
            Display activity log of your account here.
          </TabsContent>
          <TabsContent
            value="transfer"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "transfer" ? fadeClass : "opacity-0"
            }`}
          >
            Make transfers in your account here.
          </TabsContent>
        </div>
        <TabsList className="fixed grid w-[320px] grid-cols-4 h-[54px] rounded-none bg-blacker focus:bg-blacker">
          <TabsTrigger
            value="tokenTab"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("tokenTab")}
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
            value="activity"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("activity")}
          >
            <ActivityLogIcon className="h-6 w-6 flex-shrink-0" />
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
      {currentTab === "nft" && (
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NftCard />
        </Modal>
      )}
    </div>
  );
};

export default ViewWallet;
