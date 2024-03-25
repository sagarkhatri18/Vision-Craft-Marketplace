var router = require("express").Router();
var categoryController = require("../controllers/review.controller");
const { authenticateToken } = require("../services/helper");
const { validateCategory, validate } = require("../middlewares/validator");

router.get("/", categoryController.index);
router.post("/create", authenticateToken, validateCategory, validate, categoryController.add);


module.exports = router;
