const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');

const reviewValidations = require('../../validations/activities/reviews');
const reviewControllers = require('../../controllers/activities/reviews.controllers');

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  validateRequest(reviewValidations.getAllActivityReviews),
  reviewControllers.getAllActivityReviews,
);
router.post(
  '/',
  parentAuthRequired,
  validateRequest(reviewValidations.createActivityReview),
  reviewControllers.createActivityReview,
);

module.exports = router;
