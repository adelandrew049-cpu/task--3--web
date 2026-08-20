const express = require("express");
const authControllers = require("../controllers/auth-controllers");
 
const router = express.Router();
 
// "/signup" matches the Session 6 assignment spec; "/register" is the original
// DriveHub route name — both point at the same controller.
router.post("/signup", authControllers.register);
router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/forgot-password", authControllers.forgotPassword);
router.patch("/reset-password/:token", authControllers.resetPassword);
 
module.exports = router;
