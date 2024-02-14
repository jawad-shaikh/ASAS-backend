const Joi = require('joi');

const getAllUnapprovedActivityProviders = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

const getAllActivityProviders = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

const updateStatusOfActivityProviders = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityProviderId: Joi.number().required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('APPROVED', 'REJECTED').required(),
  }),
});

module.exports = {
  updateStatusOfActivityProviders,
  getAllUnapprovedActivityProviders,
  getAllActivityProviders,
};
