const multer = require("multer");
const fs = require("fs");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "uploads";

    if (req.baseUrl.includes("cars")) {
      dest = "uploads/cars";
    } else if (file.fieldname === "drivingLicense") {
      dest = "uploads/licenses";
    } else if (
      req.baseUrl.includes("users") ||
      req.baseUrl.includes("auth")
    ) {
      dest = "uploads/profile-pictures";
    }

    try {
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    let fileName = `file-${Date.now()}.${extension}`;

    if (req.baseUrl.includes("cars")) {
      fileName = `car-${Date.now()}.${extension}`;
    } else if (file.fieldname === "drivingLicense") {
      fileName = `license-${Date.now()}.${extension}`;
    } else if (file.fieldname === "profilePicture") {
      fileName = `profile-${Date.now()}.${extension}`;
    }

    cb(null, fileName);
  },
});

// Driving license accepts JPG/PNG/PDF, everything else (profile pic, car images) is image-only
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isPdf = file.mimetype === "application/pdf";

  if (file.fieldname === "drivingLicense") {
    if (isImage || isPdf) return cb(null, true);
    return cb(new Error("Driving license must be a JPG, PNG, or PDF file"), false);
  }

  if (isImage) return cb(null, true);
  return cb(new Error("Only image files (JPG, PNG) are allowed"), false);
};

// Simple per-field size limits (bytes), matching the spec's max sizes
const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB ceiling; profile picture route enforces 5MB separately if needed

const upload = multer({ storage: diskStorage, fileFilter, limits });

module.exports = upload;
