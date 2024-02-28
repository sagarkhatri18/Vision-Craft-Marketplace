const { Category } = require("../model/category.model");

// list all the categories
exports.index = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      createdAt: "descending",
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// add new category
exports.add = async (req, res, next) => {
  const reqParam = req.body;
  await Category.create({
    name: reqParam.name,
    slug: reqParam.slug,
    isActive: reqParam.isActive,
  })
    .then((data) => {
      return res.status(200).send({
        message: "Category has been successfully added",
        success: true,
      });
    })
    .catch((error) => {
      return res
        .status(400)
        .send({ message: "Failed to add the category", success: false });
    });
};

// update category
exports.update = async (req, res) => {
  const _id = req.params.id;
  const reqParam = req.body;

  const updateData = {
    name: reqParam.name,
    slug: reqParam.slug,
    isActive: reqParam.isActive,
  };

  try {
    await Category.findOneAndUpdate({ _id: _id }, updateData)
      .exec()
      .then((category) => {
        return res.status(200).json({
          success: true,
          message: "Category has been successfully updated",
          data: category,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Failed to update the selected category",
        });
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};

// delete category from id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await Category.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Category has been successfully deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected category",
    });
  }
};

// find category from id
exports.find = async (req, res) => {
  const _id = req.params.id;

  try {
    const category = await Category.findOne({ _id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Sorry no any category found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Data found",
        data: category,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went Wrong",
    });
  }
};
