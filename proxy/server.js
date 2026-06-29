const express = require('express');
const app = express();

const WAPI_KEY = process.env.WAPI_KEY;
const PORT = process.env.PORT || 3000;

if (!WAPI_KEY) {
  console.error('WAPI_KEY environment variable is not set');
  process.exit(1);
}

// Forward all /v1/* requests to WeatherAPI, injecting the key server-side
app.get('/v1/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const params = new URLSearchParams({ ...req.query, key: WAPI_KEY });
    const url = `https://api.weatherapi.com/v1/${endpoint}?${params}`;

    const upstream = await fetch(url);
    const data = await upstream.json();

    res.status(upstream.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Upstream request failed' });
  }
});

app.listen(PORT, () => console.log(`WeatherAPI proxy listening on port ${PORT}`));
