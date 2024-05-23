import logoSM from "../assets/logoSM.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Header() {
  const navigate = useNavigate();
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <header>
      <img
        src={logoSM}
        className="h-[50px] ml-3"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
        loading="lazy"
        alt="logoSM"
      />
      <Select
        onValueChange={(val) => setSelectedChain(val)}
        value={selectedChain}
      >
        <SelectTrigger className="w-28 mr-3 bg-blackest border-none">
          <SelectValue placeholder="Ethereum" />
        </SelectTrigger>
        <SelectContent className="min-w-0 bg-blackest text-offwhite border-blacker">
          <SelectItem value="0x1">Ethereum</SelectItem>
          <SelectItem value="0x89">Polygon</SelectItem>
          <SelectItem value="0xa86a">Avalanche</SelectItem>
        </SelectContent>
      </Select>
    </header>
  );
}

export default Header;
