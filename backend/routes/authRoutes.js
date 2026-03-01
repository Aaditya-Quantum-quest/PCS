

const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer'); // NEW

// Email transporter (Gmail - update with your details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Add to .env
        pass: process.env.EMAIL_PASS  // Add to .env (App Password)
    }
});

async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset OTP</h2>
                <div style="background: linear-linear(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 36px;">${otp}</h1>
                    <p style="margin: 10px 0 0 0;">Your OTP expires in 10 minutes</p>
                </div>
                <p style="color: #666; margin-top: 20px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
}

// Existing Controllers
const { loginController, signupController } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// NEW: Forgot Password Routes
authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to user (expires in 10 minutes)
        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);
        
        res.json({ message: 'OTP sent to your email successfully!' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error sending OTP' });
    }
});

authRouter.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const user = await User.findOne({ 
            email, 
            resetOTP: otp,
            resetOTPExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        
        res.json({ message: 'OTP verified successfully!' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
});

authRouter.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;
        
        const user = await User.findOne({ 
            email, 
            resetOTP: otp,
            resetOTPExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save middleware
        user.resetOTP = null;
        user.resetOTPExpiry = null;
        await user.save();

        res.json({ message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error resetting password' });
    }
});



// Existing routes
authRouter.post('/login', loginController);
authRouter.post('/signup', signupController);

// Auth check route using HTTP-only cookie
authRouter.get('/me', authMiddleware, (req, res) => {
    return res.json({
        message: 'Authenticated',
        user: req.user,
    });
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});


module.exports = authRouter;
