const User = require('../users/user.model'); 
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'jts_cloud_secret_key_123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d' // 30 days session
    });
};

// @desc    Generate OTP & Send via Termux SMS Gateway
// @route   POST /api/v1/auth/send-otp
exports.sendOTP = async (req, res, next) => {
    try {
        let { phone, name } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number dena zaroori hai bhai!" });
        }

        // Clean phone formatting (removes spaces, dashes)
        phone = phone.replace(/\s+/g, '');

        // 6-Digit Cryto-safe alternative or fast random generation
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes valid

        // Find or create user atomicity check
        let user = await User.findOne({ phone });

        if (user) {
            user.otp = generatedOtp;
            user.otpExpiresAt = expiryTime;
        } else {
            user = new User({
                phone,
                name: name || 'Cloud User',
                otp: generatedOtp,
                otpExpiresAt: expiryTime
            });
        }

        await user.save();

        // Gateway configuration integration
        const gatewayUrl = process.env.SMS_GATEWAY_URL; 
        if (!gatewayUrl) {
            console.error("[⚠️ ENV ERROR]: SMS_GATEWAY_URL missing in .env!");
            return res.status(500).json({ success: false, message: "Internal server configuration issue." });
        }

        const smsMessage = `Apka code ${generatedOtp} hai. 5 min me expire ho jayega.`;

        // Direct async non-blocking execution to Termux
        await axios.post(gatewayUrl, { to: phone, msg: smsMessage }, { timeout: 8000 });

        console.log(`\n📲 [JTS-CLOUD OTP LOG]: Sent [${generatedOtp}] to ${phone}`);

        return res.status(200).json({
            success: true,
            message: "OTP successfully sent to your mobile via Redmi Gateway!"
        });

    } catch (error) {
        console.error("[AUTH CONTROLLER ERROR - SEND]:", error.message);
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({
                success: false,
                message: "Termux SMS server offline hai ya IP badal gayi hai bhai! Check ifconfig."
            });
        }
        next(error);
    }
};

// @desc    Verify OTP and log in / register user completely
// @route   POST /api/v1/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: "Phone aur OTP dono fields chahiye bhai!" });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ success: false, message: "Is number se koi user nahi mila!" });
        }

        // 1. Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Galat OTP hai bhai! Re-check karo." });
        }

        // 2. Check if OTP is expired
        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ success: false, message: "OTP expire ho chuka hai! Firse send karo." });
        }

        // 3. Clear OTP fields after successful verification to prevent reuse
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.isVerified = true;
        user.lastLogin = new Date();
        await user.save();

        // 4. Generate Login Token
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Authentication successful! Welcome to JTS-Cloud 🚀",
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                storageLimit: user.storageLimit,
                usedStorage: user.usedStorage
            }
        });

    } catch (error) {
        console.error("[AUTH CONTROLLER ERROR - VERIFY]:", error.message);
        next(error);
    }
};

// Temporary fallbacks for backward compatibility
exports.register = (req, res) => res.status(200).json({ msg: "Registration completely moved to OTP pipeline!" });
exports.login = (req, res) => res.status(200).json({ msg: "Login completely moved to OTP pipeline!" });