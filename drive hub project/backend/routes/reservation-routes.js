const express = require("express");
const reservationControllers = require("../controllers/reservation-controllers");
const { protect, restrictTo } = require("../middleware/auth-middleware");

const router = express.Router();

// All reservation routes require login
router.use(protect);

router
  .route("/")
  .get(reservationControllers.getAllReservations)
  .post(restrictTo("customer"), reservationControllers.createReservation);

router
  .route("/:id")
  .get(reservationControllers.getReservationById)
  .patch(reservationControllers.updateReservation)
  .delete(restrictTo("admin"), reservationControllers.deleteReservation);

router.patch(
  "/:id/approve",
  restrictTo("admin", "employee"),
  reservationControllers.approveReservation
);
router.patch(
  "/:id/reject",
  restrictTo("admin", "employee"),
  reservationControllers.rejectReservation
);

module.exports = router;
