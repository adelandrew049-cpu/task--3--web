const express = require("express");
const carControllers = require("../controllers/car-controllers");
const upload = require("../middleware/upload-middleware");
const { protect, restrictTo } = require("../middleware/auth-middleware");

const router = express.Router();

// Public browsing - no login required
router.get("/", carControllers.getAllCars);
router.get("/:id", carControllers.getCarById);

// Everything below requires Admin or Employee
router.use(protect, restrictTo("admin", "employee"));

router.post("/", upload.array("images", 6), carControllers.createCar);
router.patch("/:id", upload.array("images", 6), carControllers.updateCar);
router.patch("/:id/availability", carControllers.updateAvailability);
router.delete("/:id", carControllers.deleteCar);

module.exports = router;
