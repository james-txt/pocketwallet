import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { Cross1Icon } from "@radix-ui/react-icons"

const XButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Cross1Icon 
      onClick={() => navigate('/')}
      width="20"
      height="20"
      style={{ cursor: 'pointer' }}
      className="mb-4 mt-1 place-self-start w-6 h-6 text-slate-500 hover:text-offwhite transition-colors duration-100 ease-in-out"
    />
  );
};

XButton.displayName = "XButton"

export { XButton }
