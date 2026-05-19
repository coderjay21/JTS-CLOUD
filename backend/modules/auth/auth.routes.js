const express = require('express');
const router = express.Router();
const authController = require("./auth.controller");

// Routes
// Register route
router.post('/register', authController.register);
// Login Route
router.post('/login', authController.login)
// Send OTP route
router.post('/send-otp', authController.sendOTP);
// Verify OTP route
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;