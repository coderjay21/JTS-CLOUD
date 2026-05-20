const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./modules/auth/auth.routes'); 

// Middleware for parsing cookies
app.use(cookieParser());

// 1. Security Profiling
app.use(helmet());

// 2. Cross-Origin-Resource-Sharing
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// 3. JSON Parser body optimization
app.use(express.json({ limit: '100kb' }));

// 4. Rate Limiting protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 150, // Slightly increased for testing flows easily
    message: { success: false, message: "Too many requests from this IP, please try again after 15 mins." }
});
app.use('/api', limiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'JTS-CLOUD Engine is Healthy & Stable 🚀' });
});

// 🚀 ROUTE INJECTION
app.use('/api/v1/auth', authRoutes);

// 5. Centralized Global Error handling engine
app.use((err, req, res, next) => {
    console.error(`[CRITICAL GLOBAL ERROR]: ${err.stack}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;