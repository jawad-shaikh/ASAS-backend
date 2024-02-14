const Joi = require('joi');

const getAllActivities = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    category: Joi.string()
      .valid('MUSIC', 'ART', 'COOKING', 'ROBOTS', 'LANGUAGE', 'SPORTS')
      .optional(),
  }),
  body: Joi.object({}),
});

const getSingleActivity = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityId: Joi.number().required(),
  }),
  body: Joi.object({}),
});

const createActivity = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required('MUSIC', 'ART', 'COOKING', 'ROBOTS', 'LANGUAGE', 'SPORTS'),
    capacity: Joi.number().required(),
    ageRangeStart: Joi.number().required(),
    ageRangeEnd: Joi.number().required(),
    activityStartDate: Joi.date().required(),
    activityEndDate: Joi.date().required(),
    activityStartTime: Joi.date().required(),
    activityEndTime: Joi.date().required(),
    formattedAddress: Joi.string().required(),
    locationLatitude: Joi.number().required(),
    locationLongitude: Joi.number().required(),
    isFullCourse: Joi.boolean().required(),
    isSingleSession: Joi.boolean().required(),
    fullCoursePrice: Joi.number().required(),
    singleSessionPrice: Joi.number().required(),
  }),
});

const updateActivity = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityId: Joi.number().required(),
  }),
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional('MUSIC', 'ART', 'COOKING', 'ROBOTS', 'LANGUAGE', 'SPORTS'),
    capacity: Joi.number().optional(),
    ageRangeStart: Joi.number().optional(),
    ageRangeEnd: Joi.number().optional(),
    activityStartDate: Joi.date().optional(),
    activityEndDate: Joi.date().optional(),
    activityStartTime: Joi.string()
      .regex(/^([0-9]{2})\:([0-9]{2})$/)
      .optional(),
    activityEndTime: Joi.string()
      .regex(/^([0-9]{2})\:([0-9]{2})$/)
      .optional(),
    location: Joi.object({
      formattedAddress: Joi.string().optional(),
      locationLatitude: Joi.string().optional(),
      locationLongitude: Joi.string().optional(),
    }).optional(),
    price: Joi.object({
      isFullCourse: Joi.boolean().optional(),
      isSingleSession: Joi.boolean().optional(),
      fullCoursePrice: Joi.string().optional(),
      singleSessionPrice: Joi.string().optional(),
    }).optional(),
  }),
});

const deleteActivity = Joi.object({
  query: Joi.object({}),
  params: Joi.object({
    activityId: Joi.number().required(),
  }),
  body: Joi.object({}),
});

module.exports = {
  getAllActivities,
  getSingleActivity,
  createActivity,
  updateActivity,
  deleteActivity,
};
