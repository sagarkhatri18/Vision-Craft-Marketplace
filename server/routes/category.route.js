var router = require("express").Router();
var categoryController = require("../controllers/category.controller");
const { authenticateToken } = require("../services/helper");

const { validateCategory, validate } = require("../middlewares/validator");

router.get("/", categoryController.index);
router.post("/", authenticateToken, validateCategory, validate, categoryController.add);
router.post("/upload", authenticateToken, categoryController.uploadImage);
router.delete("/:id", authenticateToken, categoryController.delete);
router.get("/:id", authenticateToken, categoryController.find);
router.put("/:id", authenticateToken, validateCategory, validate, categoryController.update);

module.exports = router;
