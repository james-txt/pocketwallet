import React from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationClass?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, animationClass }) => {
  if (!isOpen) { 
    return null;
  }

  return (
    <div className={`fixed z-10 modal bg-blacker border-lightgrey border border-t-0 ${animationClass}`}>
      <Cross1Icon 
        className="z-10 absolute top-4 left-4 h-6 w-6 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />
      {children}
    </div>
  );
};

export default Modal;
