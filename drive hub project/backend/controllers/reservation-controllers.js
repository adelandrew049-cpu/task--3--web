const Reservation = require("../models/reservation-model");
const Car = require("../models/car-model");

// helper to compute nights between two dates
const nightsBetween = (start, end) =>
  Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

// GET /reservations - Admin/Employee see all, Customer sees only their own
const getAllReservations = async (req, res) => {
  try {
    const filter = req.user.role === "customer" ? { customer: req.user._id } : {};

    if (req.query.status) filter.status = req.query.status;

    const reservations = await Reservation.find(filter)
      .populate("customer", "fullName email")
      .populate("car", "brand model pricePerDay images")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      count: reservations.length,
      data: { reservations },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Failed to fetch reservations: ${error.message}`,
    });
  }
};

// GET /reservations/:id
const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("customer", "fullName email")
      .populate("car", "brand model pricePerDay images");

    if (!reservation) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    // Customers may only view their own reservations
    if (
      req.user.role === "customer" &&
      reservation.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to view this reservation",
      });
    }

    res.status(200).json({
      status: "success",
      data: { reservation },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /reservations - Customer only, booking a car
const createReservation = async (req, res) => {
  try {
    const { car: carId, pickupDate, returnDate } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        status: "fail",
        message: "Car not found",
      });
    }

    if (!car.available) {
      return res.status(400).json({
        status: "fail",
        message: "This car is not currently available",
      });
    }

    const totalPrice = nightsBetween(pickupDate, returnDate) * car.pricePerDay;

    const newReservation = await Reservation.create({
      customer: req.user._id,
      car: carId,
      pickupDate,
      returnDate,
      totalPrice,
    });

    res.status(201).json({
      status: "success",
      message: "Reservation created successfully. Awaiting approval.",
      data: { reservation: newReservation },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /reservations/:id - Customer may edit dates while pending; Admin/Employee may edit anything
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    if (req.user.role === "customer") {
      const isOwner = reservation.customer.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to edit this reservation",
        });
      }
      if (reservation.status !== "pending") {
        return res.status(400).json({
          status: "fail",
          message: "Only pending reservations can be edited",
        });
      }
      // customers can only change dates, not status
      delete req.body.status;
    }

    if (req.body.pickupDate || req.body.returnDate) {
      const car = await Car.findById(reservation.car);
      const pickup = req.body.pickupDate || reservation.pickupDate;
      const ret = req.body.returnDate || reservation.returnDate;
      req.body.totalPrice = nightsBetween(pickup, ret) * car.pricePerDay;
    }

    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Reservation updated successfully",
      data: { reservation: updated },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /reservations/:id/approve - Employee/Admin only
const approveReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed", reviewedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Reservation approved",
      data: { reservation },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /reservations/:id/reject - Employee/Admin only
const rejectReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", reviewedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Reservation rejected",
      data: { reservation },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE /reservations/:id - Admin only (customers cancel via status update instead)
const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  approveReservation,
  rejectReservation,
  deleteReservation,
};
