const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ msg: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "unauthorized", error });
  }
};

module.exports = verifyToken;
