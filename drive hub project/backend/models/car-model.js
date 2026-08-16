const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Car brand is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Car year is required"],
      min: [1980, "Year seems invalid"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },

    category: {
      type: String,
      trim: true,
      enum: {
        values: ["economy", "sedan", "suv", "luxury", "van", "sports"],
        message: "Please provide a valid category",
      },
    },

    transmission: {
      type: String,
      enum: {
        values: ["automatic", "manual"],
        message: "Transmission must be automatic or manual",
      },
      default: "automatic",
    },

    fuelType: {
      type: String,
      enum: {
        values: ["petrol", "diesel", "hybrid", "electric"],
        message: "Please provide a valid fuel type",
      },
      default: "petrol",
    },

    seats: {
      type: Number,
      min: [1, "Seats must be at least 1"],
      default: 5,
    },

    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    images: {
      type: [String],
      default: [],
    },

    available: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
