import { Cross1Icon } from '@radix-ui/react-icons';

const Modal = ({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!show) return null;

  return (
    <div className="fixed z-10 modal bg-blacker border-lightgrey border border-t-0">
      <Cross1Icon className="z-10 absolute top-4 left-4 h-6 w-6 text-lightgrey hover:text-offwhite transition-colors duration-200 ease-in-out"
      onClick={onClose}
      style={{ cursor: "pointer" }}/>
      {children}
    </div>
  );
};

export default Modal;
