const { cartItem } = require("../model/cartItem.model");

// fetch the cart items of certain user
exports.index = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const cartItems = await cartItem
      .find({ userId })
      .populate({
        path: "productId",
        populate: { path: "categoryId" },
      })

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

  try {
    let existingCartItem = await cartItem.findOne({ userId, productId });

    if (existingCartItem) {
      // Update the quantity if the item already exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();

      const cartQuantityCounter = (
        await cartItem.find({ userId }).select("quantity")
      ).reduce((total, item) => total + parseInt(item.quantity), 0);

      return res.status(200).send({
        message: "Quantity has been successfully updated in the cart items",
        success: true,
        cartQuantity: cartQuantityCounter,
      });
    } else {
      // Create a new cart item if it doesn't exist
      await cartItem.create({
        quantity,
        userId,
        productId,
      });

      const cartQuantityCounter = (
        await cartItem.find({ userId }).select("quantity")
      ).reduce((total, item) => total + parseInt(item.quantity), 0);

      return res.status(200).send({
        message: "Item has been successfully added to the cart items",
        success: true,
        cartQuantity: cartQuantityCounter,
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: "Failed to add/update the product in the cart item",
      success: false,
    });
  }
};

// update cart item
exports.update = async (req, res) => {
  const _id = req.params.id;
  const { quantity } = req.body;

  try {
    const updatedCartItem = await cartItem.findOneAndUpdate(
      { _id },
      { quantity }
    );

    if (!updatedCartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cartQuantityCounter = (
      await cartItem.find({ userId: updatedCartItem.userId }).select("quantity")
    ).reduce((total, item) => total + parseInt(item.quantity), 0);

    return res.status(200).json({
      success: true,
      message: "Quantity has been successfully updated",
      cartQuantity: cartQuantityCounter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the cart quantity",
    });
  }
};

// delete product from id
exports.delete = async (req, res) => {
  const _id = req.params.id;

  try {
    const findItem = await cartItem.findOne({ _id });

    await cartItem.deleteOne({ _id });

    const cartQuantityCounter = (
      await cartItem.find({ userId: findItem.userId }).select("quantity")
    ).reduce((total, item) => total + parseInt(item.quantity), 0);

    return res.status(200).json({
      success: true,
      message: "Cart Item has been successfully deleted",
      cartQuantity: cartQuantityCounter,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected cart item",
    });
  }
};
