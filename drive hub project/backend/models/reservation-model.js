const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"],
    },

    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },

    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
      validate: {
        validator: function (value) {
          return value > this.pickupDate;
        },
        message: "Return date must be after pickup date",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "rejected", "completed", "cancelled"],
        message: "Please provide a valid reservation status",
      },
      default: "pending",
    },

    totalPrice: {
      type: Number,
      min: [0, "Total price cannot be negative"],
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
