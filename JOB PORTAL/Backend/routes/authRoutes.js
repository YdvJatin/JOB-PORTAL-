const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const { hashPassword, comparePassword, generateToken } = require('../utils/authHelper');
const { generateOtp, sendOtpEmail } = require('../utils/otpHelper');
const { uploadAvatar, uploadResume } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Register route (start verification via OTP)
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role', 'Role must be candidate or employer').isIn(['candidate', 'employer']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // generate otp
      const otp = generateOtp();
      const otpExpires = Date.now() + 1000 * 60 * 10; // 10 minutes

      // Create new user (inactive until verified)
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: true, // Auto-verify user since email is disabled
      });

      await user.save();

      // send verification OTP
      // await sendOtpEmail(email, otp);

      res.status(201).json({
        message: 'Registration initiated. Check your email for the verification code.',
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // must be verified
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your account before logging in' });
      }

      // Check password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id, user.role);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// OTP verification route
router.post(
  '/verify-otp',
  [
    body('email', 'Valid email is required').isEmail(),
    body('otp', 'OTP must be 6 characters').isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Account already verified' });
      }

      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired code' });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = generateToken(user._id, user.role);
      res.json({ message: 'Verification successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, skills, experience, location, bio, portfolio, companyName, companyDescription, companyWebsite, industry } = req.body;

    const updateData = { name, phone };

    if (req.user.role === 'candidate') {
      Object.assign(updateData, { skills, experience, location, bio, portfolio });
    } else if (req.user.role === 'employer') {
      Object.assign(updateData, { companyName, companyDescription, companyWebsite, industry });
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile picture
router.put('/profile/picture', auth, uploadAvatar.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Construct file path to be stored in DB
    const filePath = `uploads/avatars/${req.file.filename}`;
    user.profilePicture = filePath;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully.',
      user: { profilePicture: user.profilePicture },
    });
  } catch (error) {
    // Multer error handling
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max 2MB allowed.' });
    }
    if (error.message === 'Not an image! Please upload an image.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload resume
router.put('/profile/resume', auth, roleCheck(['candidate']), uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const filePath = `uploads/resumes/${req.file.filename}`;
    user.resume = filePath;
    await user.save();

    res.json({
      message: 'Resume updated successfully.',
      user: { resume: user.resume },
    });
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max 5MB allowed.' });
    }
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
