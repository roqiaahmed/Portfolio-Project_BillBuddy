const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Types.ObjectId, ref: "Task" },
  status: {
    type: String,
    enum: ["done", "inprogers", "pending"],
    default: "pending",
  },

  images: [String],
});

module.exports = mongoose.model("Action", actionSchema);
