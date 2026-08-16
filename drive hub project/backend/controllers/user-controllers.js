const User = require("../models/user-model");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

// GET /users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch users: ${error.message}`,
    });
  }
};

// GET /users/:id - Admin only
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /users - Admin only (e.g. creating employee/admin accounts)
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { user: newUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /users/:id - Admin only (role, status, etc.)
const updateUser = async (req, res) => {
  try {
    delete req.body.password; // password changes go through auth flows, not this endpoint

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE /users/:id - Admin only
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /users/me - any logged-in user
const getMe = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
};

// PATCH /users/me - self profile update (name, phone, city, bio only)
const updateMe = async (req, res) => {
  try {
    const allowedFields = ["fullName", "phone", "city", "bio"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /users/me/photo - upload/replace profile picture (all roles)
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload an image file (JPG or PNG, max 5MB)",
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      deleteUploadedFile("profile-pictures", req.file.filename);
      return res.status(400).json({
        status: "fail",
        message: "Profile picture must not exceed 5MB",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.profilePicture) {
      deleteUploadedFile("profile-pictures", user.profilePicture);
    }

    user.profilePicture = req.file.filename;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Profile picture uploaded successfully",
      data: { profilePicture: user.profilePicture },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /users/me/license - upload driving license (customer only)
const uploadDrivingLicense = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload a JPG, PNG, or PDF file (max 10MB)",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.drivingLicense) {
      deleteUploadedFile("licenses", user.drivingLicense);
    }

    user.drivingLicense = req.file.filename;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Driving license uploaded successfully",
      data: { drivingLicense: user.drivingLicense },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  uploadProfilePicture,
  uploadDrivingLicense,
};
