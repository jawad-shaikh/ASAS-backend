const express = require('express');

const router = express.Router();

// routes
router.use('/:activityId/reviews', require('./reviews'));
router.use('/', require('./activities'));

module.exports = router;
