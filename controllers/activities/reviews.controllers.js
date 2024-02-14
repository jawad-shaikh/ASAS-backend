const { okResponse, createSuccessResponse, serverErrorResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllActivityReviews = async (req, res) => {
  const activityId = Number(req.params.activityId);

  try {
    const activityReviews = await prisma.activityReview.findMany({
      where: { activityId },
    });

    const response = okResponse(activityReviews);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const createActivityReview = async (req, res) => {
  const activityId = Number(req.params.activityId);
  const data = req.body;
  const { userId } = req.user;

  try {
    const activityReview = await prisma.activityReview.create({
      data: {
        activityId,
        parentId: userId,
        ...data,
      },
    });

    const response = createSuccessResponse(activityReview);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllActivityReviews,
  createActivityReview,
};
