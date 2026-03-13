const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['applied', 'under-review', 'shortlisted', 'rejected', 'accepted'],
      default: 'applied',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    aiReview: {
      strengths: [String],
      weaknesses: [String],
      overallFeedback: String,
    },
    appliedAt: {
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

module.exports = mongoose.model('Application', applicationSchema);
