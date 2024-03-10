const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "product_images",
  }
);

const ProductImage = mongoose.model("ProductImage", productImageSchema);

module.exports = { ProductImage };
