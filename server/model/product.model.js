const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    availableQuantity: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    priceAfterDiscount: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
