const bcrypt = require("bcryptjs");
const { User } = require("../model/user.model");
const { Token } = require("../model/token.model");
const { cartItem } = require("../model/cartItem.model");
const { tokenSign } = require("../services/helper");
const { sendEmail, sendPasswordResetEmail } = require("../services/email");
const { canadaCities } = require("../model/canadaCities.model");

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
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email or password is invalid",
      });
    }

    // compare the user's password with the one provided from the user from login form
    bcrypt.compare(password, user.password).then(async function (result) {
      if (result) {
        // check if the email is verified or not
        if (!user.verified) {
          return res
            .status(400)
            .json({ message: "Account has not been verified yet" });
        }

        const token = tokenSign(user);

        let userCartItems = await cartItem
          .find({ userId: user._id })
          .select("quantity");

        const cartQuantityCounter = userCartItems.reduce((total, item) => {
          return total + parseInt(item.quantity);
        }, 0);

        // Return response without password
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(200).json({
          message: "User successfully Logged in",
          success: true,
          user: userWithoutPassword,
          token: token,
          cartQuantity: cartQuantityCounter,
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

    let userData = await User.create({
      country: reqParam.country,
      province: reqParam.province,
      city: reqParam.city,
      streetName: reqParam.streetName,
      suiteNumber: reqParam.suiteNumber,
      postalCode: reqParam.postalCode,
      contactNumber: reqParam.contactNumber,
      role: reqParam.role,
      verified: reqParam.verified,
      firstName: reqParam.firstName,
      lastName: reqParam.lastName,
      email: reqParam.email,
      password: reqParam.password,
    })
      .then(async (data) => {
        // save in the token table
        let token = await Token.create({
          userId: data._id,
          token: require("crypto").randomBytes(32).toString("hex"),
        });

        const emailData = {
          name: `${reqParam.firstName} ${reqParam.lastName}`,
          mail: reqParam.email,
          subject: "Verify Email",
        };
        await sendEmail(emailData, data._id, token.token);

        res.status(200).json({
          message: "Successfully registered",
          success: true,
        });
      })
      .catch((error) => {
        res.status(400).json({
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

    await User.findOneAndUpdate({ _id: user._id }, { verified: true });
    await Token.findOneAndDelete({ _id: token._id });

    res.send("email verified sucessfully");
  } catch (error) {
    res.send(error.message);
    res.status(400).send("An error occured");
  }
};

// load data from token
exports.findUserFromToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user)
      return res.status(400).json({
        status: false,
        message: "Invalid link provided",
      });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token)
      return res.status(400).json({
        status: false,
        message: "Invalid link provided",
      });

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to send the password reset link",
      success: false,
    });
  }
};

// password reset
exports.resetPassword = async (req, res, next) => {
  try {
    const reqParam = req.body;

    const user = await User.findOne({ email: reqParam.email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Sorry, the email doesn't exist",
      });
    }

    // save in the token table
    let token = await Token.create({
      userId: user._id,
      token: require("crypto").randomBytes(32).toString("hex"),
      remark: "password-reset",
    });

    const emailData = {
      name: `${user.firstName} ${user.lastName}`,
      mail: user.email,
      subject: "Password Reset",
      userId: user._id,
      token: token.token,
      baseURL: reqParam.baseURL,
    };

    await sendPasswordResetEmail(emailData);

    res.status(200).json({
      message:
        "Password reset link has been successfully sent to your email. Please check your email.",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to send the password reset link",
      error: error.message,
    });
  }
};

// change password
exports.changePassword = async (req, res, next) => {
  try {
    const { userId, password, currentPassword } = req.body;

    const user = await User.findById(userId);

    // Check if current password is provided
    if (currentPassword) {
      // Validate current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    } else {
      await Token.findOneAndDelete({ token: req.body.token });
    }

    // Update user's password
    user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User password has been successfully updated",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update the password",
      error: error.message,
    });
  }
};

// fetch all the provinces from the database
exports.provinces = async (req, res, next) => {
  try {
    const distinctProvinceIds = await canadaCities.distinct("provinceId");

    // Fetch province documents corresponding to distinct province IDs
    const provinces = await Promise.all(
      distinctProvinceIds.map(async (provinceId) => {
        return await canadaCities
          .findOne({ provinceId })
          .select("provinceId provinceName");
      })
    );

    return res.status(200).json({
      success: true,
      data: provinces,
      message: "Data fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to load the provinces",
      error: error.message,
    });
  }
};

// fetch all the cities from the province
exports.provinceCities = async (req, res, next) => {
  try {
    const provinceName = req.params.provinceName;
    const cities = await canadaCities.find({ provinceName }).select("city");
    return res.status(200).json({
      success: true,
      data: cities,
      message: "Data fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to load the cities",
      error: error.message,
    });
  }
};
