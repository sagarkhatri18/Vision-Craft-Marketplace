const mongoose = require("mongoose");

const productOrderDetailSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    subTotal: {
      type: Number,
      require: true,
    },
    hstCharge: {
      type: Number,
      require: true,
    },
    total: {
      type: Number,
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productOrder",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "product_order_details",
  }
);

const productOrderDetail = mongoose.model(
  "productOrderDetail",
  productOrderDetailSchema
);

module.exports = { productOrderDetail };
