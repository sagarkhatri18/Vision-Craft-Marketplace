const mongoose = require("mongoose");

const productOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    orderedThrough: {
      type: String,
      enum: ["cart_items", "quick_checkout"],
      default: "quick_checkout",
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      require: true,
    },
    total: {
      type: Number,
      require: true,
    },
    shippingCharge: {
      type: Number,
      require: true,
    },
    hstCharge: {
      type: Number,
      require: true,
    },
    customerName: {
      type: String,
      require: true,
    },
    customerContact: {
      type: Number,
      require: true,
    },
    customerEmail: {
      type: String,
    },
    customerAddress: {
      type: String,
      require: true,
    },
    orderedUserDetails: {
      type: Array,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "product_orders",
  }
);

const productOrder = mongoose.model("productOrder", productOrderSchema);

module.exports = { productOrder };
