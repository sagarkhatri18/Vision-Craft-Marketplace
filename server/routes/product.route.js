var router = require("express").Router();
var productController = require("../controllers/product.controller");

router.post("/", productController.add);
router.get("/", productController.index);
router.delete("/:id", productController.delete);
router.get("/:id", productController.find);
router.get("/fetch/active", productController.findActiveProducts);
router.get("/fetch-from-userid/:userId", productController.userProducts);
router.put("/:id", productController.update);

module.exports = router;
