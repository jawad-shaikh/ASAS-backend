const { serverErrorResponse, createSuccessResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllOrders = async (req, res) => {};

const createOrder = async (req, res) => {
  const data = req.body;
  const { userId } = req.user;

  try {
    const order = await prisma.order.create({
      data: { parentId: userId },
    });

    for (const i of data) {
      const { activityId, childId, bookingType, sessionDates } = i;

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (bookingType === 'FULL_COURSE') {
        const orderDetail = await prisma.orderDetail.create({
          data: {
            orderId: order.id,
            activityId,
            childId,
            bookingType,
            totalPrice: activity.fullCoursePrice,
          },
        });
      } else if (bookingType === 'SINGLE_SESSION') {
        const orderDetail = await prisma.orderDetail.create({
          data: {
            orderId: order.id,
            activityId,
            childId,
            bookingType,
            totalPrice: activity.singleSessionPrice,
          },
        });

        await prisma.singleSessionDate.createMany({
          data: sessionDates.map((sessionDate) => ({
            orderDetailId: orderDetail.id,
            sessionDate,
          })),
        });
      }
    }

    const response = createSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllOrders,
  createOrder,
};
