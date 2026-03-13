const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    // Candidate specific fields
    resume: {
      type: String,
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    // Employer specific fields
    companyName: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    industry: {
      type: String,
    },
    // verification fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
