const { okResponse, createSuccessResponse, serverErrorResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllActivityReviews = async (req, res) => {
  const activityId = Number(req.params.activityId);

  try {
    const activityReviews = await prisma.activityReview.findMany({
      include: { parent: true },
      where: { activityId },
    });

    activityReviews.forEach((i) => {
      i.parent.profilePicture =
        i.parent.profilePicture === null
          ? null
          : `${process.env.BACKEND_URL}/user-profiles/${i.parent.profilePicture}`;
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
  const orderDetailId = Number(req.query.orderDetailId);
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

    await prisma.orderDetail.update({
      data: {
        hasGivenReview: true,
      },
      where: { id: orderDetailId },
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
