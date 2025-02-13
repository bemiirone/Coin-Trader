// proxy-server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
// import cncApi from environment

const app = express();
const PORT = 5200;

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:4200' }));

// Proxy endpoint
app.get('/api/cryptocurrency/listings/latest', async (req, res) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': '5155ae49-602e-4b9b-af1c-efbc9f10f5f5', // Replace with your CoinMarketCap API key
      },
      params: {
        start: req.query.start,
        limit: req.query.limit,
        convert: req.query.convert,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from CoinMarketCap API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});