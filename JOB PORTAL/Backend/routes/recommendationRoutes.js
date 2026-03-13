const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const auth = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const { calculateMatchScore } = require('../utils/aiHelper');

const router = express.Router();

// Get personalized job recommendations for a candidate
router.get('/', auth, roleCheck(['candidate']), async (req, res) => {
  try {
    const candidate = await User.findById(req.user.userId);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Get jobs that match candidate skills
    const matchedJobs = await Job.find({
      isActive: true,
      requiredSkills: { $in: candidate.skills || [] },
    })
      .populate('company', 'name companyName')
      .limit(20);

    // Calculate match scores
    const recommendedJobs = matchedJobs.map((job) => {
      const matchScore = calculateMatchScore(candidate.skills || [], job.requiredSkills || []);
      return {
        ...job.toObject(),
        matchScore,
      };
    });

    // Sort by match score
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Get applied jobs to exclude
    const appliedJobs = await Application.find({
      candidate: req.user.userId,
    }).select('job');

    const appliedJobIds = appliedJobs.map((app) => app.job.toString());

    const filteredRecommendations = recommendedJobs.filter(
      (job) => !appliedJobIds.includes(job._id.toString())
    );

    res.json({
      recommendations: filteredRecommendations.slice(0, 10),
      totalCount: filteredRecommendations.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get candidates matching a job (for employers)
router.get('/job/:jobId', auth, roleCheck(['employer']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view recommendations for this job' });
    }

    // Get all candidates
    const candidates = await User.find({ role: 'candidate' }).select(
      'name email skills experience location'
    );

    // Calculate match scores
    const matchedCandidates = candidates.map((candidate) => {
      const matchScore = calculateMatchScore(candidate.skills || [], job.requiredSkills || []);
      return {
        ...candidate.toObject(),
        matchScore,
      };
    });

    // Sort by match score
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    // Filter candidates with match score > 50
    const recommendedCandidates = matchedCandidates.filter((c) => c.matchScore >= 50);

    res.json({
      recommendations: recommendedCandidates.slice(0, 20),
      totalCount: recommendedCandidates.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get similar jobs based on a job
router.get('/similar/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Find similar jobs by skills and category
    const similarJobs = await Job.find({
      isActive: true,
      _id: { $ne: req.params.jobId },
      $or: [
        { category: job.category },
        { requiredSkills: { $in: job.requiredSkills } },
      ],
    })
      .populate('company', 'name companyName')
      .limit(10);

    res.json(similarJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
