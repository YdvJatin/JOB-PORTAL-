const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const avatarDir = 'uploads/avatars';
const resumeDir = 'uploads/resumes';
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

// Storage engine for profile pictures
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Storage engine for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// File filter for documents
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
};

exports.uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
  fileFilter: imageFileFilter,
});

exports.uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: resumeFileFilter,
});