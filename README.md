# pocket Wallet

Like the wallet in your pocket, pocket Wallet is a non-custodial cryptocurrency wallet that serves as a web extension for your browser. 
It provides the ability to manage tokens, NFTs, and make transfers.

https://github.com/user-attachments/assets/965b2c82-8db2-4c4e-b8ad-1d5b1dd92a6c

<hr />

## Install

You can ~install~ pocket Wallet right now:

|![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)|

## Quick Start

Before you begin, ensure you have met the following requirements:

- Node.js `20.13.1` or later
- npm `10.8.1` or later

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/james-txt/pocketwallet.git
   cd pocketwallet

2. **Install dependencies**

   ```bash
   npm install:all

3. **Add keys to `dist.env` in `\pwallet` and rename to `.env`**

4. **Build**

   ```bash
   npm build

5. **Backend is hosted on Azure**

   <s>
   cd backend
   npm run start
   </s>
6. **Load extension to your Browser**

    - Go to:
     ```bash
     chrome://extensions/
     ```
    - Check off Developer mode
    - Load unpacked `dist` folder
