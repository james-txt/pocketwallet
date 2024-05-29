import { useState, useEffect } from "react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import nftLG from '../assets/nftLG.png'
import Modal from './Modal';
import NftCard from './NftCard';


interface ViewWalletProps {
  wallet: string | null;
}

const tokenslist = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 10000000000000,
    decimals: 18,
    usd: "$1000",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 10000000000000,
    decimals: 18,
    usd: "$1000",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 10000000000000,
    decimals: 18,
    usd: "$1000",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 10000000000000,
    decimals: 18,
    usd: "$1000",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 10000000000000,
    decimals: 18,
    usd: "$1000",
  },
  {    symbol: "ETH",
  name: "Ethereum",
  balance: 10000000000000,
  decimals: 18,
  usd: "$1000",
  },
  {    symbol: "ETH",
  name: "Ethereum",
  balance: 10000000000000,
  decimals: 18,
  usd: "$1000",
  }
]

const networth = {totalnetworth: 100000}


const ViewWallet: React.FC<ViewWalletProps> = ({ wallet }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("tokenTab");
  const [fadeClass, setFadeClass] = useState("fade-in-left");

  const handleTabChange = (value: string) => {
    setFadeClass("fade-out-right");
    setTimeout(() => {
      setCurrentTab(value);
      setFadeClass("fade-in-left");
    }, 100);
  };

  useEffect(() => {
    setFadeClass("fade-in-left");
  }, [currentTab, wallet]);

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
              ${networth.totalnetworth}
            </h2>
            <div>
              {tokenslist.map((token) => (
                <Button
                  className="w-full py-8 my-3 flex justify-between rounded bg-char font-normal text-offwhite hover:bg-lightgrey"
                  key={token.symbol}
                >
                  <div className="flex flex-col">
                    <p className="">{token.symbol}</p>
                    <p className="">{token.name}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="">
                      {(token.balance / 10 ** token.decimals).toFixed(2)} Tokens
                    </p>
                    <p className="">{token.usd}</p>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="nft"
            className={`absolute w-full h-full scrollbar-hide overflow-y-scroll transition-opacity duration-50 ${
              currentTab === "nft" ? fadeClass : "opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 pt-2">

              <img src={nftLG} alt="nftLG" 
              className="" 
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: "pointer" }}
              />

              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
              <img src={nftLG} alt="nftLG" className="" />
            </div>
          </TabsContent>
          <TabsContent
            value="transfer"
            className={`absolute w-full h-full transition-opacity duration-50 ${
              currentTab === "transfer" ? fadeClass : "opacity-0"
            }`}
          >
            Make changes to your account here.
          </TabsContent>
        </div>
        <TabsList className="fixed grid w-[320px] grid-cols-3 h-[54px] rounded-none bg-blacker focus:bg-blacker">
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