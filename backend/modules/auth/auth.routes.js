const express = require('express');
const router = express.Router();
const authController = require("./auth.controller");

// Routes

// Send OTP route
router.post('/send-otp', authController.sendOTP);
// Verify OTP route
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;