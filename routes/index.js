const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/auth");
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

module.exports = router;
