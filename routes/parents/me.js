const express = require('express');
const multer = require('multer');

const { userProfileMiddleware } = require('../../config/multer.config');

const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');
const validateRequest = require('../../middlewares/validateRequest.middleware');

const meValidations = require('../../validations/parents/me');
const meControllers = require('../../controllers/parents/me.controllers');

const router = express.Router();

const upload = multer({
  storage: userProfileMiddleware[0],
});

router.get(
  '/',
  parentAuthRequired,
  validateRequest(meValidations.getMyProfile),
  meControllers.getMyProfile,
);
router.patch(
  '/',
  parentAuthRequired,
  validateRequest(meValidations.updateMyProfile),
  meControllers.updateMyProfile,
);
router.patch(
  '/update-profile-picture',
  parentAuthRequired,
  validateRequest(meValidations.updateProfilePicture),
  upload.single('profile'),
  meControllers.updateProfilePicture,
);

module.exports = router;
