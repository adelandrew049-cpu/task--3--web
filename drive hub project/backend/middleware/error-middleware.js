const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }

  next();
};

module.exports = errorHandler;
