require('dotenv').config();
const nock = require('nock');
const { createMocks } = require('node-mocks-http');
const getTokens = require('../src/routes/getTokens');
const Moralis = require('moralis').default;

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
})

describe('getTokens', () => {
  const mockUserAddress = '0x887E3DB0D16807730fA40619c70C4846a79cA854';
  const mockChain = '0x1';

  const resultsMockResponse = {
    tokens: [
      {
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        logo: "https://cdn.moralis.io/eth/0x.png",
        thumbnail: "https://cdn.moralis.io/eth/0x_thumb.png",
        decimals: 18,
        balance: "0",
        possible_spam: false,
        verified_contract: true,
        usd_price: 2344.5386867297966,
        usd_price_24hr_percent_change: -5.639834826343437,
        usd_price_24hr_usd_change: -140.13128222903697,
        usd_value_24hr_usd_change: 0,
        usd_value: 0,
        portfolio_percentage: 0,
        balance_formatted: "0",
        native_token: true
      }
    ],
    nfts: [
      {
        chain: "0x1",
        contractType: "ERC721",
        tokenAddress: "0x92133e21fff525b16d1edcf78be82297d25d1154",
        tokenId: "6363",
        tokenUri: "https://nftcdn.daz3d.com/nfp/gen1/m/6363",
        metadata: {
          attributes: [
            {
              trait_type: "Background",
              value: "Grey"
            },
          ],
          description: "Description of NFT.",
          image: "https://nftcdn.daz3d.com/nfp/gen1/i/6363",
          name: "NFP #6363"
        },
        name: "Daz3D Non-Fungible People",
        symbol: "DAZNFP",
        amount: 1,
        blockNumberMinted: "13901803",
        blockNumber: "14403213",
        ownerOf: "0x887e3db0d16807730fa40619c70c4846a79ca854",
        tokenHash: "5987c248c3e848953dcadd40f0c73e0f",
        lastMetadataSync: "2024-08-05T23:15:33.988Z",
        lastTokenUriSync: "2024-08-05T23:15:33.860Z",
        possibleSpam: false
      }
    ],
    historys: [
      {
        blockNumber: "14640180",
        blockTimestamp: "2022-04-23T09:15:03.000Z",
      },

    ]
  };

  beforeAll(() => {
    nock('https://pocketwallet.azurewebsites.net')
      .get(`/getTokens?userAddress=${mockUserAddress}&chain=${mockChain}`)
      .reply(200, resultsMockResponse);
  });

  afterAll(() => {
    nock.cleanAll();
  });

  test('fetches tokens, nfts, and historys', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        userAddress: mockUserAddress,
        chain: mockChain,
      },
    });

    await getTokens(req, res);

    expect(res._getStatusCode()).toBe(200);
    const jsonResponse = res._getJSONData();
    
    expect(jsonResponse).toHaveProperty('tokens');
    expect(jsonResponse).toHaveProperty('nfts');
    expect(jsonResponse).toHaveProperty('historys');
    
    expect(Array.isArray(jsonResponse.tokens)).toBe(true);
    expect(Array.isArray(jsonResponse.nfts)).toBe(true);
    expect(Array.isArray(jsonResponse.historys)).toBe(true);
  });

  test('handles errors', async () => {
    nock.cleanAll(); 

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        userAddress: '0x887E3DB0D16807730fA40619c70C4846a79cA123',
        chain: '0x1',
      },
    });

    await getTokens(req, res);

    expect(res._getStatusCode()).toBe(500);
    const jsonResponse = res._getJSONData();
    expect(jsonResponse).toEqual({ error: 'An error occurred while fetching data' });
  });
});
