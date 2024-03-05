const express = require('express');
const multer = require('multer');

const { proofOfPaymentMiddleware } = require('../../config/multer.config');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const authRequired = require('../../middlewares/authRequired.middleware');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');
const adminAuthRequired = require('../../middlewares/adminAuthRequired.middleware');

const orderValidations = require('../../validations/orders/orders');
const orderControllers = require('../../controllers/orders/orders.controllers');

const router = express.Router();

const upload = multer({
  storage: proofOfPaymentMiddleware[0],
});

router.get(
  '/',
  authRequired,
  validateRequest(orderValidations.getAllOrders),
  orderControllers.getAllOrders,
);
router.post(
  '/',
  parentAuthRequired,
  upload.single('proof-of-payment'),
  orderControllers.createOrder,
);
router.post(
  '/:orderId/approve',
  adminAuthRequired,
  validateRequest(orderValidations.approveOrder),
  orderControllers.approveOrder,
);
router.post(
  '/:orderId/reject',
  adminAuthRequired,
  validateRequest(orderValidations.rejectOrder),
  orderControllers.rejectOrder,
);

module.exports = router;
