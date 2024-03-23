const express = require("express");
const router = express.Router();

// Import the controllers

// authController.js
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

// userController.js
const {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertiesController");

// servicesController.js
const {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");

// taskController.js
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// actionController.js
const {
  getAllActions,
  createAction,
  getAction,
  updateAction,
  deleteAction,
} = require("../controllers/actionController");

const { verifyToken, authorized } = require("../middleware/authMiddleware");
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
  .get(verifyToken, authorized, getProperty)
  .put(verifyToken, authorized, updateProperty)
  .delete(verifyToken, authorized, deleteProperty);

// services.js
router
  .route("/properties/:propertyId/services")
  .get(verifyToken, authorized, getAllServices)
  .post(verifyToken, authorized, uploadMiddleware, createService);
router
  .route("/properties/:propertyId/services/:serviceId")
  .get(verifyToken, authorized, getService)
  .put(verifyToken, authorized, uploadMiddleware, updateService)
  .delete(verifyToken, authorized, deleteService);

// task.js
router
  .route("/properties/:propertyId/services/:serviceId/tasks")
  .get(verifyToken, authorized, getAllTasks)
  .post(verifyToken, authorized, createTask);
router
  .route("/properties/:propertyId/services/:serviceId/tasks/:taskId")
  .get(verifyToken, authorized, getTask)
  .put(verifyToken, authorized, updateTask)
  .delete(verifyToken, authorized, deleteTask);

// action.js
router
  .route("/properties/:propertyId/services/:serviceId/tasks/:taskId/actions")
  .get(verifyToken, authorized, getAllActions)
  .post(verifyToken, authorized, uploadMiddleware, createAction);

router
  .route(
    "/properties/:propertyId/services/:serviceId/tasks/:taskId/actions/:actionId"
  )
  .get(verifyToken, authorized, getAction)
  .put(verifyToken, authorized, uploadMiddleware, updateAction)
  .delete(verifyToken, authorized, deleteAction);

module.exports = router;
