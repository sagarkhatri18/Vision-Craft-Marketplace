const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { validateUserCreate, validate } = require("../middlewares/validator");

router.get("/", userController.index);
router.get("/:id", userController.find);
router.delete("/:id", userController.delete);
router.post("/", validateUserCreate, validate, userController.add);
router.put("/:id", userController.update);

module.exports = router;
