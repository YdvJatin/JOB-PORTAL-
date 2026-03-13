const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    category: {
      type: String,
      required: true,
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    experience: {
      type: Number,
      default: 0,
    },
    education: {
      type: String,
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    aiSummary: {
      type: String,
    },
    aiKeywords: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
