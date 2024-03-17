const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/auth");
const verifyToken = require("../middleware/authMiddleware");

// auth.js
router.post("/register", register);
router.post("/login", login);

// user.js
router.route("/me").get(verifyToken, getUser);

module.exports = router;
