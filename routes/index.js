const express = require('express');
const router = express.Router();

// Import the controllers

// authController.js
const {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/authController');

// userController.js
const {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertiesController');

// servicesController.js
const {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService,
} = require('../controllers/servicesController');

// taskController.js
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// actionController.js
const {
  getAllActions,
  createAction,
  getAction,
  updateAction,
  deleteAction,
} = require('../controllers/actionController');

const { verifyToken, authorized } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddelware');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to register a new user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *              - name
 *              - email
 *              - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: john doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful response with the newly created user.
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful response with user authentication token.
 */
router.post('/login', login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user details
 *     description: Retrieve the details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user details.
 *
 *   put:
 *     summary: Update user details
 *     description: Update the details of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful response indicating the user details were updated.
 *
 *   delete:
 *     summary: Delete user account
 *     description: Delete the account of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response indicating the user account was deleted.
 */
router
  .route('/me')
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get user properties
 *     description: Retrieve the properties of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the user's properties.
 *
 *   post:
 *     summary: Create a new property
 *     description: Create a new property for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *              - name
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Property
 *               info:
 *                 type: string
 *                 example: info info info info info info
 *
 *     responses:
 *       200:
 *         description: Successful response with the newly created property.
 */
router
  .route('/properties')
  .get(verifyToken, getUserProperties)
  .post(verifyToken, createProperty);

/**
 * @swagger
 * /properties/{propertyId}:
 *   get:
 *     summary: Get a property
 *     description: Retrieve a property by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: propertyId
 *         in: path
 *         description: ID of the property to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     responses:
 *       200:
 *         description: Successful response with the property.
 *   put:
 *     summary: Update a property
 *     description: Update a property by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: propertyId
 *         in: path
 *         description: ID of the property to update
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Property Name
 *               info:
 *                 type: string
 *                 example: Updated property info
 *     responses:
 *       200:
 *         description: Successful response with the updated property.
 *   delete:
 *     summary: Delete a property
 *     description: Delete a property by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: propertyId
 *         in: path
 *         description: ID of the property to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     responses:
 *       200:
 *         description: Successful response indicating the property was deleted.
 */
router
  .route('/properties/:propertyId')
  .get(verifyToken, authorized, getProperty)
  .put(verifyToken, authorized, updateProperty)
  .delete(verifyToken, authorized, deleteProperty);

/**
 * @swagger
 * /properties/{propertyId}/services:
 *   get:
 *     summary: Get all services
 *     description: Retrieve all services for a specific property.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the property
 *     responses:
 *       200:
 *         description: Successful response with the list of services.
 *   post:
 *     summary: Create a new service
 *     description: Create a new service for a specific property.
 *     consumes:
 *      - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the property
 *       - in: formData
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: name of the service
 *       - in: formData
 *         name: details
 *         schema:
 *           type: string
 *         required: false
 *         description: the remarks
 *       - in: formData
 *         name: images[]
 *         schema:
 *           type: array
 *           items:
 *             type: file
 *         required: true
 *         description: The files
 *     responses:
 *       200:
 *         description: Successful response with the newly created service.
 */
router
  .route('/properties/:propertyId/services')
  .get(verifyToken, authorized, getAllServices)
  .post(verifyToken, authorized, uploadMiddleware, createService);
/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     summary: Get a service
 *     description: Retrieve a service for a specific property.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *         required: true
 *         description: ID of the property
 *     responses:
 *       200:
 *         description: Successful response with the list of services.
 *   put:
 *     summary: Update a service
 *     description: Update a services by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serviceId
 *         in: path
 *         description: ID of the service to update
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *       - in: formData
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: name of the service
 *       - in: formData
 *         name: details
 *         schema:
 *           type: string
 *         required: false
 *         description: the remarks
 *       - in: formData
 *         name: images[]
 *         schema:
 *           type: array
 *           items:
 *             type: file
 *         required: true
 *         description: The files
 *     responses:
 *       200:
 *         description: Successful response with the updated property.
 *   delete:
 *     summary: Delete a service
 *     description: Delete a service by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: serviceId
 *         in: path
 *         description: ID of the service to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     responses:
 *       200:
 *         description: Successful response indicating the property was deleted.
 */
router
  .route('/services/:serviceId')
  .get(verifyToken, authorized, getService)
  .put(verifyToken, authorized, uploadMiddleware, updateService)
  .delete(verifyToken, authorized, deleteService);

/**
 * @swagger
 * /services/{serviceId}/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieve all tasks for a specific service.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the service
 *     responses:
 *       200:
 *         description: Successful response with the list of tasks.
 *   post:
 *     summary: Create a new task
 *     description: Create a new task for a specific service.
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Task Name
 *               info:
 *                 type: string
 *                 example: Task info
 *     responses:
 *       200:
 *         description: Successful response with the newly created task.
 */
router
  .route('/services/:serviceId/tasks')
  .get(verifyToken, authorized, getAllTasks)
  .post(verifyToken, authorized, createTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task
 *     description: Retrieve a task by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     responses:
 *       200:
 *         description: Successful response with the property.
 *   put:
 *     summary: Update a task
 *     description: Update a task by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to update
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated task Name
 *               reminde:
 *                 type: boolean
 *                 example: true
 *               reminderDay:
 *                 type: number
 *                 example: 1
 *               jobId:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Successful response with the updated property.
 *   delete:
 *     summary: Delete a task
 *     description: Delete a task by its ID for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 60ba77c9b8e9a43d48deed85
 *     responses:
 *       200:
 *         description: Successful response indicating the property was deleted.
 */
router
  .route('/tasks/:taskId')
  .get(verifyToken, authorized, getTask)
  .put(verifyToken, authorized, updateTask)
  .delete(verifyToken, authorized, deleteTask);

/**
 * @swagger
 * /tasks/{taskId}/actions:
 *   get:
 *     summary: Get all actions
 *     description: Retrieve all actions for a specific task.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Successful response with the list of actions.
 *   post:
 *     summary: Create a new actions
 *     description: Create a new action for a specific task.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *       - in: formData
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['done', 'inprogress', 'pending']
 *           default: 'pending'
 *         description: Status of the action
 *       - in: formData
 *         name: images[]
 *         schema:
 *           type: array
 *           items:
 *             type: file
 *         required: true
 *         description: The files
 *     responses:
 *       200:
 *         description: Successful response with the newly created action.
 */
router
  .route('/tasks/:taskId/actions')
  .get(verifyToken, authorized, getAllActions)
  .post(verifyToken, authorized, uploadMiddleware, createAction);

/**
 * @swagger
 * /actions/{actionId}:
 *   get:
 *     summary: Get an action
 *     description: Retrieve an action by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the action to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the action details.
 *   put:
 *     summary: Update an action
 *     description: Update an action by its ID.
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the action to update
 *       - in: formData
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['done', 'inprogress', 'pending']
 *           default: 'pending'
 *         description: Status of the action
 *       - in: formData
 *         name: images[]
 *         schema:
 *           type: array
 *           items:
 *             type: file
 *         required: false
 *         description: The files to update for the action
 *     responses:
 *       200:
 *         description: Successful response with the updated action details.
 *   delete:
 *     summary: Delete an action
 *     description: Delete an action by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the action to delete
 *     responses:
 *       200:
 *         description: Successful response indicating the action was deleted.
 */

router
  .route('/actions/:actionId')
  .get(verifyToken, authorized, getAction)
  .put(verifyToken, authorized, uploadMiddleware, updateAction)
  .delete(verifyToken, authorized, deleteAction);

module.exports = router;
