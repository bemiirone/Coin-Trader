// proxy-server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { environment } = require('../src/environments/environment'); 

const app = express();
const PORT = 5200;

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:4200' }));

// Proxy endpoint
app.get('/api/cryptocurrency/listings/latest', async (req, res) => {
  try {
    const response = await axios.get(environment.cmcApi, {
      headers: {
        'X-CMC_PRO_API_KEY': environment.cmcApiKey, 
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