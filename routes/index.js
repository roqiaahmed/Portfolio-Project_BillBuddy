const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/auth");
const {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/properties");
const verifyToken = require("../middleware/authMiddleware");

// auth.js
router.post("/register", register);
router.post("/login", login);

// user.js
router
  .route("/me")
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

// property.js
router
  .route("/me/properties")
  .get(verifyToken, getUserProperties)
  .post(verifyToken, createProperty);

router
  .route("/me/properties/:propertyId")
  .get(verifyToken, getProperty)
  .put(verifyToken, updateProperty)
  .delete(verifyToken, deleteProperty);

module.exports = router;
