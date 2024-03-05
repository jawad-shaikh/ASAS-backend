const { serverErrorResponse, updateSuccessResponse, okResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await prisma.activityProvider.findUnique({
      where: { id: userId },
    });

    user.role = 'ACTIVITY_PROVIDER';

    const response = okResponse(user);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateMyProfile = async (req, res) => {
  const data = req.body;
  const { userId } = req.user;

  try {
    await prisma.activityProvider.update({
      data,
      where: { id: userId },
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
  getMyProfile,
  updateMyProfile,
};
