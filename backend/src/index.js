require('dotenv').config();
const express = require('express');
const Moralis = require('moralis').default;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const getLogo = require('./routes/logo');
const getTokens = require('./routes/getTokens');

app.use(cors());
app.use(express.json());

app.get('/logo', getLogo);

app.get('/getTokens', getTokens);

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