const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');
const adminAuthRequired = require('../../middlewares/adminAuthRequired.middleware');

const parentsValidations = require('../../validations/parents/parents');
const parentsControllers = require('../../controllers/parents/parents.controllers');

const router = express.Router();

router.get(
  '/',
  adminAuthRequired,
  validateRequest(parentsValidations.getAllParents),
  parentsControllers.getAllParents,
);

module.exports = router;
