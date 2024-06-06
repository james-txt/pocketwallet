import React, { useState, useEffect, useCallback } from "react";
import { DashboardIcon, ActivityLogIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import NftCard from "./NftCard";
import TokenCard from "./TokenCard";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import noneLogo from "../assets/none.png";
import { fetchLogo } from "../utils/fetchLogo";
import { calculateTotalNetworth } from "@/utils/calculateNetworth";
export type { Tokens };

interface ViewWalletProps {
  wallet: string | null;
  selectedChain: string;
}

interface Tokens {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_price: number;
  usd_price_24hr_percent_change: number;
  usd_price_24hr_usd_change: number;
  usd_value: number;
  portfolio_percentage: number;
  balance_formatted: string;
  native_token: boolean;
}

interface Nfts {
  metadata: {
    image: string;
    name:string;
}}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet, selectedChain }) => {
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [fadeInClass, setFadeInClass] = useState('');
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");
  const [nfts, setNfts] = useState<Nfts[]>([]);
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const [fetching, setFetching] = useState(false);
  const [logoUrls, setLogoUrls] = useState<{ [symbol: string]: string }>({});

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
    }, 100);
  };

  const openModal = (modalType: "nft" | "token") => {
    setFadeClass('fade-in');
    if (modalType === "nft") {
      setIsNftModalOpen(true);
    } else if (modalType === "token") {
      setIsTokenModalOpen(true);
    }
  };

  const closeModal = (modalType: "nft" | "token") => {
    setFadeClass('fade-out');
    setTimeout(() => {
      if (modalType === "nft") {
        setIsNftModalOpen(false);
      } else if (modalType === "token") {
        setIsTokenModalOpen(false);
      }
      setFadeInClass('');
    }, 100);
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
      setTokens(response.tokens);

      // Fetch logos for each token
      const newLogoUrls = await Promise.all(
        response.tokens.map(async (token: Tokens) => {
          const logoUrl = await fetchLogo(token.symbol);
          return { symbol: token.symbol, url: logoUrl };
        })
      );
      const logoUrlMap = newLogoUrls.reduce((acc, { symbol, url }) => {
        acc[symbol] = url;
        return acc;
      }, {} as { [symbol: string]: string });

      setLogoUrls(logoUrlMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  }, [wallet, selectedChain]);

  const totalNetworth = calculateTotalNetworth(tokens);

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts([]);
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
                    className="w-full h-16 py-3 my-3 grid grid-cols-2 rounded bg-char font-normal text-offwhite hover:bg-lightgrey"
                    key={tokenIndex}
                    onClick={() => openModal("token")}
                  >
                    <div className="01 justify-self-start flex flex-col gap-1 truncate">
                      <img
                        src={logoUrls[token.symbol] || noneLogo}
                        alt={`${token.symbol} Logo`}
                        className="w-6 h-6"
                      />
                      <p className="text-left">{token.name}</p>
                    </div>
                    <div className="02 justify-self-end flex flex-col gap-1">
                      <p className="text-right">
                        {parseFloat(token.balance_formatted).toFixed(4)}{" "}
                        {token.symbol && token.symbol.length <= 5
                          ? token.symbol
                          : "???"}
                      </p>
                      <p className="text-right">
                        {token.usd_value
                          ? `$${token.usd_value.toFixed(2)}`
                          : "$?.??"}
                      </p>
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
            <div className="grid grid-cols-2 gap-2 mt-2">
              {fetching ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="w-full rounded-md h-32" />
                ))
              ) : nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <Button
                    key={index}
                    onClick={() => openModal("nft")}
                    style={{ cursor: "pointer" }}
                    className="relative rounded-md w-full h-full overflow-hidden p-0 hover:bg-blackest bg-blackest"
                  >
                    <img
                      src={nft.metadata.image}
                      alt={`nft-${index}`}
                      className="object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-blackest bg-opacity-80 text-offwhite rounded-md m-2 px-2 py-0.5 truncate">
                      {nft.metadata.name}
                    </div>
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
        <TabsList className="fixed grid w-[320px] grid-cols-4 h-[54px] rounded-none bg-blacker focus:bg-blacker">
          <TabsTrigger
            value="tokenTab"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("tokenTab")}
          >
            <FontAwesomeIcon size="xl" icon={faWallet} />
          </TabsTrigger>
          <TabsTrigger
            value="nftTab"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("nftTab")}
          >
            <DashboardIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="activityTab"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("activityTab")}
          >
            <ActivityLogIcon className="h-6 w-6 flex-shrink-0" />
          </TabsTrigger>
          <TabsTrigger
            value="transferTab"
            className="bg-blacker rounded-none text-base pt-3 text-lightgrey hover:text-offwhite focus:bg-blacker outline-none border-t-2 border-t-transparent data-[state=active]:bg-blacker data-[state=active]:text-sky data-[state=active]:border-sky data-[state=active]:border-t-2 transition-colors duration-50"
            onClick={() => handleTabChange("transferTab")}
          >
            <FontAwesomeIcon size="xl" icon={faArrowRightArrowLeft} />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {currentTab === "nftTab" && (
        <Modal
          show={isNftModalOpen}
          onClose={() => closeModal("nft")}
          animationClass={fadeInClass}
        >
          <NftCard />
        </Modal>
      )}

      {currentTab === "tokenTab" && (
        <Modal
          show={isTokenModalOpen}
          onClose={() => closeModal("token")}
          animationClass={fadeInClass}
        >
          <TokenCard />
        </Modal>
      )}
    </div>
  );
};

export default ViewWallet;
