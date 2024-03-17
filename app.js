require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDb = require("./db/connect");
const router = require("./routes/index");

const app = express();

app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("hi");
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDb(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT} ...`);
  });
};
start();
