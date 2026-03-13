const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const { calculateMatchScore } = require('../utils/aiHelper');

const router = express.Router();

// Apply for a job
router.post('/', auth, roleCheck(['candidate']), async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    if (!jobId || !resume) {
      return res.status(400).json({ message: 'Job ID and resume are required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      candidate: req.user.userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Get candidate skills from user profile
    const { User } = require('../models');
    const candidate = await require('../models/User').findById(req.user.userId);
    const matchScore = calculateMatchScore(candidate.skills || [], job.requiredSkills || []);

    const application = new Application({
      candidate: req.user.userId,
      job: jobId,
      resume,
      coverLetter,
      matchScore,
    });

    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
      matchScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get applications for a job (Employer only)
router.get('/job/:jobId', auth, roleCheck(['employer']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills experience')
      .sort({ matchScore: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get applications for a candidate
router.get('/', auth, roleCheck(['candidate']), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.userId })
      .populate('job', 'title company location salary')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status (Employer only)
router.put('/:id', auth, roleCheck(['employer']), async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job);
    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.json({ message: 'Application updated successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
