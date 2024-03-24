var router = require("express").Router();

const paymentController = require("../controllers/payment.controller");

router.post("/create-checkout-session", paymentController.checkoutSession);
router.get("/product-order/:orderId", paymentController.findProductOrder);

module.exports = router;
