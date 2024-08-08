const Moralis = require('moralis').default;

const getTokens = async (req, res) => {
  const { userAddress, chain } = req.query;

  try {
    
    // Fetch token balances and prices
    const tokens = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: chain,
      address: userAddress,
    });

    // Fetch NFTs
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chain,
      address: userAddress,
      normalizeMetadata: true,
      mediaItems: false,
      excludeSpam: true,
    });

    // Fetch token transfer history
    const tokensHistory = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: chain,
      order: 'DESC',
      address: userAddress,
    });

    // Fetch NFT transfer history
    const nftsHistory = await Moralis.EvmApi.nft.getWalletNFTTransfers({
      chain: chain,
      order: 'DESC',
      address: userAddress,
    });

    // Combine and sort the histories by blockTimestamp
    const walletHistory = [
      ...(tokensHistory.result || []),
      ...(nftsHistory.result || [])
    ];
    walletHistory.sort((a, b) => {
      const dateA = new Date(a.blockTimestamp);
      const dateB = new Date(b.blockTimestamp);
      return dateB - dateA; // Sort in descending order
    });

    const jsonResponse = {
      tokens: tokens.result || [],
      nfts: nfts.result || [],
      historys: walletHistory,
    };

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

module.exports = getTokens;
