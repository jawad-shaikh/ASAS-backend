const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');

const authValidations = require('../../validations/admins/auth');
const authControllers = require('../../controllers/admins/auth.controllers');

const router = express.Router();

router.post('/login', validateRequest(authValidations.login), authControllers.login);

module.exports = router;
