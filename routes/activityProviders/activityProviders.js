const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const adminAuthRequired = require('../../middlewares/adminAuthRequired.middleware');

const activityProvidersValidations = require('../../validations/activityProviders/activityProviders');
const activityProvidersControllers = require('../../controllers/activityProviders/activityProviders.controllers');

const router = express.Router();

router.get(
  '/',
  adminAuthRequired,
  validateRequest(activityProvidersValidations.getAllActivityProviders),
  activityProvidersControllers.getAllActivityProviders,
);
router.get(
  '/requests',
  adminAuthRequired,
  validateRequest(activityProvidersValidations.getAllUnapprovedActivityProviders),
  activityProvidersControllers.getAllUnapprovedActivityProviders,
);
router.post(
  '/status/:activityProviderId',
  // adminAuthRequired,
  validateRequest(activityProvidersValidations.updateStatusOfActivityProviders),
  activityProvidersControllers.updateStatusOfActivityProviders,
);

module.exports = router;
