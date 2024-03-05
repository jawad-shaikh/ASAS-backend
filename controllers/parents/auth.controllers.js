const jwt = require('jsonwebtoken');
const {
  okResponse,
  badRequestResponse,
  serverErrorResponse,
  unauthorizedResponse,
  createSuccessResponse,
} = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const register = async (req, res) => {
  const data = req.body;

  try {
    const duplicateEmail = await prisma.parent.findUnique({
      where: { email: data.email },
    });

    if (duplicateEmail) {
      const response = badRequestResponse('Duplicate Email!');
      return res.status(response.status.code).json(response);
    }

    const user = await prisma.parent.create({
      data,
    });

    const jwtPayload = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      role: 'PARENT',
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

    const response = createSuccessResponse({ token, jwtPayload }, 'Registered successfully!');
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.parent.findUnique({
      where: { email },
    });

    if (!user) {
      const response = unauthorizedResponse('Incorrect email or password');
      return res.status(response.status.code).json(response);
    }

    if (user.password !== password) {
      const response = unauthorizedResponse('Incorrect email or password');
      return res.status(response.status.code).json(response);
    }

    const jwtPayload = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      role: 'PARENT',
      profilePicture:
        user.profilePicture === null
          ? null
          : `${process.env.BACKEND_URL}/user-profiles/${user.profilePicture}`,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

    const response = okResponse({ token, userData: jwtPayload }, 'Login Success!');
    return res.status(response.status.code).json(response);
  } catch (error) {
    logger.error(error.message);
    const response = serverErrorResponse(error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  register,
  login,
};
