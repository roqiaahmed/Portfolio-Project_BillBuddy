const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: [true, "Services is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [20, "Maximum length is 20 characters"],
    },
    reminde: {
      type: Boolean,
      default: true,
    },
    reminderDay: {
      type: Number,
      default: 1,
    },
    jobId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
