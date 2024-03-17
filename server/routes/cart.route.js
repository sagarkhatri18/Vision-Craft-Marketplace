var router = require("express").Router();
var cartController = require("../controllers/cart.controller");

router.get("/:userId", cartController.index);
router.post("/", cartController.add);
router.put("/:id", cartController.update);
router.delete("/:id", cartController.delete);

module.exports = router;
