# AI-Powered MERN Job Portal

An advanced job portal platform built with MERN stack (MongoDB, Express, React, Node.js) featuring AI-powered job matching, intelligent recommendations, and seamless recruitment management for candidates and employers.

## Features

### For Candidates
- **User Authentication**: Secure registration and login
- **AI-Powered Recommendations**: Get personalized job suggestions based on skills and experience
- **Job Matching Score**: Intelligent matching algorithm calculates compatibility with jobs
- **Application Management**: Track all job applications and their statuses
- **Profile Management**: Create and update professional profile with skills and experience
- **Job Search & Filters**: Advanced search with multiple filtering options
- **Similar Jobs**: Discover related job opportunities

### For Employers
- **Job Posting**: Post new job openings with detailed descriptions
- **Application Management**: Review and manage candidate applications
- **AI Matching Score**: See how well candidates match job requirements
- **Candidate Rankings**: Applications sorted by match score
- **Dashboard Analytics**: Track job views and application statistics
- **Job Editing**: Update job details anytime
- **Candidate Recommendations**: Get AI-powered candidate suggestions

### Admin Features
- **User Management**
- **Job Moderation**
- **Platform Analytics**

## Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API server
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication & authorization
- **Bcryptjs**: Password hashing
- **Express Validator**: Input validation

### Frontend
- **React 18**: UI library
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **React Icons**: Icon library

## Project Structure

```
JOB PORTAL/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── recommendationRoutes.js
│   ├── utils/
│   │   ├── authHelper.js
│   │   └── aiHelper.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── Frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navigation.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── JobListingPage.jsx
    │   │   ├── JobDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── MyApplicationsPage.jsx
    │   │   ├── PostJobPage.jsx
    │   │   ├── EmployerDashboardPage.jsx
    │   │   └── RecommendationsPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.jsx
    │   ├── index.css
    │   └── .env
    ├── package.json
    └── tailwind.config.js
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and configure:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Job Routes (`/api/jobs`)
- `GET /` - Get all jobs (with filters)
- `GET /:id` - Get job details
- `POST /` - Create new job (Employer only)
- `PUT /:id` - Update job (Employer only)
- `DELETE /:id` - Delete job (Employer only)

### Application Routes (`/api/applications`)
- `POST /` - Apply for a job
- `GET /` - Get candidate's applications
- `GET /job/:jobId` - Get job applications (Employer only)
- `PUT /:id` - Update application status (Employer only)

### Recommendation Routes (`/api/recommendations`)
- `GET /` - Get job recommendations (Candidate only)
- `GET /job/:jobId` - Get candidate recommendations (Employer only)
- `GET /similar/:jobId` - Get similar jobs

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is sent in request headers: `Authorization: Bearer <token>`
5. Server validates token for protected routes

## AI Features

### Job Matching Algorithm
```javascript
// Calculates match score based on skill overlap
matchScore = (matchedSkills / totalRequiredSkills) * 100
```

### AI Summary Generation
- Extracts key information from job descriptions
- Generates job summaries for quick overview
- Identifies important keywords

### Recommendations Engine
- Analyzes candidate skills
- Matches with available jobs
- Ranks by compatibility score
- Excludes already-applied jobs

## User Roles

### Candidate
- Can search and apply for jobs
- Receive personalized recommendations
- Track application status
- Manage professional profile

### Employer
- Post and manage job openings
- Review candidate applications
- Update application status
- Get AI-powered candidate matches

### Admin
- Manage users and jobs
- View platform analytics
- Moderate content

## Database Models

### User
```javascript
{
  name, email, password, role, phone,
  profilePicture, resume, skills, experience,
  location, bio, portfolio (candidate fields),
  companyName, companyDescription, companyWebsite,
  industry, isVerified (employer fields)
}
```

### Job
```javascript
{
  title, description, company, location,
  salary, jobType, category, requiredSkills,
  experience, education, applicantCount,
  viewCount, isActive, aiSummary, aiKeywords,
  deadline
}
```

### Application
```javascript
{
  candidate, job, resume, coverLetter,
  status, matchScore, aiReview
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with express-validator
- Protected API endpoints
- Secure token storage

## Performance Optimizations

- MongoDB indexing on frequently queried fields
- Frontend pagination for job listings
- Lazy loading of components
- Efficient API calls with axios
- CSS optimization with Tailwind

## Future Enhancements

1. **Advanced AI Integration**
   - OpenAI API for intelligent job descriptions
   - NLP for skill extraction
   - Resume parsing

2. **Additional Features**
   - Video interviews
   - Skill assessments
   - Salary negotiation tools
   - Company reviews
   - Messaging system

3. **Mobile App**
   - React Native implementation
   - Push notifications
   - Offline functionality

4. **Analytics & Reporting**
   - Advanced dashboards
   - Email notifications
   - Export reports

## Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify `.env` variables
- Check port availability
- Clear node_modules and reinstall

### Frontend Issues
- Clear browser cache
- Check API URL in `.env`
- Verify backend is running
- Check console for errors

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

**Happy Job Hunting!** 🎉
