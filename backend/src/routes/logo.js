const fs = require('fs');
const path = require('path');

const getLogo = (req, res) => {
  const { symbol } = req.query;
  const imagePath = path.join(__dirname, '..', 'cryptoicons', `${symbol.toLowerCase()}.png`);
  try {
    const image = fs.readFileSync(imagePath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } catch (err) {
    console.error(err);
    res.status(404).send('Image not found');
  }
};

module.exports = getLogo;
