const Joi = require('joi');

const getAllActivities = Joi.object({
  query: Joi.object({
    activityProviderId: Joi.number().optional(),
  }),
  params: Joi.object({}),
  body: Joi.object({
    searchQuery: Joi.string().allow('').optional(),
    category: Joi.array()
      .items(Joi.string().valid('MUSIC', 'ART', 'COOKING', 'ROBOTS', 'LANGUAGE', 'SPORTS'))
      .optional(),
    age: Joi.array().items(Joi.number()).optional(),
    bookingType: Joi.array().items(Joi.string().valid('FULL_COURSE', 'SINGLE_SESSION')).optional(),
    months: Joi.array().items(Joi.number()).optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }),
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
    capacity: Joi.string().required(),
    ageRangeStart: Joi.number().required(),
    ageRangeEnd: Joi.number().required(),
    activityStartDate: Joi.date().required(),
    activityEndDate: Joi.date().required(),
    activityStartTime: Joi.date().required(),
    activityEndTime: Joi.date().required(),
    formattedAddress: Joi.string().required(),
    isFullCourse: Joi.boolean().required(),
    isSingleSession: Joi.boolean().required(),
    fullCoursePrice: Joi.string().required(),
    singleSessionPrice: Joi.string().required(),
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
    capacity: Joi.string().optional(),
    ageRangeStart: Joi.number().optional(),
    ageRangeEnd: Joi.number().optional(),
    activityStartDate: Joi.date().optional(),
    activityEndDate: Joi.date().optional(),
    activityStartTime: Joi.date().optional(),
    activityEndTime: Joi.date().optional(),
    formattedAddress: Joi.string().optional(),
    isFullCourse: Joi.boolean().optional(),
    isSingleSession: Joi.boolean().optional(),
    fullCoursePrice: Joi.string().optional(),
    singleSessionPrice: Joi.string().optional(),
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
