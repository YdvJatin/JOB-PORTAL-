# Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js installed
- MongoDB running
- Git

### Step 1: Install Backend
```bash
cd Backend
npm install
```

### Step 2: Configure Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 3: Start Backend
```bash
npm run dev
```
✅ Backend ready on http://localhost:5000

### Step 4: Install Frontend
```bash
cd Frontend
npm install
```

### Step 5: Start Frontend
```bash
npm start
```
✅ Frontend ready on http://localhost:3000

---

## 📱 User Roles

### Candidate Flow
1. Register as "Candidate"
2. Complete profile (add skills)
3. Browse jobs
4. Get AI recommendations
5. Apply for jobs
6. Track applications

### Employer Flow
1. Register as "Employer"
2. Post a job
3. View applications
4. See AI match scores
5. Update application status

---

## 🎯 Main Features

| Feature | Page | Description |
|---------|------|-------------|
| Job Search | /jobs | Browse & filter jobs |
| AI Recommendations | /recommendations | Personalized suggestions |
| Apply for Job | /jobs/:id | Submit application |
| Track Applications | /my-applications | View application status |
| Post Job | /post-job | Create job listing |
| Manage Applications | /employer-dashboard | Review & update status |
| Profile | /profile | Manage user info & skills |

---

## 🔑 API Quick Reference

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Get Jobs
GET /api/jobs?search=react&location=NYC&limit=10

// Apply for Job
POST /api/applications
{
  "jobId": "job_id",
  "resume": "resume_url",
  "coverLetter": "cover letter text"
}

// Get Recommendations
GET /api/recommendations
```

---

## 📊 Database Models

### User
- name, email, password, role
- skills, experience, location
- For employers: companyName, industry

### Job
- title, description, location, salary
- requiredSkills, category, jobType
- matchScore (calculated in recommendations)

### Application
- candidate, job, resume, status
- matchScore, aiReview

---

## 🛠️ Common Commands

```bash
# Backend
npm install           # Install dependencies
npm run dev          # Start server with nodemon
npm start            # Start server

# Frontend
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production

# Database
mongod               # Start MongoDB
mongo job_portal     # Connect to database
```

---

## 🔐 Authentication

All protected routes need JWT token:

```javascript
// Request with token
headers: {
  "Authorization": "Bearer <token>"
}

// Stored in localStorage
localStorage.getItem('token')
localStorage.getItem('userId')
localStorage.getItem('userRole')
```

---

## ⚡ AI Match Score Calculation

```
Score = (Matched Skills / Required Skills) × 100

Example:
Candidate: React, Node.js, MongoDB
Job needs: React, Node.js, Python
Match: 2 out of 3 = 66%
```

---

## 📝 File Locations

| File | Purpose |
|------|---------|
| Backend/server.js | Main server |
| Backend/config/db.js | Database connection |
| Backend/routes/ | API endpoints |
| Backend/models/ | Database schemas |
| Frontend/src/App.jsx | Main React app |
| Frontend/src/pages/ | Page components |
| Frontend/src/services/api.js | API client |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB error | Start mongod service |
| Port 5000 in use | Change PORT in .env |
| CORS error | Verify backend URL in Frontend/.env |
| Module not found | npm install in respective folder |
| Token error | Clear localStorage & login again |

---

## 📚 Documentation Files

- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference
- **AI_FEATURES.md** - AI capabilities & integration
- **PROJECT_COMPLETION.md** - Completion summary

---

## 🌐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_secret_key
NODE_ENV=development
OPENAI_API_KEY=optional
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 UI Customization

### Colors (Tailwind)
- Primary: Blue (#2563eb)
- Secondary: Dark Blue (#1e40af)
- Success: Green
- Danger: Red
- Warning: Yellow

### Edit in: Frontend/tailwind.config.js

---

## 🔄 API Response Format

### Success
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error
```json
{
  "message": "Error description",
  "error": "Detailed error"
}
```

---

## 🎓 Learning Resources

- [Node.js Docs](https://nodejs.org/en/docs/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)

---

## 💡 Pro Tips

1. Use React DevTools for debugging
2. Use Postman for API testing
3. Check browser console for errors
4. Monitor MongoDB with MongoDB Compass
5. Use .env files for secrets
6. Test with different user roles
7. Check network tab for API calls

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas
- [ ] Set CORS origin
- [ ] Enable HTTPS
- [ ] Add error logging
- [ ] Set up monitoring
- [ ] Configure backups

---

## 📞 Support

For issues:
1. Check console logs (Ctrl+Shift+J in browser)
2. Verify all .env files configured
3. Ensure MongoDB is running
4. Check Backend/Frontend are both running
5. Review API response in Network tab

---

## ✨ Project Features at a Glance

✅ User Registration & Login
✅ Job Posting & Management
✅ Application Tracking
✅ AI Job Matching
✅ Smart Recommendations
✅ Role-Based Access
✅ Responsive Design
✅ RESTful API
✅ JWT Authentication
✅ Database Integration

---

**Ready to start? Run the Setup Guide: SETUP_GUIDE.md**

Good luck with your Job Portal! 🎉
