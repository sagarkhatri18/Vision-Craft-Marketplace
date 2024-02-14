const { body, validationResult } = require("express-validator");
const { User } = require("../model/user.model");

// validate user registration form
const validateRegistration = [
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("lastname")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long"),
  body("email")
    .isEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        // Will use the below as the error message
        throw new Error("A user already exists with this e-mail address");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  // Add more validation rules as needed
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ status: 422, message: "error", data: errors.array() });
  }
  next();
};

module.exports = {
  validateRegistration,
  validate,
};
