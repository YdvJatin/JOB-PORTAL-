# Development Setup Guide

## Quick Start

### Prerequisites
- Node.js v14+ (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/try/download/community)
- Git
- Visual Studio Code or any code editor

### Step 1: Clone/Setup Project

```bash
cd "c:\Users\ayush yadav\OneDrive\Desktop\JOB PORTAL"
```

### Step 2: Backend Setup

#### 2.1 Install MongoDB
Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)

#### 2.2 Install Backend Dependencies
```bash
cd Backend
npm install
```

#### 2.3 Configure Environment
Create `.env` file in `Backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_secret_key_12345
NODE_ENV=development
OPENAI_API_KEY=your_openai_key_here
```

#### 2.4 Start Backend Server
```bash
npm run dev
```

Expected output:
```
MongoDB Connected: localhost
Server running on port 5000
```

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies
```bash
cd Frontend
npm install
```

#### 3.2 Configure Environment
Create `.env` file in `Frontend/` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Server
```bash
npm start
```

The application will open at `http://localhost:3000`

---

## Project Workflow

### Development Mode
1. Start MongoDB service
2. Start Backend: `cd Backend && npm run dev`
3. In new terminal, start Frontend: `cd Frontend && npm start`
4. Open browser to `http://localhost:3000`

### File Structure

#### Backend
- `server.js` - Main entry point
- `config/db.js` - MongoDB connection
- `models/` - Database schemas (User, Job, Application)
- `routes/` - API endpoints
- `middleware/` - Authentication & authorization
- `utils/` - Helper functions (AI, Auth)

#### Frontend
- `src/App.jsx` - Main React component
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/api.js` - API client

---

## Testing the Application

### 1. Register as Candidate
- Go to Register page
- Select "Job Candidate" role
- Complete registration
- You'll be redirected to Dashboard

### 2. Update Profile
- Go to Profile page
- Add skills, experience, location
- Save changes

### 3. Browse Jobs
- Click "Browse Jobs"
- Use filters to search
- Click on job to view details

### 4. Get Recommendations
- Go to "AI Recommendations"
- View personalized job suggestions
- See match score percentage

### 5. Register as Employer
- Logout and register new account
- Select "Employer/Recruiter" role
- Complete registration

### 6. Post Job
- Go to "Post Job"
- Fill in job details
- Submit to post job

### 7. Manage Applications
- Go to "Dashboard"
- View all applications for your jobs
- Update application status

---

## Common Issues & Solutions

### MongoDB Connection Error
**Problem:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
```bash
# Start MongoDB service (Windows)
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env to your Atlas connection string
```

### Port Already in Use
**Problem:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual ID)
taskkill /PID <PID> /F

# Or change port in Backend/.env
PORT=5001
```

### CORS Error
**Problem:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- Verify Backend is running on port 5000
- Check REACT_APP_API_URL in Frontend/.env
- Restart both servers

### Module Not Found
**Problem:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/job_portal

# Authentication
JWT_SECRET=your_secret_key_change_in_production

# AI (Optional)
OPENAI_API_KEY=sk-xxxx
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Code Style

### JavaScript/React
- Use ES6+ syntax
- Functional components with hooks
- Use arrow functions
- Camelcase for variables
- PascalCase for components

### Naming Conventions
```javascript
// Components
const HomePage = () => { }

// Functions
const fetchJobs = async () => { }

// Variables
const jobList = []
const isLoading = false

// Constants
const API_URL = 'http://...'
```

---

## API Testing

Use Postman or cURL to test APIs:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456","role":"candidate"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Get Jobs
curl -X GET "http://localhost:5000/api/jobs?limit=10"
```

---

## Performance Tips

1. **Frontend**
   - Use React DevTools to check unnecessary renders
   - Implement lazy loading for pages
   - Optimize images

2. **Backend**
   - Add indexes to frequently queried fields
   - Implement caching for recommendations
   - Use pagination for large datasets

3. **Database**
   - Regular backups
   - Monitor query performance
   - Clean up old data

---

## Deployment Checklist

- [ ] Update environment variables
- [ ] Set JWT_SECRET to strong value
- [ ] Enable production mode
- [ ] Set up MongoDB Atlas
- [ ] Configure CORS for frontend domain
- [ ] Add SSL certificates
- [ ] Set up CI/CD pipeline
- [ ] Configure error logging
- [ ] Set up monitoring

---

## Useful Commands

```bash
# Backend
cd Backend
npm install           # Install dependencies
npm start            # Start server
npm run dev          # Start with nodemon
npm test             # Run tests (when added)

# Frontend
cd Frontend
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm test             # Run tests (when added)
```

---

## Next Steps

1. **Add More Features**
   - Email notifications
   - Real-time messaging
   - Video interviews
   - Skill assessments

2. **Improve AI**
   - Integrate OpenAI API
   - Implement NLP
   - Advanced job matching

3. **Scale Application**
   - Add Redis caching
   - Implement search indexing
   - Set up load balancing

4. **Security Enhancements**
   - Rate limiting
   - Input sanitization
   - Two-factor authentication
   - CSRF protection

---

## Support

For issues or questions:
1. Check console logs (Frontend & Backend)
2. Review MongoDB connection
3. Verify all dependencies installed
4. Check .env files configuration
5. Restart both servers

Happy coding! 🚀
