const {
  serverErrorResponse,
  okResponse,
  updateSuccessResponse,
  badRequestResponse,
} = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const profile = await prisma.parent.findFirst({
      where: { id: userId },
      include: {
        Child: true,
      },
    });

    profile.profilePicture =
      profile.profilePicture === null
        ? null
        : `${process.env.BACKEND_URL}/user-profiles/${profile.profilePicture}`;

    const response = okResponse(profile);
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
    const updatedUser = await prisma.parent.update({
      data,
      where: { id: userId },
    });

    const response = updateSuccessResponse(updatedUser);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateProfilePicture = async (req, res) => {
  const { userId } = req.user;
  const profilePicture = req.file;

  try {
    if (!profilePicture) {
      const response = badRequestResponse('No file to update');
      return res.status(response.status.code).json(response);
    }

    const fileName = profilePicture.filename;

    await prisma.parent.update({
      where: { id: userId },
      data: { profilePicture: fileName },
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
  updateProfilePicture,
  updateMyProfile,
};
