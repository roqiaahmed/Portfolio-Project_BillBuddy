const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Minimum length is 3 characters"],
    },
    details: {
      type: String,
      required: false,
      minlength: [10, "Minimum length is 10 characters"],
      default: "No info available",
    },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
