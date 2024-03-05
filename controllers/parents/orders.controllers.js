const { serverErrorResponse, okResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyOrders = async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await prisma.order.findMany({
      include: {
        OrderDetail: {
          include: {
            activity: true,
            OrderAttendees: {
              include: {
                child: true,
              },
            },
            SingleSessionDate: true,
          },
        },
      },
      where: { parentId: userId },
    });

    const response = okResponse(orders);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getMyOrders,
};
