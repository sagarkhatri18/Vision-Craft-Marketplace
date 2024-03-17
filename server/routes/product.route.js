var router = require("express").Router();
var productController = require("../controllers/product.controller");
var productImageController = require("../controllers/productImage.controller");

router.post("/", productController.add);
router.get("/", productController.index);
router.delete("/:id", productController.delete);
router.get("/:id", productController.find);
router.get("/fetch/active", productController.findActiveProducts);
router.get("/fetch/category/:categoryId", productController.findProductsFromCategoryId);
router.get("/fetch-from-userid/:userId", productController.userProducts);
router.put("/:id", productController.update);
router.get('/search/:title', productController.searchProductFromTitle)

router.get("/fetch/images/:productId", productImageController.loadProductImages);
router.post("/upload", productImageController.uploadImage);
router.delete("/image/:id", productImageController.deleteImage);
router.put("/image/main/:id", productImageController.updateMainImage);

module.exports = router;
