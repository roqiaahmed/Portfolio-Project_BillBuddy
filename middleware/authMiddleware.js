const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors/index");
const verifyproperty = require("../utils/verifyproperty");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    throw new UnauthenticatedError("No token provided");
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

const authorized = async (req, res, next) => {
  const { propertyId } = req.params;
  const { userId } = req;
  const property = await verifyproperty(userId, propertyId);
  if (!property) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
  next();
};

module.exports = { verifyToken, authorized };
