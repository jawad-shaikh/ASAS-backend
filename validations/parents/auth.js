const Joi = require('joi');

const register = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const login = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  register,
  login,
};
