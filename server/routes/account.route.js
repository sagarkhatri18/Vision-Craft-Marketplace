var router = require("express").Router();
var accountController = require("../controllers/account.controller");

const { validateRegistration, validate } = require("../middlewares/validator");

router.post("/login", accountController.login);
router.post(
  "/register",
  validateRegistration,
  validate,
  accountController.register
);
router.get("/account/verify/:id/:token", accountController.verify);
router.post("/account/forgotpassword", accountController.forgotpassword);

module.exports = router;
