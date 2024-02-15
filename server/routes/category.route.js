var router = require("express").Router();
var categoryController = require("../controllers/account.controller");

const { validateRegistration, validate } = require("../middlewares/validator");

router.post(
  "/category",
  validateRegistration,
  validate,
  categoryController.add
);

module.exports = router;
