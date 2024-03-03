const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
      default: null
    },
    filePath: {
      type: String,
      default: null
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
