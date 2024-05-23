import React from 'react';

interface ViewWalletProps {
  wallet: string | null;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ wallet }) => {
  return (
    <div className="content">
          <h2>Your Wallet Address:</h2>
          <p className='text-sm'>{wallet}</p>
    </div>
  );
}

export default ViewWallet;
