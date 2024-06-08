import React from "react";
import { Nfts } from "../hooks/useFetchTokensAndNfts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

interface NftCardProps {
  nft: Nfts;
}

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
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
        <CardContent className="p-4 py-2">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-1">
            Description:
          </CardTitle>
          <CardDescription className="text-amber opacity-80">
            {nft.metadata.description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default NftCard;
