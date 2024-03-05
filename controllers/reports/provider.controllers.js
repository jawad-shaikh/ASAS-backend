const { okResponse, serverErrorResponse, notFoundResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyReport = async (req, res) => {
  const { userId } = req.user;

  console.log('userId', userId);
  try {
    const user = await prisma.activityProvider.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const response = notFoundResponse('User not found');
      return res.status(response.status.code).json(response);
    }

    const totalActivities = await prisma.activity.count({
      where: {
        activityProviderId: userId,
      },
    });

    const activitiesBooked = await prisma.orderDetail.findMany({
      where: {
        order: {
          isApproved: 'APPROVE',
        },
        activity: {
          activityProviderId: userId,
        },
      },
    });

    const totalEarnings = activitiesBooked.reduce(
      (accumulator, current) => accumulator + current.totalPrice,
      0,
    );
    const response = okResponse({
      totalActivities,
      activitiesBooked: activitiesBooked.length,
      totalEarnings,
    });
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getMyReport,
};
