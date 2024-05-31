import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Button } from "@/components/ui/button"


function Home() {

  const navigate = useNavigate();

  return (
       <div className="content">
        <h1 className="font-semibold text-5xl tracking-tight mb-7 mt-7">pocket</h1>
        <img src={logo} loading="lazy" className="ml-5 w-6/12" alt="logo" />
        <Button 
          className="mt-16 mb-7 bg-sky text-blackest w-10/12"
          onClick={() => navigate('/create')}
          >
            Create a Wallet
        </Button>
        <Button 
        className="mb-16 bg-amber w-10/12" 
        variant="secondary"
        onClick={() => navigate('/recover')}
        >
          Sign in With Seed Phrase
        </Button>
        <p className="text-sm text-center">
            &copy; 2024 pocket wallet™</p>
      </div>
  )
}

export default Home;