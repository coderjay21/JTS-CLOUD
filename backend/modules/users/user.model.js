const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name dena zaroori hai bhai!"],
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Phone number dena zaroori hai bhai!"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            sparse: true 
        },
        profilePic: {
            type: String,
            default: "https://ui-avatars.com/api/?background=random&color=fff" 
        },
        storageLimit: {
            type: Number,
            default: 30 * 1024 * 1024 * 1024 // 30GB default
        },
        usedStorage: {
            type: Number,
            default: 0
        },
        otp: {
            type: String,
        },
        otpExpiresAt: {
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date
        }
    },
    { 
        timestamps: true,
        versionKey: false 
    }
);

// Indexing for blazing fast search queries
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;