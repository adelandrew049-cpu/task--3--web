const express = require("express");
const authControllers = require("../controllers/auth-controllers");
 
const router = express.Router();
 
router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/forgot-password", authControllers.forgotPassword);
router.patch("/reset-password/:token", authControllers.resetPassword);
 
module.exports = router;
