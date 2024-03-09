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
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
