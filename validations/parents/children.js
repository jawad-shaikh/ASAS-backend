const Joi = require('joi');

const getMyChildren = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({}),
});

const addChild = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    fullName: Joi.string().required(),
    birthDay: Joi.date().required(),
  }),
});

// const updateChild = Joi.object({
//   query: Joi.object({}),
//   params: Joi.object({}),
//   body: Joi.object({}),
// });

// const deleteChild = Joi.object({
//   query: Joi.object({}),
//   params: Joi.object({}),
//   body: Joi.object({}),
// });

module.exports = {
  getMyChildren,
  addChild,
  //   updateChild,
  //   deleteChild,
};
