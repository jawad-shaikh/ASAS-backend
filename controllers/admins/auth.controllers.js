const jwt = require('jsonwebtoken');
const { okResponse, serverErrorResponse, unauthorizedResponse } = require('generic-response');

const prisma = require('../../config/database.config');
const logger = require('../../config/logger.config');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.admin.findUnique({
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
      role: 'ADMIN',
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
  login,
};
