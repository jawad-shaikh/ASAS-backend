const express = require('express');

const validateRequest = require('../../middlewares/validateRequest.middleware');

const authValidations = require('../../validations/parents/auth');
const authControllers = require('../../controllers/parents/auth.controllers');

const router = express.Router();

router.post('/register', validateRequest(authValidations.register), authControllers.register);
router.post('/login', validateRequest(authValidations.login), authControllers.login);

module.exports = router;
