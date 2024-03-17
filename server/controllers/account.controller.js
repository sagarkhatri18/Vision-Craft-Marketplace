const bcrypt = require("bcryptjs");
const { User } = require("../model/user.model");
const { Token } = require("../model/token.model");
const { tokenSign } = require("../services/helper");
const sendEmail = require("../services/email");

exports.login = async (req, res, next) => {
  try {
    // Login logic
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    // Registration logic
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.verify = async (req, res, next) => {
  try {
    // Verification logic
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// Forgot password logic
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and save reset token
    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send password reset email
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const emailData = {
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };
    await sendEmail(emailData);

    res.status(200).json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
