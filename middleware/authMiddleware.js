const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors/index');
const {
  verifyProperty,
  verifyService,
  verifyTask,
} = require('../utils/verifyproperty');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    throw new UnauthenticatedError('No token provided');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

const authorized = async (req, res, next) => {
  const { propertyId, serviceId, taskId } = req.params;
  const { userId } = req;

  if (propertyId) {
    const property = await verifyProperty(userId, propertyId);
    if (!property) {
      throw new UnauthenticatedError('Not authorized to access this route');
    }
    next();
  }

  if (serviceId) {
    const service = await verifyService(userId, serviceId);
    if (!service) {
      throw new UnauthenticatedError('Not authorized to access this route');
    }
    return next();
  }

  if (taskId) {
    const task = await verifyTask(userId, taskId);
    if (!task) {
      throw new UnauthenticatedError('Not authorized to access this route');
    }
    return next();
  }
};

module.exports = { verifyToken, authorized };
