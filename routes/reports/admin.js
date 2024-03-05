const express = require('express');

const authRequired = require('../../middlewares/authRequired.middleware');

const reportController = require('../../controllers/reports/admin.controllers');

const router = express.Router();

router.get('/', authRequired, reportController.getMyReport);

module.exports = router;
