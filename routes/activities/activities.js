const express = require('express');
const multer = require('multer');

const { activityThumbnailMiddleware } = require('../../config/multer.config');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const activityProviderAuthRequired = require('../../middlewares/activityProviderAuthRequired.middleware');

const activitiesValidations = require('../../validations/activities/activities');
const activitiesControllers = require('../../controllers/activities/activities.controllers');

const router = express.Router();

const upload = multer({
  storage: activityThumbnailMiddleware[0],
});

router.post(
  '/fetch',
  validateRequest(activitiesValidations.getAllActivities),
  activitiesControllers.getAllActivities,
);
router.post(
  '/fetch-by-provider',
  validateRequest(activitiesValidations.getAllActivities),
  activitiesControllers.getAllActivitiesByProvider,
);
router.get(
  '/:activityId',
  validateRequest(activitiesValidations.getSingleActivity),
  activitiesControllers.getSingleActivity,
);
router.post(
  '/',
  activityProviderAuthRequired,
  upload.single('thumbnail'),
  // validateRequest(activitiesValidations.createActivity),
  activitiesControllers.createActivity,
);
router.patch(
  '/:activityId',
  activityProviderAuthRequired,
  upload.single('thumbnail'),
  // validateRequest(activitiesValidations.updateActivity),
  activitiesControllers.updateActivity,
);
router.delete(
  '/:activityId',
  activityProviderAuthRequired,
  validateRequest(activitiesValidations.deleteActivity),
  activitiesControllers.deleteActivity,
);

module.exports = router;
