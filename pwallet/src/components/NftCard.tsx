import React from "react";
import { Nfts } from "../hooks/useFetchTokensAndNfts";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"


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
        <CardContent className="p-4 py-2 border-b-2 border-blacker">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-1">
            Description:
          </CardTitle>
          <CardDescription className="text-offwhite opacity-80">
            {nft.metadata.description}
          </CardDescription>
        </CardContent>
        <CardContent className="px-4 pt-2 pb-0">
          <CardTitle className="text-base font-semibold text-lightgrey tracking-wide pb-2">
            Attributes:
          </CardTitle>
          <CardDescription className="flex flex-wrap text-offwhite text-base mb-4 pb-2">
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
      </Card>
      <Drawer setBackgroundColorOnScale={false} modal={false} handleOnly={true}>
        <DrawerTrigger className="mb-8 mt-4 w-full h-9 rounded-md px-4 py-2 inline-flex items-center justify-center whitespace-nowrap bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm">
          Send
        </DrawerTrigger>
        <DrawerContent className="modal z-10 h-[536px] rounded-none border-lightgrey bg-blacker">
          <DrawerHeader className="p-0">
            <DrawerClose className="absolute">
              <Cross1Icon
                className="z-10 absolute top-4 h-6 w-6 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
                style={{ cursor: "pointer" }}
              />
            </DrawerClose>
            <DrawerTitle>
              <h2 className="py-3 ml-6 mr-1 font-semibold text-offwhite">
                {nft.metadata.name.length > 19
                  ? `${nft.metadata.name.slice(0, 19)}...`
                  : nft.metadata.name}
                <span className="text-lightgrey"> x{nft.amount}</span>
              </h2>
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
            className="bg-blackest h-16 text-offwhite border-sky"
            placeholder="Recipient's address"
          />
          <DrawerFooter className="flex flex-row w-full gap-4 p-0 my-4">
            <DrawerClose className="w-1/2">
              <Button className="w-full bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              //disabled={}
              className="w-1/2 bg-char font-normal text-offwhite hover:bg-lightgrey shadow-blackest shadow-sm"
              //onClick={}
            >
              Send
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NftCard;
