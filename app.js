const express = require('express');
const cors = require('cors');
const axios = require('axios');
const reqResInspector = require('express-req-res-inspector');

const app = express();

app.use(express.static('uploads'));
app.use(express.json({ limit: '100mb' }));
app.use(cors());
// app.use(reqResInspector({ responseMessage: false }));

app.get('/', (req, res) => res.send('hi'));
app.use('/api/v1', require('./routes/index'));

app.get('/places', async (req, res) => {
  try {
    const { query } = req.query;
    const key = 'AIzaSyALid_clJdG76KwqFhqa5qvNqRb8dTt-h8';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}`,
    );

    // Check if there are any results
    if (response.data.results.length > 0) {
      const result = response.data.results[0]; // Assuming you're only interested in the first result

      // Send the relevant data back to the client
      res.json({
        name: result.name,
        formatted_address: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      });
    } else {
      res.status(404).json({ error: 'Place not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-formatted-address', async (req, res) => {
  const { address } = req.query;

  try {
    const key = 'key=AIzaSyALid_clJdG76KwqFhqa5qvNqRb8dTt-h8';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&${key}`,
    );

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
