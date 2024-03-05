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
    orders: Joi.array().items(
      Joi.object({
        activityId: Joi.number().required(),
        attendeeIds: Joi.array().items(Joi.number()).min(1).required(),
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

const approveOrder = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    orderId: Joi.number().required(),
  }),
  body: Joi.object({}),
});

const rejectOrder = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    orderId: Joi.number().required(),
  }),
  body: Joi.object({}),
});

module.exports = {
  getAllOrders,
  createOrder,
  approveOrder,
  rejectOrder,
};
