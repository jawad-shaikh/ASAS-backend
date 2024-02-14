const Joi = require('joi');

const getAllOrders = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

const createOrder = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    list: Joi.array().items(
      Joi.object({
        activityId: Joi.number().required(),
        childId: Joi.number().required(),
        bookingType: Joi.string().valid('FULL_COURSE', 'SINGLE_SESSION').required(),
        sessionDates: Joi.when('bookingType', {
          is: 'SINGLE_SESSION',
          then: Joi.array().items(Joi.string().isoDate()).min(1).required(),
          otherwise: Joi.forbidden(),
        }),
      }),
    ),
  }),
});

module.exports = {
  getAllOrders,
  createOrder,
};
