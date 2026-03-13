const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const { generateAISummary, extractKeywords } = require('../utils/aiHelper');

const router = express.Router();

// Create a new job (Employer only)
router.post(
  '/',
  auth,
  roleCheck(['employer']),
  [
    body('title', 'Job title is required').not().isEmpty(),
    body('description', 'Job description is required').not().isEmpty(),
    body('location', 'Location is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('requiredSkills', 'Required skills must be an array').isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, location, category, requiredSkills, jobType, salary, experience, education, deadline } = req.body;

      const aiSummary = generateAISummary(title, description, requiredSkills);
      const aiKeywords = extractKeywords(description);

      const job = new Job({
        title,
        description,
        company: req.user.userId,
        location,
        category,
        requiredSkills,
        jobType,
        salary,
        experience,
        education,
        deadline,
        aiSummary,
        aiKeywords,
      });

      await job.save();
      await job.populate('company', 'name companyName');

      res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get all jobs with filters
router.get(
  '/',
  [
    query('search').optional().isString(),
    query('location').optional().isString(),
    query('category').optional().isString(),
    query('jobType').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const { search, location, category, jobType, page = 1, limit = 10 } = req.query;

      const filter = { isActive: true };

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { aiKeywords: { $regex: search, $options: 'i' } },
        ];
      }

      if (location) filter.location = { $regex: location, $options: 'i' };
      if (category) filter.category = { $regex: category, $options: 'i' };
      if (jobType) filter.jobType = jobType;

      const jobs = await Job.find(filter)
        .populate('company', 'name companyName companyWebsite')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Job.countDocuments(filter);

      res.json({
        jobs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('company', 'name companyName companyWebsite companyDescription industry');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job (Employer only)
router.put('/:id', auth, roleCheck(['employer']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, location, category, requiredSkills, jobType, salary, experience, education, deadline, isActive } = req.body;

    Object.assign(job, {
      title: title || job.title,
      description: description || job.description,
      location: location || job.location,
      category: category || job.category,
      requiredSkills: requiredSkills || job.requiredSkills,
      jobType: jobType || job.jobType,
      salary: salary || job.salary,
      experience: experience || job.experience,
      education: education || job.education,
      deadline: deadline || job.deadline,
      isActive: isActive !== undefined ? isActive : job.isActive,
    });

    if (description) {
      job.aiSummary = generateAISummary(job.title, description, job.requiredSkills);
      job.aiKeywords = extractKeywords(description);
    }

    await job.save();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job (Employer only)
router.delete('/:id', auth, roleCheck(['employer']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
