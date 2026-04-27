const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// ─────────────────────────────────────────
//  POST /api/auth/login/
//  Admin Login
// ─────────────────────────────────────────
router.post('/login/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.trim().toLowerCase(), is_active: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response matches Django format for frontend compatibility
    res.json({
      success: true,
      admin_id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'Admin',
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────
//  POST /api/auth/signup/
//  Admin Signup (NEW)
// ─────────────────────────────────────────
router.post('/signup/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'An admin with this email already exists',
      });
    }

    // Create new admin
    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      admin_id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'Admin',
      token,
      message: 'Signup successful',
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An admin with this email already exists',
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
