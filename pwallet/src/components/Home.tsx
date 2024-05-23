import logo from '../assets/logo.png';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoSM from '../assets/logoSM.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function Home() {
  const [selectedChain, setSelectedChain] = useState("0x1")
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <img src={logoSM} className="h-[50px] ml-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} loading='lazy' alt="logoSM" />
        <Select 
        onValueChange={(val)=>setSelectedChain(val)} 
        value={selectedChain}>
          <SelectTrigger className="w-32 mr-3 bg-blackest border-none">
            <SelectValue placeholder="Ethereum"/>
          </SelectTrigger>
          <SelectContent className="bg-blackest text-offwhite border-blacker">
            <SelectItem value="0x1">Ethereum</SelectItem>
            <SelectItem value="0x89">Polygon</SelectItem>
            <SelectItem value="0xa86a">Avalanche</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <div className="content">
        <h1 className="font-semibold text-5xl tracking-tight mb-8 mt-4">pocket</h1>
        <img src={logo} loading="lazy" className="ml-5 mb-5 w-6/12 grayscale-[80%]" alt="logo" />
        <Button 
          className="mt-12 mb-5 bg-sky text-blackest w-8/12"
          onClick={() => navigate('/create')}
          >
            Create a Wallet
        </Button>
        <Button 
        className="mb-16 bg-amber w-8/12" 
        variant="secondary"
        onClick={() => navigate('/recover')}
        >
          Sign in With Seed Phrase
        </Button>
        <p className="text-sm text-center">
            &copy; 2024 pocket wallet™</p>
      </div>
    </div>
  )
}

export default Home;