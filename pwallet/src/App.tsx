import './App.css'
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import logoSM from './assets/logoSM.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import RecoverAccount from './components/RecoverAccount';


function App() {
  const [selectedChain, setSelectedChain] = useState("0x1")

  return (
    <div className="App">
      <header>
        <img src={logoSM} className="h-[50px] ml-3" alt="logoSM" />
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/recover" element={<RecoverAccount />} />
      </Routes>
    </div>
  )
};

export default App
