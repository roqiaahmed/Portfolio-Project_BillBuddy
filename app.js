require("dotenv").config();

const express = require("express");
const connectDb = require("./db/connect");

const app = express();

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
