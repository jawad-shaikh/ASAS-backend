const {
  okResponse,
  serverErrorResponse,
  updateSuccessResponse,
  badRequestResponse,
} = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllActivityProviders = async (req, res) => {
  try {
    const providers = await prisma.activityProvider.findMany({
      where: { approvalStatus: 'APPROVED' },
    });

    const response = okResponse(providers);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const getAllUnapprovedActivityProviders = async (req, res) => {
  try {
    const providers = await prisma.activityProvider.findMany({
      where: { approvalStatus: 'PENDING' },
    });

    const response = okResponse(providers);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateStatusOfActivityProviders = async (req, res) => {
  const activityProviderId = Number(req.params.activityProviderId);
  const { status } = req.body;

  try {
    const provider = await prisma.activityProvider.findUnique({
      where: { id: activityProviderId },
    });

    if (provider.approvalStatus !== 'PENDING') {
      const response = badRequestResponse('This Provider has already been approved');
      return res.status(response.status.code).json(response);
    }

    const updatedProvider = await prisma.activityProvider.update({
      data: { approvalStatus: status },
      where: { id: activityProviderId },
    });

    const response = updateSuccessResponse(updatedProvider);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllActivityProviders,
  getAllUnapprovedActivityProviders,
  updateStatusOfActivityProviders,
};
