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
    is_active: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
