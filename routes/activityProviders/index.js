const express = require('express');

const router = express.Router();

// routes
router.use('/auth', require('./auth'));
router.use('/me', require('./me'));
router.use('/', require('./activityProviders'));

module.exports = router;
