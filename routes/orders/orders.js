const express = require('express');
const multer = require('multer');

const { proofOfPaymentMiddleware } = require('../../config/multer.config');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');

const orderValidations = require('../../validations/orders/orders');
const orderControllers = require('../../controllers/orders/orders.controllers');

const router = express.Router();

const upload = multer({
  storage: proofOfPaymentMiddleware[0],
});

router.get(
  '/',
  parentAuthRequired,
  validateRequest(orderValidations.getAllOrders),
  orderControllers.getAllOrders,
);
router.post(
  '/',
  parentAuthRequired,
  // upload.single('proof-of-payment'),
  validateRequest(orderValidations.createOrder),
  orderControllers.createOrder,
);

module.exports = router;
