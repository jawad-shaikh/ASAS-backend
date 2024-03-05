const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');

const ordersValidations = require('../../validations/parents/orders');
const ordersControllers = require('../../controllers/parents/orders.controllers');

const router = express.Router();

router.get(
  '/',
  parentAuthRequired,
  validateRequest(ordersValidations.getMyOrders),
  ordersControllers.getMyOrders,
);

module.exports = router;
