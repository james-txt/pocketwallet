require('dotenv').config({ path: 'secrets.env' });
const express = require('express');
const Moralis = require('moralis').default;
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/getTokens', async (req, res) => {
  const { userAddress, chain } = req.query;

  try {
    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: userAddress,
      
    });

    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chain,
      address: userAddress,
      mediaItems: true,
    });

    const myNfts = nfts.raw.result
      .filter(e => e?.media?.media_collection?.high?.url && !e.possible_spam && e?.media?.category !== 'video')
      .map(e => e.media.media_collection.high.url);

    const balance = await Moralis.EvmApi.balance.getNativeBalance({
      chain: chain,
      address: userAddress,
    });

    const networth = await Moralis.EvmApi.wallets.getWalletNetWorth({
      "excludeSpam": true,
      "excludeUnverifiedContracts": true,
      chain: chain,
      address: userAddress,
    });

    const jsonResponse = {
      tokens: tokens.raw,
      nfts: myNfts,
      balance: balance.raw.balance / 10 ** 18,
      networth: networth,
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

//http://localhost:3000/getTokens?userAddress=0x887E3DB0D16807730fA40619c70C4846a79cA854&chain=0x1