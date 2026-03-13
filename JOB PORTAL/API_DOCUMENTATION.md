# AI-Powered MERN Job Portal - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate" // or "employer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

### Get Current User
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "candidate",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3,
  "location": "New York"
}
```

### Update Profile
```
PUT /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3,
  "location": "New York",
  "bio": "Full Stack Developer"
}
```

---

## Job Endpoints

### Get All Jobs
```
GET /jobs?search=&location=&category=&jobType=&page=1&limit=10
```

**Query Parameters:**
- `search` - Job title or skills (optional)
- `location` - Job location (optional)
- `category` - Job category (optional)
- `jobType` - Full-time, Part-time, Contract, Internship (optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "jobs": [
    {
      "_id": "job_id",
      "title": "Senior React Developer",
      "description": "Looking for experienced React developer...",
      "location": "San Francisco",
      "salary": { "min": 100000, "max": 150000 },
      "jobType": "Full-time",
      "category": "Technology",
      "requiredSkills": ["React", "Node.js", "MongoDB"],
      "experience": 3,
      "company": { "_id": "company_id", "name": "TechCorp" },
      "viewCount": 150,
      "applicantCount": 25,
      "aiSummary": "Summary...",
      "aiKeywords": ["react", "developer", "fullstack"]
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Get Single Job
```
GET /jobs/:id
```

**Response:**
```json
{
  "_id": "job_id",
  "title": "Senior React Developer",
  "description": "Looking for experienced React developer...",
  "location": "San Francisco",
  "salary": { "min": 100000, "max": 150000 },
  "jobType": "Full-time",
  "category": "Technology",
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "experience": 3,
  "education": "Bachelor's in Computer Science",
  "company": {
    "_id": "company_id",
    "name": "TechCorp",
    "companyWebsite": "https://techcorp.com",
    "companyDescription": "Leading tech company..."
  },
  "viewCount": 151,
  "applicantCount": 25
}
```

### Create Job (Employer Only)
```
POST /jobs
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "Looking for experienced React developer...",
  "location": "San Francisco",
  "category": "Technology",
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "jobType": "Full-time",
  "experience": 3,
  "education": "Bachelor's in Computer Science",
  "salary": { "min": 100000, "max": 150000 },
  "deadline": "2024-12-31"
}
```

**Response:**
```json
{
  "message": "Job posted successfully",
  "job": { /* job object */ }
}
```

### Update Job (Employer Only)
```
PUT /jobs/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
Same as create job

### Delete Job (Employer Only)
```
DELETE /jobs/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

---

## Application Endpoints

### Apply for Job
```
POST /applications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "jobId": "job_id",
  "resume": "resume_url",
  "coverLetter": "Optional cover letter text"
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "application_id",
    "candidate": "candidate_id",
    "job": "job_id",
    "status": "applied",
    "matchScore": 85
  },
  "matchScore": 85
}
```

### Get My Applications (Candidate)
```
GET /applications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "application_id",
    "candidate": "candidate_id",
    "job": {
      "_id": "job_id",
      "title": "Senior React Developer",
      "location": "San Francisco",
      "salary": { "min": 100000, "max": 150000 }
    },
    "status": "under-review",
    "matchScore": 85,
    "appliedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Job Applications (Employer)
```
GET /applications/job/:jobId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "application_id",
    "candidate": {
      "_id": "candidate_id",
      "name": "John Doe",
      "email": "john@example.com",
      "skills": ["React", "Node.js"],
      "experience": 3
    },
    "status": "applied",
    "matchScore": 85,
    "appliedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Update Application Status (Employer)
```
PUT /applications/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shortlisted" // or "under-review", "rejected", "accepted"
}
```

**Response:**
```json
{
  "message": "Application updated successfully",
  "application": { /* updated application */ }
}
```

---

## Recommendation Endpoints

### Get Job Recommendations (Candidate)
```
GET /recommendations
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recommendations": [
    {
      "_id": "job_id",
      "title": "Senior React Developer",
      "location": "San Francisco",
      "salary": { "min": 100000, "max": 150000 },
      "requiredSkills": ["React", "Node.js"],
      "matchScore": 92
    }
  ],
  "totalCount": 15
}
```

### Get Candidate Recommendations (Employer)
```
GET /recommendations/job/:jobId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recommendations": [
    {
      "_id": "candidate_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "skills": ["React", "Node.js", "MongoDB"],
      "experience": 5,
      "location": "San Francisco",
      "matchScore": 95
    }
  ],
  "totalCount": 8
}
```

### Get Similar Jobs
```
GET /recommendations/similar/:jobId
```

**Response:**
```json
[
  {
    "_id": "job_id",
    "title": "React Developer",
    "company": { "_id": "company_id", "name": "TechCorp" },
    "location": "San Francisco",
    "salary": { "min": 80000, "max": 120000 }
  }
]
```

---

## Error Responses

All errors return appropriate HTTP status codes:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "param": "email",
      "msg": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "message": "Job not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding for production.

## CORS

CORS is enabled for all origins. Configure in production:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```
