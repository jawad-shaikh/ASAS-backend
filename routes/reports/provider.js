const express = require('express');

const authRequired = require('../../middlewares/authRequired.middleware');

const reportController = require('../../controllers/reports/provider.controllers');

const router = express.Router();

router.get('/', authRequired, reportController.getMyReport);

module.exports = router;
