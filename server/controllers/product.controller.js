const { Product } = require("../model/product.model");

// add new category
exports.add = async (req, res, next) => {
  const reqParam = req.body;
  await Product.create({
    title: reqParam.title,
    slug: reqParam.slug,
    isActive: reqParam.isActive,
    categoryId: reqParam.categoryId,
    userId: reqParam.userId,
    discountPercentage: reqParam.discountPercentage,
    price: reqParam.price,
    availableQuantity: reqParam.availableQuantity,
    discountAmount: reqParam.discountAmount,
    priceAfterDiscount: reqParam.priceAfterDiscount,
    addedBy: reqParam.addedBy,
  })
    .then((data) => {
      return res.status(200).send({
        message: "Product has been successfully added",
        success: true,
      });
    })
    .catch((error) => {
      console.log(error)
      return res
        .status(400)
        .send({ message: "Failed to add the product", success: false });
    });
};
