var router = require("express").Router();
var productController = require("../controllers/product.controller");

router.post("/", productController.add);
router.get("/", productController.index);
router.delete("/:id", productController.delete);
router.get("/:id", productController.find);
router.get("/fetch-from-userid/:userId", productController.userProducts);

module.exports = router;
