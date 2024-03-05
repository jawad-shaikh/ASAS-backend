const Joi = require('joi');

const getMyProfile = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

const updateMyProfile = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    businessName: Joi.string().optional(),
    website: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
  }),
});

module.exports = {
  getMyProfile,
  updateMyProfile,
};
