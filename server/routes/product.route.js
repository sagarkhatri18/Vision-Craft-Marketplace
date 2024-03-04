var router = require("express").Router();
var productController = require("../controllers/product.controller");

router.post("/", productController.add);

module.exports = router;
