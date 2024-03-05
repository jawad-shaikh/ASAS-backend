const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const parentAuthRequired = require('../../middlewares/parentAuthRequired.middleware');

const parentsValidations = require('../../validations/parents/parents');
const parentsControllers = require('../../controllers/parents/parents.controllers');

const router = express.Router();

router.get(
  '/',
  parentAuthRequired,
  validateRequest(parentsValidations.getAllParents),
  parentsControllers.getAllParents,
);

module.exports = router;
