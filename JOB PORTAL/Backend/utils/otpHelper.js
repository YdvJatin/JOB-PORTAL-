const crypto = require('crypto');
const nodemailer = require('nodemailer');

// transport configuration - use environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

function generateOtp() {
  // 6-digit numeric code
  return crypto.randomInt(100000, 1000000).toString();
}

async function sendOtpEmail(to, code) {
  const message = {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Verify your account',
    text: `Your verification code is ${code}. It will expire in 10 minutes.`,
  };

  return transporter.sendMail(message);
}

module.exports = {
  generateOtp,
  sendOtpEmail,
};
