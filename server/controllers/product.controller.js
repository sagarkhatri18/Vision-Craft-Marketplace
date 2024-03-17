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
    description: reqParam.description,
  })
    .then((data) => {
      return res.status(200).send({
        message: "Product has been successfully added",
        success: true,
      });
    })
    .catch((error) => {
      return res
        .status(400)
        .send({ message: "Failed to add the product", success: false });
    });
};

// update product
exports.update = async (req, res) => {
  const _id = req.params.id;
  const reqParam = req.body;

  const updateData = {
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
    description: reqParam.description,
  };

  try {
    await Product.findOneAndUpdate({ _id: _id }, updateData)
      .exec()
      .then((product) => {
        return res.status(200).json({
          success: true,
          message: "Product has been successfully updated",
          data: product,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Failed to update the selected product",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// fetch all the products lists
exports.index = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate("categoryId")
      .populate("userId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the products",
    });
  }
};

// fetch all the active products
exports.findActiveProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
    })
      .populate("categoryId")
      .populate("userId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the products",
    });
  }
};

// fetch all the products from category id
exports.findProductsFromCategoryId = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ categoryId: categoryId }).sort({
      createdAt: "descending",
    });
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the products",
    });
  }
};

// load all the products added by the particular user
exports.userProducts = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const products = await Product.find({ userId: userId })
      .populate("categoryId")
      .populate("userId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the products",
    });
  }
};

// find product from id
exports.find = async (req, res) => {
  const _id = req.params.id;

  try {
    const product = await Product.findOne({ _id })
      .populate("categoryId")
      .populate("userId");
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Sorry no any product found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Data found",
        data: product,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// delete product from id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await Product.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Product has been successfully deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected product",
    });
  }
};

// search product
exports.searchProduct = async (req, res) => {
  try {
    const { title, categoryId, dateFrom, dateTo, priceFrom, priceTo } =
      req.body;

    let query = {
      isActive: true,
    };

    if (title) {
      query.slug = { $regex: ".*" + title + ".*" };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    // date filter
    if (dateFrom && dateTo) {
      query.createdAt = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    } else if (dateFrom) {
      query.createdAt = { $gte: new Date(dateFrom) };
    } else if (dateTo) {
      query.createdAt = { $lte: new Date(dateTo) };
    }

    // price filter
    if (priceFrom && priceTo) {
      query.priceAfterDiscount = { $gte: priceFrom, $lte: priceTo };
    } else if (priceFrom) {
      query.priceAfterDiscount = { $gte: priceFrom };
    } else if (priceTo) {
      query.priceAfterDiscount = { $lte: priceTo };
    }

    const searchProducts = await Product.find(query)
      .populate("categoryId")
      .populate("userId");

    let foundProductsLength = searchProducts.length;

    if (foundProductsLength > 0) {
      res.status(200).json({
        message: "Products found successfully",
        data: searchProducts,
        length: foundProductsLength,
      });
    } else {
      res.status(200).json({
        message: "Sorry, no products found",
        data: [],
        length: foundProductsLength,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
