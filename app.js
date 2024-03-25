require('dotenv').config();
require('express-async-errors');

const { initialize } = require('./utils/notificationService');
const express = require('express');
const connectDb = require('./db/connect');

//router
const router = require('./routes/index');

//firebase
const admin = require('firebase-admin');

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

//error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

const serviceAccount = require(process.env.SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

app.use(express.json());
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('hi');
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDb(process.env.MONGO_URI);

  const server = app.listen(PORT, () => {
    console.log(`server is running on ${PORT} ...`);
  });
  initialize(server);
};
start();
