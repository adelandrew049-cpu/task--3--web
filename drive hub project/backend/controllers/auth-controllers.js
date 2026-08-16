const crypto = require("crypto");
const User = require("../models/user-model");
const generateToken = require("../utils/generate-token");

// Register
const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, city } = req.body;

    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
      city,
      role: "customer", // public registration is always a customer; admins are promoted via the Users endpoint
    });

    const token = generateToken(newUser._id, newUser.role);

    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    if (user.status === "banned") {
      return res.status(403).json({
        status: "fail",
        message: "Your account has been banned",
      });
    }

    const token = generateToken(user._id, user.role);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Logout - stateless JWT: client discards the token. Endpoint kept for API symmetry with the spec.
const logout = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Forgot password - issues a reset token (in production this would be emailed to the user)
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No account found with that email address",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // In production: send resetToken via email instead of returning it in the response.
    res.status(200).json({
      status: "success",
      message: "Password reset token generated. Check your email for instructions.",
      resetToken,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Reset password using the token issued by forgotPassword
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };
