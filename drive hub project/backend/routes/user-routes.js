const express = require("express");
const userControllers = require("../controllers/user-controllers");
const upload = require("../middleware/upload-middleware");
const { protect, restrictTo } = require("../middleware/auth-middleware");

const router = express.Router();

// All routes below require login
router.use(protect);

// Self-service routes (any logged-in user)
// "/profile" matches the Session 6 assignment's example protected route; "/me" is
// the original DriveHub route name — both point at the same controller.
router.get("/profile", userControllers.getMe);
router.get("/me", userControllers.getMe);
router.patch("/me", userControllers.updateMe);
router.post(
  "/me/photo",
  upload.single("profilePicture"),
  userControllers.uploadProfilePicture
);
router.post(
  "/me/license",
  restrictTo("customer"),
  upload.single("drivingLicense"),
  userControllers.uploadDrivingLicense
);

// Admin-only user management
router.use(restrictTo("admin"));

router.route("/").get(userControllers.getAllUsers).post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getUserById)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
