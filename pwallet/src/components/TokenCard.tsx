// NftCard.tsx
import React from "react";
import { Tokens } from "../hooks/useFetchTokensAndNfts";
import noneLogo from "../assets/none.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

interface TokenCardProps {
  token: Tokens;
  logoUrls: { [symbol: string]: string };
}

const TokenCard: React.FC<TokenCardProps> = ({ token, logoUrls }) => {
  return (
    <div className="">
      <div className="">
        <h2 className="py-3">
          {token.name.length > 19
            ? `${token.name.slice(0, 19)}...`
            : token.name}
          <span className="text-lightgrey"></span>
        </h2>
      </div>
      <img
        src={logoUrls[token.symbol] || noneLogo}
        alt={`${token.symbol} Logo`}
        className="w-auto h-auto mx-auto mb-4 rounded-full shadow-blackest shadow-sm"
      />

      <Card className="w-[320px] rounded-md bg-chared shadow-blackest shadow-sm text-offwhite text-left border-none">
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
            {token.usd_price || "???"} USD
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
    </div>
  );
};

export default TokenCard;
