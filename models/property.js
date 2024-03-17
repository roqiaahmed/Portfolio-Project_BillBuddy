const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Minimum length is 3 characters"],
    },
    info: {
      type: String,
      required: false,
      minlength: [10, "Minimum length is 10 characters"],
      default: "No info available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
