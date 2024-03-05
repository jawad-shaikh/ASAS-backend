const { okResponse, serverErrorResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyReport = async (req, res) => {
  try {
    const totalUsers = await prisma.parent.count();
    const totalProviders = await prisma.activityProvider.count();
    const totalActivities = await prisma.activity.count();
    const activitiesBooked = await prisma.orderDetail.findMany({
      where: {
        order: {
          isApproved: 'APPROVE',
        },
      },
    });
    const totalEarnings = activitiesBooked.reduce(
      (accumulator, current) => accumulator + current.totalPrice,
      0,
    );
    const response = okResponse({
      totalUsers,
      totalProviders,
      totalActivities,
      totalEarnings: totalEarnings * 0.2,
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
