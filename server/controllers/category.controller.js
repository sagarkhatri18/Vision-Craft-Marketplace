const { Category } = require("../model/category.model");

exports.add = async (req, res, next) => {
  const reqParam = req.body;
  await Category.create({
    name: reqParam.name,
    slug: reqParam.slug,
    is_active: reqParam.is_active,
  })
    .then((data) => {
      res
        .status(200)
        .send({ message: "Category has been successfully added", success: true });
    })
    .catch((error) => {
      res
        .status(400)
        .send({ message: "Failed to add the category", success: false });
    });
};
