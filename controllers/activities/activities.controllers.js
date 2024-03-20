const {
  serverErrorResponse,
  createSuccessResponse,
  deleteSuccessResponse,
  okResponse,
  badRequestResponse,
  updateSuccessResponse,
} = require('generic-response');
const geolib = require('geolib');
const geoip = require('geoip-lite');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const parseCreateActivityData = (data) => {
  const parsedData = { ...data };

  parsedData.capacity = Number(data.capacity);
  parsedData.ageRangeStart = Number(data.ageRangeStart);
  parsedData.ageRangeEnd = Number(data.ageRangeEnd);
  parsedData.isFullCourse = data.isFullCourse === 'true';
  parsedData.isSingleSession = data.isSingleSession === 'true';
  parsedData.fullCoursePrice = data.fullCoursePrice !== null ? Number(data.fullCoursePrice) : null;
  parsedData.singleSessionPrice =
    data.fullCoursePrice !== null ? Number(data.singleSessionPrice) : null;
  parsedData.lat = Number(data.lat);
  parsedData.lng = Number(data.lng);

  return parsedData;
};

const getAllActivities = async (req, res) => {
  const activityProviderId = Number(req.query.activityProviderId);
  let { category, age, bookingType, startTime, endTime, searchQuery, months, latitude, longitude } =
    req.body;

  if (!latitude && !longitude) {
    const response = okResponse({ activities: [], coordinates: [] });
    return res.status(response.status.code).json(response);
  }

  if (latitude === 0 && longitude === 0) {
    const response = okResponse({ activities: [], coordinates: [] });
    return res.status(response.status.code).json(response);
  }

  try {
    const whereClause = {};

    if (activityProviderId) {
      whereClause.activityProviderId = activityProviderId;
    }

    if (searchQuery && searchQuery !== '') {
      whereClause.title = {
        contains: searchQuery,
      };
    }

    if (category && category.length > 0) {
      whereClause.category = { in: category };
    }

    if (age && age.length > 0) {
      const ageRanges = age.map((a) => parseInt(a));
      whereClause.ageRangeStart = {
        lte: Math.max(...ageRanges) === 18 ? 100 : Math.max(...ageRanges),
      };
      whereClause.ageRangeEnd = { gte: Math.min(...ageRanges) };
    }

    if (bookingType && bookingType.length > 0) {
      if (bookingType.includes('SINGLE_SESSION')) {
        whereClause.isSingleSession = true;
      }

      if (bookingType.includes('FULL_COURSE')) {
        whereClause.isFullCourse = true;
      }
    }

    if (months && months.length > 0) {
      const monthsRange = months.map((a) => parseInt(a));
      whereClause.OR = monthsRange.map((month) => ({
        AND: [
          { activityStartDate: { lte: new Date(2024, month + 1, 0) } },
          { activityEndDate: { gte: new Date(2024, month, 1) } },
        ],
      }));
    }

    // if (startTime && endTime) {
    //   console.log(startTime, endTime);
    //   let date1 = new Date();
    //   date1.setHours(Number(startTime));
    //   date1.setMinutes(0);
    //   date1.setSeconds(0);

    //   let date2 = new Date();
    //   date2.setHours(Number(endTime));
    //   date2.setMinutes(0);
    //   date2.setSeconds(0);

    //   whereClause.activityStartTime = { lte: date2 };
    //   whereClause.activityEndTime = { gte: date1 };
    // }

    let activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        provider: true,
      },
    });

    console.log('activities 1', activities);

    if (activities.length === 0) {
      const response = okResponse({ activities: [], coordinates: [] });
      return res.status(response.status.code).json(response);
    }

    console.log('working 1');

    activities = activities.filter((activity) => {
      const distance = geolib.getDistance(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        { latitude: activity.lat, longitude: activity.lng },
      );
      return distance <= 20000; // Distance in meters
    });

    console.log('working 2');

    const activitiesWithRatingInfo = await Promise.all(
      activities.map(async (activity) => {
        const avgRating = await prisma.activityReview.aggregate({
          where: { activityId: activity.id },
          _avg: { rating: true },
          _count: true,
        });

        return {
          ...activity,
          thumbnailPicture:
            activity.thumbnailPicture === null
              ? null
              : `${process.env.BACKEND_URL}/activity-thumbnails/${activity.thumbnailPicture}`,
          averageRating: avgRating._avg.rating || 0,
          numberOfRatings: avgRating._count,
        };
      }),
    );

    console.log('working 3');

    const coordinates = activities.map((i) => ({
      lat: i.lat,
      lng: i.lng,
      name: i.formattedAddress,
      title: i.title,
    }));

    console.log('working 4');

    const response = okResponse({ activities: activitiesWithRatingInfo, coordinates });
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

    activity.thumbnailPicture =
      activity.thumbnailPicture === null
        ? null
        : `${process.env.BACKEND_URL}/activity-thumbnails/${activity.thumbnailPicture}`;

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

  console.log(data);

  try {
    if (!thumbnailPicture) {
      const response = badRequestResponse('No file to attach');
      return res.status(response.status.code).json(response);
    }

    const parsedData = parseCreateActivityData(data);
    const fileName = thumbnailPicture.filename;
    console.log({
      activityProviderId: userId,
      ...parsedData,
      thumbnailPicture: fileName,
    });
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

const updateActivity = async (req, res) => {
  const activityId = Number(req.params.activityId);
  const data = req.body;
  const thumbnailPicture = req.file;

  try {
    const parsedData = parseCreateActivityData(data);

    if (thumbnailPicture) {
      const fileName = thumbnailPicture.filename;

      await prisma.activity.update({
        data: {
          thumbnailPicture: fileName,
        },
        where: { id: activityId },
      });
    }

    delete parsedData.thumbnail;

    const activity = await prisma.activity.update({
      data: {
        ...parsedData,
      },
      where: { id: activityId },
    });

    const response = updateSuccessResponse(activity);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

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
