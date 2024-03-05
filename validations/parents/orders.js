const Joi = require('joi');

const getMyOrders = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

module.exports = {
  getMyOrders,
};
