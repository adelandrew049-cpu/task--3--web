const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dbConnect = require("./config/db-connect");
const errorHandler = require("./middleware/error-middleware");

const authRouter = require("./routes/auth-routes");
const userRouter = require("./routes/user-routes");
const carRouter = require("./routes/car-routes");
const reservationRouter = require("./routes/reservation-routes");

const app = express();

dbConnect();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded files (profile pictures, licenses, car images)
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/reservations", reservationRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "success", message: "DriveHub API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
