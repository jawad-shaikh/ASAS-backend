const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');

const childrenValidations = require('../../validations/parents/children');
const childrenControllers = require('../../controllers/parents/children.controllers');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');

const router = express.Router();

router.get(
  '/',
  parentAuthRequired,
  validateRequest(childrenValidations.getMyChildren),
  childrenControllers.getMyChildren,
);
router.post(
  '/',
  parentAuthRequired,
  validateRequest(childrenValidations.addChild),
  childrenControllers.addChild,
);
// router.patch(
//   '/:childId',
//   validateRequest(childrenValidations.updateChild),
//   childrenControllers.updateChild,
// );
// router.delete(
//   '/:childId',
//   validateRequest(childrenValidations.deleteChild),
//   childrenControllers.deleteChild,
// );

module.exports = router;
