const { serverErrorResponse, okResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getAllParents = async (req, res) => {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        Child: true,
      },
    });

    parents.forEach((p) => {
      p.profilePicture =
        p.profilePicture === null
          ? null
          : `${process.env.BACKEND_URL}/user-profiles/${p.profilePicture}`;
    });

    const response = okResponse(parents);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllParents,
};
