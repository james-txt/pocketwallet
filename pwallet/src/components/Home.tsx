import logo from '../assets/logo.png';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import Header from './Header';


function Home() {

  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="content">
        
        <h1 className="font-semibold text-5xl tracking-tight mb-8 mt-4">pocket</h1>
        <img src={logo} loading="lazy" className="ml-5 w-6/12 grayscale-[80%]" alt="logo" />
        <Button 
          className="mt-16 mb-6 bg-sky text-blackest w-8/12"
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