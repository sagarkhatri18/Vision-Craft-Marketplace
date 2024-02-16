var router = require("express").Router();
var categoryController = require("../controllers/category.controller");

const { validateCategory, validate } = require("../middlewares/validator");

router.post("/", validateCategory, validate, categoryController.add);

module.exports = router;
