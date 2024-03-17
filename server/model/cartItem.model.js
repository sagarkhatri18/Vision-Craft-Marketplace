const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "cart_items",
  }
);

const cartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = { cartItem };
