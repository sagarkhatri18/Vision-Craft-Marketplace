var router = require("express").Router();
var cartController = require("../controllers/cart.controller");

router.get("/:userId", cartController.index);
router.post("/", cartController.add);

module.exports = router;
