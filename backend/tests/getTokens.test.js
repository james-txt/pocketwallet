require('dotenv').config();
const nock = require('nock');
const { createMocks } = require('node-mocks-http');
const getTokens = require('../src/routes/getTokens');
const Moralis = require('moralis').default;

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
});

describe('getTokens', () => {
  const mockUserAddress = '0x58389591c0786f875744119f79Db8a6ecbc3c3e7';
  const mockChain = '0xaa36a7';

  const resultsMockResponse = {
    tokens: [
      {
        token_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        name: "Ether",
        symbol: "ETH",
        logo: "https://cdn.moralis.io/eth/0x.png",
        thumbnail: "https://cdn.moralis.io/eth/0x_thumb.png",
        decimals: 18,
        balance: "9858362698317937",
        possible_spam: false,
        verified_contract: true,
        usd_price: null,
        usd_price_24hr_percent_change: null,
        usd_price_24hr_usd_change: null,
        usd_value_24hr_usd_change: null,
        usd_value: null,
        portfolio_percentage: 0,
        balance_formatted: "0.009858362698317937",
        native_token: true,
        total_supply: null,
        total_supply_formatted: null,
        percentage_relative_to_total_supply: null
      },
      {
        token_address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        name: "ChainLink Token",
        symbol: "LINK",
        logo: null,
        thumbnail: null,
        decimals: 18,
        balance: "1000000000000000000",
        possible_spam: false,
        verified_contract: false,
        usd_price: null,
        usd_price_24hr_percent_change: null,
        usd_price_24hr_usd_change: null,
        usd_value_24hr_usd_change: null,
        usd_value: null,
        portfolio_percentage: 0,
        balance_formatted: "1",
        native_token: false,
        total_supply: "1000000000000000000000000000",
        total_supply_formatted: "1000000000",
        percentage_relative_to_total_supply: 1e-7
      }
    ],
    nfts: [
      {
        chain: "0xaa36a7",
        contractType: "ERC721",
        tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
        tokenId: "70",
        tokenUri: "https://ipfs.moralis.io:2053/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/70",
        metadata: {
          name: "Azuki #70",
          image: "ipfs://QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/70.png",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Hair", value: "Teal Bun" },
            { trait_type: "Neck", value: "Tribal Tattoo" },
            { trait_type: "Clothing", value: "Red Floral Kimono" },
            { trait_type: "Eyes", value: "Determined" },
            { trait_type: "Mouth", value: "Lipstick" },
            { trait_type: "Offhand", value: "Banner" },
            { trait_type: "Background", value: "Off White B" }
          ]
        },
        name: "Azuki",
        symbol: "Azuki",
        amount: 1,
        blockNumber: "6462871",
        ownerOf: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        tokenHash: "29d53089e5adde5893772a21a7c6be75",
        lastMetadataSync: "2024-08-08T22:24:55.721Z",
        lastTokenUriSync: "2024-08-08T22:24:55.696Z",
        possibleSpam: false
      },
      {
        chain: "0xaa36a7",
        contractType: "ERC1155",
        tokenAddress: "0x68a26793bc3175930b81f02b9fda0cde47175159",
        tokenId: "0",
        tokenUri: "https://ipfs.moralis.io:2053/ipfs/Qmf3iMVcsrx6kXCCD4CW2NNhznn7YvR8NBkaxszfbtPCZm/0",
        metadata: {
          name: "token-name-0",
          description: "this is example nft token no.0",
          image: "ipfs://QmZY3rt3SVyLu4w7GF14yPbwJLbeBdcCJsD4YwhpMg1qek/0.png"
        },
        name: "R Test Collection",
        symbol: "RTC",
        amount: 2,
        blockNumber: "6462842",
        ownerOf: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        tokenHash: "a4c5204dee52de929ec9606d804b8dbb",
        lastMetadataSync: "2024-07-23T11:38:09.930Z",
        lastTokenUriSync: "2024-07-23T11:38:09.904Z",
        possibleSpam: false
      }
    ],
    historys: [
      {
        blockNumber: "6462871",
        blockTimestamp: "2024-08-08T21:12:00.000Z",
        blockHash: "0x4e0386079a93e90214e208ac5401de3beb24073cb7f76dcbb2f527c0b076b615",
        transactionHash: "0x9b0a8fb4844af8a351a70aa2136b36f3fbf28263cff89c2169fd66eecdf4d0b0",
        transactionIndex: 95,
        logIndex: 198,
        value: "0",
        contractType: "ERC721",
        transactionType: "Single",
        tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
        tokenId: "70",
        fromAddressEntity: null,
        fromAddressEntityLogo: null,
        fromAddress: "0x887e3db0d16807730fa40619c70c4846a79ca854",
        fromAddressLabel: null,
        toAddressEntity: null,
        toAddressEntityLogo: null,
        toAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        toAddressLabel: null,
        amount: 1,
        verified: 1,
        possibleSpam: false,
        verifiedCollection: false,
        chain: "0xaa36a7"
      },
      {
        blockNumber: "6462858",
        blockTimestamp: "2024-08-08T21:08:48.000Z",
        blockHash: "0x81b2347dea1ece9f91217a37924726657e064305c05320b270a31de9bc8dda1b",
        transactionHash: "0x3eca5bf08470b7b36e20767799d97cab926ed5387bde9ab6a0f46f12b887db79",
        transactionIndex: 97,
        logIndex: 463,
        value: "0",
        contractType: "ERC721",
        transactionType: "Single",
        tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
        tokenId: "70",
        fromAddressEntity: null,
        fromAddressEntityLogo: null,
        fromAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        fromAddressLabel: null,
        toAddressEntity: null,
        toAddressEntityLogo: null,
        toAddress: "0x887e3db0d16807730fa40619c70c4846a79ca854",
        toAddressLabel: null,
        amount: 1,
        verified: 1,
        possibleSpam: false,
        verifiedCollection: false,
        chain: "0xaa36a7"
      },
      {
        tokenName: "ChainLink Token",
        tokenSymbol: "LINK",
        tokenLogo: null,
        tokenDecimals: "18",
        fromAddressEntity: null,
        fromAddressEntityLogo: null,
        fromAddress: "0xc798b49942df6140db2455d614fd144779f952b1",
        fromAddressLabel: null,
        toAddressEntity: null,
        toAddressEntityLogo: null,
        toAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        toAddressLabel: null,
        address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
        blockHash: "0xff3b4cc0eb0530e713a73de488aa225233a8ab782fcf71f683319406f9a825c9",
        blockNumber: "6462842",
        blockTimestamp: "2024-08-08T21:04:36.000Z",
        transactionHash: "0xc75e3e92b169b3a14f8b1e905f4e8b660d2b157484f0e1ec71d5471a55e97ccd",
        transactionIndex: 154,
        logIndex: 296,
        value: "1000000000000000000",
        possibleSpam: false,
        valueDecimal: "1",
        verifiedContract: false,
        chain: "0xaa36a7"
      },
      {
        blockNumber: "6462842",
        blockTimestamp: "2024-08-08T21:04:36.000Z",
        blockHash: "0xff3b4cc0eb0530e713a73de488aa225233a8ab782fcf71f683319406f9a825c9",
        transactionHash: "0xcd43a2f24e2c2b77c33a458279ce512475f9cf7fcf52d28b95c772ebf7f18bf1",
        transactionIndex: 139,
        logIndex: 281,
        value: "0",
        contractType: "ERC1155",
        transactionType: "Single",
        tokenAddress: "0x68a26793bc3175930b81f02b9fda0cde47175159",
        tokenId: "0",
        fromAddressEntity: null,
        fromAddressEntityLogo: null,
        fromAddress: "0xc798b49942df6140db2455d614fd144779f952b1",
        fromAddressLabel: null,
        toAddressEntity: null,
        toAddressEntityLogo: null,
        toAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        toAddressLabel: null,
        amount: 2,
        verified: 1,
        operator: "0xc798b49942df6140db2455d614fd144779f952b1",
        possibleSpam: false,
        verifiedCollection: false,
        chain: "0xaa36a7"
      },
      {
        blockNumber: "6462842",
        blockTimestamp: "2024-08-08T21:04:36.000Z",
        blockHash: "0xff3b4cc0eb0530e713a73de488aa225233a8ab782fcf71f683319406f9a825c9",
        transactionHash: "0x3c94d21e0b55d9fe683bdcea495c92288e82512e908ca19a5673afecb97ecb05",
        transactionIndex: 129,
        logIndex: 271,
        value: "0",
        contractType: "ERC721",
        transactionType: "Single",
        tokenAddress: "0x7b2a53daf97ea7aa31b646e079c4772b6198ae9b",
        tokenId: "70",
        fromAddressEntity: null,
        fromAddressEntityLogo: null,
        fromAddress: "0xc798b49942df6140db2455d614fd144779f952b1",
        fromAddressLabel: null,
        toAddressEntity: null,
        toAddressEntityLogo: null,
        toAddress: "0x58389591c0786f875744119f79db8a6ecbc3c3e7",
        toAddressLabel: null,
        amount: 1,
        verified: 1,
        possibleSpam: false,
        verifiedCollection: false,
        chain: "0xaa36a7"
      }
    ]
  };
  

  beforeAll(() => {
    nock('https://pocketwallet.azurewebsites.net/')
      .get(`/getTokens?userAddress=${mockUserAddress}&chain=${mockChain}`)
      .reply(200, resultsMockResponse);
  });

  afterAll(() => {
    nock.cleanAll();
  });

  test('should return correct tokens, nfts, and historys', async () => {
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


  expect(jsonResponse.tokens).toEqual(resultsMockResponse.tokens);


  expect(jsonResponse.nfts.length).toBe(resultsMockResponse.nfts.length);
  jsonResponse.nfts.forEach((nft, index) => {
    const { lastMetadataSync, lastTokenUriSync, ...nftWithoutTimestamps } = nft;
    const { lastMetadataSync: expectedLastMetadataSync, lastTokenUriSync: expectedLastTokenUriSync, ...expectedNftWithoutTimestamps } = resultsMockResponse.nfts[index];
    expect(nftWithoutTimestamps).toMatchObject(expectedNftWithoutTimestamps); // Check other properties
    expect(lastMetadataSync).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    expect(lastTokenUriSync).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  });

  expect(jsonResponse.historys).toEqual(resultsMockResponse.historys);
});

  test('handles errors', async () => {
    nock('https://pocketwallet.azurewebsites.net/')
      .get(`/getTokens?userAddress=${mockUserAddress}&chain=${mockChain}`)
      .reply(500, { error: 'Internal Server Error' });
  
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        userAddress: '0x58389591c0786f875744119f79Db8a6ecbc12345',
        chain: '0xaa36a7',
      },
    });
  
    await getTokens(req, res);
  
    expect(res._getStatusCode()).toBe(500);
    const jsonResponse = res._getJSONData();
    expect(jsonResponse).toEqual({ error: 'An error occurred while fetching data' });
  });
});
