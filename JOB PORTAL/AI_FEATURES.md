# AI Features Documentation

## Overview

The JobAI Portal implements several AI-powered features to enhance job matching and recommendations for both candidates and employers.

---

## 1. AI Job Matching Algorithm

### How It Works

The system calculates a match score between a candidate's skills and a job's requirements:

```
Match Score = (Matched Skills / Total Required Skills) × 100
```

### Implementation

**Location:** `Backend/utils/aiHelper.js`

```javascript
const calculateMatchScore = (candidateSkills, jobRequiredSkills) => {
  if (jobRequiredSkills.length === 0) return 100;
  
  const matchedSkills = candidateSkills.filter((skill) =>
    jobRequiredSkills.some(
      (jobSkill) =>
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
};
```

### Features
- Flexible skill matching (substring matching)
- Case-insensitive comparison
- Returns percentage score (0-100)
- Used in applications and recommendations

### Example
```
Candidate Skills: ["JavaScript", "React", "Node.js", "MongoDB"]
Job Required: ["React", "Node.js", "Python"]

Matched: ["React", "Node.js"]
Score: (2/3) × 100 = 67%
```

---

## 2. AI Job Summary Generation

### Purpose
Automatically generate concise summaries of job postings for better understanding.

### Implementation

```javascript
const generateAISummary = (jobTitle, description, skills) => {
  const summary = `
    Position: ${jobTitle}
    Key Responsibilities: Extract main duties from job description
    Required Skills: ${skills.join(', ')}
    Career Growth: Opportunity to develop expertise in relevant technologies
  `;
  return summary.trim();
};
```

### Current Implementation
- Basic template-based generation
- Extracts job title and skills
- Generates career growth insights

### Future Enhancement
Can be upgraded with OpenAI API for NLP-based summaries:

```javascript
const generateAISummary = async (jobTitle, description, skills) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Summarize this job posting:\nTitle: ${jobTitle}\n${description}`,
    max_tokens: 150
  });
  return response.data.choices[0].text;
};
```

---

## 3. AI Keyword Extraction

### Purpose
Identify important keywords from job descriptions for better searchability.

### Implementation

```javascript
const extractKeywords = (text) => {
  const keywords = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 10);
  return [...new Set(keywords)];
};
```

### Features
- Extracts words longer than 4 characters
- Removes duplicates
- Limits to top 10 keywords
- Used for search optimization

### Example
```
Input: "Experienced React developer needed for full-stack position"
Output: ["experienced", "react", "developer", "needed", "full-stack", "position"]
```

---

## 4. Intelligent Job Recommendations

### For Candidates

**Endpoint:** `GET /api/recommendations`

**Algorithm:**
1. Fetch all active jobs
2. Filter by skill match
3. Calculate match scores
4. Sort by score (highest first)
5. Exclude already-applied jobs
6. Return top 10 recommendations

**Code Location:** `Backend/routes/recommendationRoutes.js`

```javascript
// Get all jobs matching candidate skills
const matchedJobs = await Job.find({
  isActive: true,
  requiredSkills: { $in: candidate.skills || [] }
});

// Calculate scores and filter
const recommendedJobs = matchedJobs.map((job) => {
  const matchScore = calculateMatchScore(
    candidate.skills || [], 
    job.requiredSkills || []
  );
  return { ...job, matchScore };
}).sort((a, b) => b.matchScore - a.matchScore);
```

**Features:**
- Skill-based matching
- Score calculation
- Smart filtering (excludes applied jobs)
- Returns top 10 matches

### For Employers

**Endpoint:** `GET /api/recommendations/job/:jobId`

**Algorithm:**
1. Get all candidates
2. Calculate match score for each
3. Sort by score
4. Filter candidates with score > 50%
5. Return top 20 candidates

**Use Case:**
- Find best-fit candidates
- Identify shortlisting candidates
- Track candidate quality

---

## 5. Similar Jobs Discovery

### Purpose
Help users discover related job opportunities.

### Implementation

**Endpoint:** `GET /api/recommendations/similar/:jobId`

```javascript
const similarJobs = await Job.find({
  isActive: true,
  _id: { $ne: req.params.jobId },
  $or: [
    { category: job.category },
    { requiredSkills: { $in: job.requiredSkills } },
  ],
}).limit(10);
```

**Matching Criteria:**
1. Same job category
2. Overlapping required skills

**Limit:** Top 10 similar jobs

---

## 6. Application Review System

### AI Review Fields

Each application includes AI-generated feedback:

```javascript
{
  application: {
    aiReview: {
      strengths: ["Skill match", "Experience level"],
      weaknesses: ["Missing certification"],
      overallFeedback: "Strong candidate, recommend interview"
    }
  }
}
```

### Current Status
- Structure defined in model
- Ready for AI integration
- Can be populated by OpenAI API

---

## Integration with OpenAI API

### Setup

1. **Install OpenAI SDK:**
```bash
npm install openai
```

2. **Update .env:**
```env
OPENAI_API_KEY=sk-your-api-key
```

3. **Create AI Service:**

```javascript
// Backend/utils/openaiHelper.js
const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Enhanced job summary
const generateJobSummaryAI = async (title, description) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a brief professional summary for this job:\nTitle: ${title}\nDescription: ${description}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text;
};

// Enhanced keyword extraction
const extractKeywordsAI = async (text) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Extract 10 most important keywords from:\n${text}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text.split(',').map(k => k.trim());
};

// Generate application review
const generateApplicationReview = async (candidateProfile, jobDescription) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: `Review this application. Candidate: ${JSON.stringify(candidateProfile)}. Job: ${jobDescription}`
    }],
  });
  return response.data.choices[0].message.content;
};

module.exports = {
  generateJobSummaryAI,
  extractKeywordsAI,
  generateApplicationReview,
};
```

---

## Machine Learning Models (Future)

### Recommendation Engine Enhancement
```python
# Could use collaborative filtering
# User-based: Find similar candidates
# Item-based: Find similar jobs
```

### Skill Prediction
- Predict in-demand skills
- Suggest skill gaps to candidates
- Recommend training programs

### Salary Prediction
- Predict salary based on:
  - Skills
  - Experience
  - Location
  - Job type

---

## Performance Metrics

### Tracking AI Performance

```javascript
// Track recommendation acceptance rate
const trackRecommendationClick = async (jobId, candidateId) => {
  // Log when candidate clicks recommended job
};

// Track job matching accuracy
const trackApplicationSuccess = async (applicationId) => {
  // Log if application was accepted
};

// Calculate AI metrics
const calculateAIAccuracy = async () => {
  // (Accepted Applications / Total Recommendations) * 100
};
```

---

## Best Practices

### 1. Bias Prevention
- Ensure algorithms don't discriminate
- Review for location/gender bias
- Monitor demographic distribution

### 2. Privacy
- Don't store unnecessary data
- Encrypt sensitive information
- Follow GDPR/CCPA compliance

### 3. Transparency
- Explain match scores to users
- Show which skills matched
- Allow feedback on recommendations

### 4. Performance
- Cache recommendations
- Use batch processing
- Implement rate limiting for APIs

---

## Testing AI Features

### Unit Tests
```javascript
// Test match score calculation
const testMatchScore = () => {
  const candidate = ["React", "Node.js"];
  const job = ["React", "Python"];
  const score = calculateMatchScore(candidate, job);
  assert(score === 50); // 1 match / 2 required = 50%
};
```

### Integration Tests
```javascript
// Test recommendation endpoint
const testRecommendations = async () => {
  const response = await axios.get('/api/recommendations', {
    headers: { Authorization: 'Bearer token' }
  });
  assert(response.status === 200);
  assert(response.data.recommendations.length > 0);
};
```

---

## Monitoring AI Features

### Key Metrics to Track
1. **Recommendation Acceptance Rate**
   - Users who apply to recommended jobs

2. **Match Score Accuracy**
   - How often high-match applications succeed

3. **Response Time**
   - AI operation latency

4. **Cost**
   - OpenAI API costs
   - Compute resources

### Logging
```javascript
// Log all AI operations
const logAIOperation = (operation, input, output, duration) => {
  console.log({
    timestamp: new Date(),
    operation,
    input,
    output,
    duration_ms: duration
  });
};
```

---

## Troubleshooting AI Features

### Issue: Low Match Scores
**Causes:**
- Candidates not adding skills
- Job skill names differ from candidate skills

**Solutions:**
- Normalize skill names
- Implement fuzzy matching
- Add skill synonyms

### Issue: Poor Recommendations
**Causes:**
- Limited candidate skills
- Not enough job variety
- Algorithm limitations

**Solutions:**
- Encourage profile completion
- Add more diverse jobs
- Upgrade recommendation algorithm

---

## Future Enhancements

1. **Resume Parsing**
   - Extract skills from uploaded resumes
   - Automatic skill profile building

2. **NLP Job Description Analysis**
   - Identify implicit requirements
   - Extract salary ranges automatically
   - Detect job level automatically

3. **Behavioral Matching**
   - Match work styles
   - Company culture fit
   - Team dynamics prediction

4. **Predictive Analytics**
   - Job success probability
   - Career path suggestions
   - Salary negotiation guidance

---

For more information, refer to the main README.md and API_DOCUMENTATION.md
