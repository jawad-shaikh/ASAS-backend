const jwt = require('jsonwebtoken');
const { badRequestResponse, unauthorizedResponse } = require('generic-response');

const prisma = require('../config/database.config');

const authRequired = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!req.headers.authorization) {
    const response = badRequestResponse('Authorization Token not provided.');
    return res.status(response.status.code).json(response);
  }

  if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const response = badRequestResponse('Invalid token format.');
    return res.status(response.status.code).json(response);
  }

  [, token] = token.split(' ');

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
    if (err) {
      const response = unauthorizedResponse('Invalid token.');
      return res.status(response.status.code).json(response);
    }

    const user1 = await prisma.admin.findUnique({ where: { id: decodedUser.userId } });
    const user2 = await prisma.parent.findUnique({ where: { id: decodedUser.userId } });
    const user3 = await prisma.activityProvider.findUnique({ where: { id: decodedUser.userId } });

    if (!user1 && !user2 && !user3) {
      const response = unauthorizedResponse('unauthorized.');
      return res.status(response.status.code).json(response);
    }

    req.user = decodedUser;
    next();
  });
};

module.exports = authRequired;
