import logo from '../assets/logo.png';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';



function Home() {

  const navigate = useNavigate();

  return (
    <div className="content">
      <h1 className="font-semibold text-5xl  mb-8 mt-4">pocket</h1>
      <img src={logo} className="ml-5 mb-5 w-6/12 grayscale-[80%]" alt="logo" />
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
  )
}

export default Home;