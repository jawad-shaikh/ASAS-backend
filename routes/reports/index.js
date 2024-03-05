const express = require('express');

const router = express.Router();

// routes
router.use('/provider', require('./provider'));
router.use('/admin', require('./admin'));

module.exports = router;
