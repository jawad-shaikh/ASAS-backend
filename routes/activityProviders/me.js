const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');

const meValidations = require('../../validations/activityProviders/me');
const meControllers = require('../../controllers/activityProviders/me.controllers');
const activityProviderAuthRequired = require('../../middlewares/activityProviderAuthRequired.middleware');

const router = express.Router();

router.get(
  '/',
  activityProviderAuthRequired,
  validateRequest(meValidations.getMyProfile),
  meControllers.getMyProfile,
);
router.patch(
  '/',
  activityProviderAuthRequired,
  validateRequest(meValidations.updateMyProfile),
  meControllers.updateMyProfile,
);

module.exports = router;
