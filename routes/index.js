const express = require('express');

const router = express.Router();

// routes
router.use('/admins', require('./admins'));
router.use('/parents', require('./parents'));
router.use('/activity-providers', require('./activityProviders'));
router.use('/activities', require('./activities'));
router.use('/orders', require('./orders'));

module.exports = router;
