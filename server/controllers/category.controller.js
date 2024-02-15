const { Category } = require("../model/category.model");

exports.add = async (req, res, next) => {
  try {
    const { name, is_active } = req.body;
    res.send(name)

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
