// hooks/useFetchTokensAndNfts.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fetchLogo } from "./fetchLogo";
import noneLogo from "../assets/none.png";

export interface Tokens {
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
  usd_value_24hr_usd_change: number;
  usd_value: number;
  portfolio_percentage: number;
  balance_formatted: string;
  native_token: boolean;
}

export interface Nfts {
  amount: number;
  contractType: string;
  tokenAddress: string;
  metadata: {
    name: string;
    image: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  tokenId: string;
}

export interface Historys {
  amount: number;
  blockTimestamp: string;
  chain: string;
  contractType: string;
  fromAddress: string;
  toAddress: string;
  tokenAddress: string;
  tokenDecimals: string;
  tokenName: string;
  tokenSymbol: string;
  transactionHash: string;
  valueDecimal: string;
  symbol?: string;
  image?: string;
}

interface FetchResult {
  tokens: Tokens[];
  nfts: Nfts[];
  historys: Historys[];
  fetching: boolean;
  logoUrls: { [symbol: string]: string };
  refetch: () => void;
}

const useFetchTokensAndNfts = (
  wallet: string | null,
  selectedChain: string
): FetchResult => {
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const [nfts, setNfts] = useState<Nfts[]>([]);
  const [historys, setHistorys] = useState<Historys[]>([]);
  const [fetching, setFetching] = useState(false);
  const [logoUrls, setLogoUrls] = useState<{ [symbol: string]: string }>({});

  const transformNftImageUrl = (url: string) => {
    return url.startsWith('ipfs://')
      ? 'https://ipfs.io/ipfs/' + url.slice(7)
      : url;
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
      const transformedNfts = response.nfts.map((nft: Nfts) => ({
        ...nft,
        metadata: {
          ...nft.metadata,
          image: nft.metadata.image ? transformNftImageUrl(nft.metadata.image) : noneLogo,
        },
      }));

      setNfts(transformedNfts);
      setTokens(response.tokens);

      // Combine history data
      const combinedHistorys = response.historys.map((history: Historys) => {
        const nft = response.nfts.find((nft: Nfts) => nft.tokenAddress === history.tokenAddress);

        if (nft) {
          const combinedHistory = {
            ...history,
            image: nft ? transformNftImageUrl(nft.metadata.image) : noneLogo,
          };
          return combinedHistory;
        }
        return history; // Return unchanged history if no match found
      });

      setHistorys(combinedHistorys);

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

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts([]);
    getAccountTokens();
  }, [getAccountTokens, selectedChain, wallet]);

  return { tokens, nfts, historys, fetching, logoUrls, refetch: getAccountTokens};
};

export default useFetchTokensAndNfts;
