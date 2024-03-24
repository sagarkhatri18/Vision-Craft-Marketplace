const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    streetName: {
      type: String,
    },
    suiteNumber: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    role: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileCompletion: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
