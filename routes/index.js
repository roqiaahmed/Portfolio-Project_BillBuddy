const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertiesController");

const {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");

const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const verifyToken = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddelware");

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
  .route("/properties")
  .get(verifyToken, getUserProperties)
  .post(verifyToken, createProperty);
router
  .route("/properties/:propertyId")
  .get(verifyToken, getProperty)
  .put(verifyToken, updateProperty)
  .delete(verifyToken, deleteProperty);

// services.js
router
  .route("/properties/:propertyId/services")
  .get(verifyToken, getAllServices)
  .post(verifyToken, uploadMiddleware, createService);
router
  .route("/properties/:propertyId/services/:serviceId")
  .get(verifyToken, getService)
  .put(verifyToken, uploadMiddleware, updateService)
  .delete(verifyToken, deleteService);

// task.js
router
  .route("/properties/:propertyId/services/:serviceId/tasks")
  .get(verifyToken, getAllTasks)
  .post(verifyToken, createTask);
router
  .route("/properties/:propertyId/services/:serviceId/tasks/:taskId")
  .get(verifyToken, getTask)
  .put(verifyToken, updateTask)
  .delete(verifyToken, deleteTask);
module.exports = router;
