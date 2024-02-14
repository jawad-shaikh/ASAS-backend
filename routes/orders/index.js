const express = require('express');

const router = express.Router();

// routes
router.use('/', require('./orders'));

module.exports = router;
