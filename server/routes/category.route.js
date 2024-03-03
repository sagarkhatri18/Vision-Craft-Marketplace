var router = require("express").Router();
var categoryController = require("../controllers/category.controller");

const { validateCategory, validate } = require("../middlewares/validator");

router.get("/", categoryController.index);
router.post("/",  categoryController.add);
router.post("/upload",  categoryController.uploadImage);
router.delete("/:id", categoryController.delete);
router.get('/:id', categoryController.find)
router.put("/:id", categoryController.update);

module.exports = router;
