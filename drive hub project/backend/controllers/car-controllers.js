const Car = require("../models/car-model");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

// GET /cars - all users (public browsing)
const getAllCars = async (req, res) => {
  try {
    const queryObj = {};

    if (req.query.category) queryObj.category = req.query.category;
    if (req.query.available) queryObj.available = req.query.available === "true";
    if (req.query.search) {
      queryObj.$or = [
        { brand: { $regex: req.query.search, $options: "i" } },
        { model: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const cars = await Car.find(queryObj).sort("-createdAt");

    res.status(200).json({
      status: "success",
      count: cars.length,
      data: { cars },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch cars: ${error.message}`,
    });
  }
};

// GET /cars/:id - all users
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { car },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /cars - Admin/Employee only
const createCar = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const newCar = await Car.create({
      ...req.body,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      message: "Car added successfully",
      data: { car: newCar },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /cars/:id - Admin/Employee only
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }

    const updates = { ...req.body };

    // If new images were uploaded, replace the old ones
    if (req.files && req.files.length > 0) {
      car.images.forEach((img) => deleteUploadedFile("cars", img));
      updates.images = req.files.map((file) => file.filename);
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Car updated successfully",
      data: { car: updatedCar },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /cars/:id/availability - Admin/Employee only
const updateAvailability = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Car availability updated",
      data: { car },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE /cars/:id - Admin/Employee only
const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);

    if (!deletedCar) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }

    deletedCar.images.forEach((img) => deleteUploadedFile("cars", img));

    res.status(200).json({
      status: "success",
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  updateAvailability,
  deleteCar,
};
