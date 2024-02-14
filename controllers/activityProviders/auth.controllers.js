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
    const duplicateEmail = await prisma.activityProvider.findUnique({
      where: { email: data.email },
    });

    if (duplicateEmail) {
      const response = badRequestResponse('Duplicate Email!');
      return res.status(response.status.code).json(response);
    }

    await prisma.activityProvider.create({
      data,
    });

    const response = createSuccessResponse(null, 'Registered success, you will be informed soon!');
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
    const user = await prisma.activityProvider.findUnique({
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

    if (user.approvalStatus !== 'APPROVED') {
      const response = unauthorizedResponse('Account not approved yet, you will be informed');
      return res.status(response.status.code).json(response);
    }

    const jwtPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: 'ACTIVITY_PROVIDER',
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
