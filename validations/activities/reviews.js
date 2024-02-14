const Joi = require('joi');

const getAllActivityReviews = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityId: Joi.number().required(),
  }),
  body: Joi.object({}),
});

const createActivityReview = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityId: Joi.number().required(),
  }),
  body: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    loved: Joi.string().required(),
    improvements: Joi.string().required(),
  }),
});

module.exports = {
  getAllActivityReviews,
  createActivityReview,
};
