// hooks/useFetchTokensAndNfts.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fetchLogo } from "./fetchLogo";

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
  metadata: {
    name: string;
    image: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  tokenId: number;
}

interface FetchResult {
  tokens: Tokens[];
  nfts: Nfts[];
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
          image: transformNftImageUrl(nft.metadata.image),
        },
      }));

      setNfts(transformedNfts);
      setTokens(response.tokens);

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

  return { tokens, nfts, fetching, logoUrls, refetch: getAccountTokens};
};

export default useFetchTokensAndNfts;
