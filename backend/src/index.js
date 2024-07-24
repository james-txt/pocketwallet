require('dotenv').config();
const express = require('express');
const Moralis = require('moralis').default;
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve logos
app.get('/logo', (req, res) => {
  const { symbol } = req.query;
  const imagePath = path.join(__dirname, 'cryptoicons', `${symbol.toLowerCase()}.png`);
  try {
    const image = fs.readFileSync(imagePath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } catch (err) {
    console.error(err);
    res.status(404).send('Image not found');
  }
});

// Fetch tokens and NFTs
app.get('/getTokens', async (req, res) => {
  const { userAddress, chain } = req.query;

  try {
    const tokens = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: chain,
      address: userAddress,
    });

    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chain,
      address: userAddress,
      normalizeMetadata: true,
      mediaItems: false,
      excludeSpam: true,
    });

    const tokensHistory = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: chain,
      order: "DESC",
      address: userAddress,
    });

    const nftsHistory = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      chain: chain,
      order: "DESC",
      address: userAddress,
    });

    // Combine and sort the histories by blockTimestamp
    const walletHistory = [...tokensHistory.result, ...nftsHistory.result];
    walletHistory.sort((a, b) => new Date(b.blockTimestamp) - new Date(a.blockTimestamp));


    const jsonResponse = {
      tokens: tokens.result,
      nfts: nfts.result,
      historys: walletHistory,
    };

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});

// Test URLs:
// http://localhost:3000/getTokens?userAddress=0x887E3DB0D16807730fA40619c70C4846a79cA854&chain=0x1
// http://localhost:3000/logo?symbol=eth
