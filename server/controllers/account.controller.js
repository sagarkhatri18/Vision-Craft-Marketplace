const bcrypt = require("bcryptjs");
const { User } = require("../model/user.model");
const { Token } = require("../model/token.model");
const { tokenSign } = require("../services/helper");
const sendEmail = require("../services/email");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password is provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or Password not present",
      });
    }

    // check if the email is valid
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email or password is invalid",
      });
    }

    // compare the user's password with the one provided from the user from login form
    bcrypt.compare(password, user.password).then(function (result) {
      if (result) {
        const token = tokenSign(user);

        // res.cookie("jwt", token, {
        //   httpOnly: true,
        //   maxAge: maxAge * 1000, // 3hrs in ms
        // });
        return res.status(200).json({
          message: "User successfully Logged in",
          success: true,
          user: user._id,
          role: user.role,
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Email or password is invalid" });
      }
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// register new user
exports.register = async (req, res, next) => {
  try {
    const reqParam = req.body;
    
    let user = await User.create({
      firstname: reqParam.firstname,
      lastname: reqParam.lastname,
      email: reqParam.email,
      password: reqParam.password,
      contact: reqParam.contact,
      address: reqParam.address,
      role: reqParam.role,
      verified: reqParam.verified,
    })
      .then(async (data) => {
        // save in the token table
        let token = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });

        const emailData = {
          name: `${reqParam.firstname} ${reqParam.lastname}`,
          mail: reqParam.email,
          subject: "Verify Email",
        };
        await sendEmail(emailData);

        res.status(200).json({
          message: "Successfully registered",
          success: true,
        });
      })
      .catch((error) => {
        res
          .status(400)
          .json({
            message: "Failed to register",
            error: error,
            success: false,
          });
      });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// verify the account
exports.verify = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
};
