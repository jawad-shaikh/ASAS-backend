const { serverErrorResponse, okResponse, createSuccessResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const getMyChildren = async (req, res) => {
  const { userId } = req.user;

  try {
    const myChildren = await prisma.child.findMany({
      where: { parentId: userId },
    });

    const response = okResponse(myChildren);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const addChild = async (req, res) => {
  const { userId } = req.user;
  const data = req.body;

  try {
    const children = await prisma.child.create({
      data: {
        ...data,
        parentId: userId,
      },
    });

    const response = createSuccessResponse(children);
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

// const updateChild = async (req, res) => {
//   const { userId } = req.user;

//   try {
//     const profile = await prisma.parent.findFirst({
//       where: { id: userId },
//     });

//     const response = okResponse(profile);
//     return res.status(response.status.code).json(response);
//   } catch (error) {
//     logger.error(error.message);
//     const response = serverErrorResponse(error.message);
//     return res.status(response.status.code).json(response);
//   }
// };

// const deleteChild = async (req, res) => {
//   const { userId } = req.user;

//   try {
//     const profile = await prisma.parent.findFirst({
//       where: { id: userId },
//     });

//     const response = okResponse(profile);
//     return res.status(response.status.code).json(response);
//   } catch (error) {
//     logger.error(error.message);
//     const response = serverErrorResponse(error.message);
//     return res.status(response.status.code).json(response);
//   }
// };

module.exports = {
  getMyChildren,
  addChild,
  // updateChild,
  // deleteChild,
};
