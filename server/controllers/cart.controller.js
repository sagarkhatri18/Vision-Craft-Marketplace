const { cartItem } = require("../model/cartItem.model");

// fetch the cart items of certain user
exports.index = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const cartItems = await cartItem
      .find({ userId })
      .populate("productId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the cart items",
    });
  }
};

// add the item to the cart
exports.add = async (req, res, next) => {
  const { quantity, userId, productId } = req.body;

  await cartItem
    .create({
      quantity,
      userId,
      productId,
    })
    .then((data) => {
      return res.status(200).send({
        message: "Item has been successfully added to the cart items",
        success: true,
      });
    })
    .catch((error) => {
      return res.status(400).send({
        message: "Failed to add the product to the cart item",
        success: false,
      });
    });
};
