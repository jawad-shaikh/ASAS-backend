const {
  serverErrorResponse,
  createSuccessResponse,
  okResponse,
  updateSuccessResponse,
} = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllOrders = async (req, res) => {
  const { userId, role } = req.user;

  const whereClause = {};

  if (role === 'ADMIN') {
    whereClause.isApproved = 'PENDING';
  }

  if (role === 'ACTIVITY_PROVIDER') {
    whereClause.isApproved = 'APPROVE';
    whereClause.OrderDetail = {
      every: {
        activity: {
          activityProviderId: userId,
        },
      },
    };
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        parent: true,
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
      where: whereClause,
    });

    const ordersWithProofOfPayment = orders.map((i) => ({
      ...i,
      proofOfPayment:
        i.proofOfPayment === null
          ? null
          : `${process.env.BACKEND_URL}/proof-of-payment/${i.proofOfPayment}`,
    }));

    const response = okResponse(ordersWithProofOfPayment);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const createOrder = async (req, res) => {
  let { orders } = req.body;
  const { userId } = req.user;
  const proofOfPayment = req.file;

  try {
    const fileName = proofOfPayment.filename;

    const order = await prisma.order.create({
      data: { parentId: userId, proofOfPayment: fileName },
    });

    orders = JSON.parse(orders);

    console.log('orders', orders);

    for (const singleOrder of orders) {
      const { activityId, bookingType, attendeeIds, sessionDates } = singleOrder;

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (bookingType === 'FULL_COURSE') {
        const orderDetail = await prisma.orderDetail.create({
          data: {
            orderId: order.id,
            activityId,
            bookingType,
            totalPrice: activity.fullCoursePrice * attendeeIds.length,
          },
        });

        await prisma.orderAttendees.createMany({
          data: attendeeIds.map((i) => ({
            orderDetailId: orderDetail.id,
            childId: i,
          })),
        });
      } else if (bookingType === 'SINGLE_SESSION') {
        console.log(activity, '123');
        const orderDetail = await prisma.orderDetail.create({
          data: {
            orderId: order.id,
            activityId,
            bookingType,
            totalPrice: activity.singleSessionPrice * attendeeIds.length * sessionDates.length,
          },
        });

        await prisma.orderAttendees.createMany({
          data: attendeeIds.map((i) => ({
            orderDetailId: orderDetail.id,
            childId: i,
          })),
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

const approveOrder = async (req, res) => {
  const orderId = Number(req.params.orderId);
  try {
    await prisma.order.update({
      data: {
        isApproved: 'APPROVE',
      },
      where: { id: orderId },
    });

    const response = updateSuccessResponse();
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const rejectOrder = async (req, res) => {
  const orderId = Number(req.params.orderId);
  try {
    await prisma.order.update({
      data: {
        isApproved: 'REJECT',
      },
      where: { id: orderId },
    });

    const response = updateSuccessResponse();
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
  approveOrder,
  rejectOrder,
};
