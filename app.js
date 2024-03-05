const express = require('express');
const cors = require('cors');
const reqResInspector = require('express-req-res-inspector');

const app = express();

app.use(express.static('uploads'));
app.use(express.json({ limit: '100mb' }));
app.use(cors());
// app.use(reqResInspector({ responseMessage: false }));

app.get('/', (req, res) => res.send('hi'));
app.use('/api/v1', require('./routes/index'));

module.exports = app;
