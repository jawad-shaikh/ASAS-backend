const {
  serverErrorResponse,
  createSuccessResponse,
  deleteSuccessResponse,
  okResponse,
  badRequestResponse,
} = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const parseCreateActivityData = (data) => {
  const parsedData = { ...data };

  parsedData.capacity = Number(data.capacity);
  parsedData.ageRangeStart = Number(data.ageRangeStart);
  parsedData.ageRangeEnd = Number(data.ageRangeEnd);
  parsedData.locationLatitude = Number(data.locationLatitude);
  parsedData.locationLongitude = Number(data.locationLongitude);
  parsedData.isFullCourse = data.isFullCourse === 'true';
  parsedData.isSingleSession = data.isSingleSession === 'true';
  parsedData.fullCoursePrice = Number(data.fullCoursePrice);
  parsedData.singleSessionPrice = Number(data.singleSessionPrice);

  return parsedData;
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany();

    const activitiesWithRatingInfo = await Promise.all(
      activities.map(async (activity) => {
        const avgRating = await prisma.activityReview.aggregate({
          where: { activityId: activity.id },
          _avg: { rating: true },
          _count: true,
        });

        return {
          ...activity,
          // eslint-disable-next-line no-underscore-dangle
          averageRating: avgRating._avg.rating || 0,
          // eslint-disable-next-line no-underscore-dangle
          numberOfRatings: avgRating._count,
        };
      }),
    );

    const response = createSuccessResponse(activitiesWithRatingInfo);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const getSingleActivity = async (req, res) => {
  const activityId = Number(req.params.activityId);

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        ActivityReview: {
          include: {
            parent: true,
          },
        },
      },
    });

    const { _avg } = await prisma.activityReview.aggregate({
      where: { activityId },
      _avg: { rating: true },
    });

    const response = okResponse({ ...activity, averageRating: _avg.rating || 0 });
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const createActivity = async (req, res) => {
  const data = req.body;
  const { userId } = req.user;
  const thumbnailPicture = req.file;

  try {
    if (!thumbnailPicture) {
      const response = badRequestResponse('No file to attach');
      return res.status(response.status.code).json(response);
    }

    const parsedData = parseCreateActivityData(data);
    const fileName = thumbnailPicture.filename;

    const activity = await prisma.activity.create({
      data: {
        activityProviderId: userId,
        ...parsedData,
        thumbnailPicture: fileName,
      },
    });

    const response = createSuccessResponse(activity);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateActivity = async () => {};

const deleteActivity = async (req, res) => {
  const activityId = Number(req.params.activityId);

  try {
    const activity = await prisma.activity.delete({
      where: { id: activityId },
    });

    const response = deleteSuccessResponse(activity);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllActivities,
  getSingleActivity,
  createActivity,
  updateActivity,
  deleteActivity,
};
