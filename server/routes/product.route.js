var router = require("express").Router();
var productController = require("../controllers/product.controller");

router.post("/", productController.add);
router.get("/", productController.index);

module.exports = router;
