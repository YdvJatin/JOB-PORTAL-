import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadProfilePicture: (formData) =>
    api.put('/auth/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadResume: (formData) =>
    api.put('/auth/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Job APIs
export const jobAPI = {
  getAll: (filters) => api.get('/jobs', { params: filters }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Application APIs
export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications'),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

// Recommendation APIs
export const recommendationAPI = {
  getJobRecommendations: () => api.get('/recommendations'),
  getCandidateRecommendations: (jobId) => api.get(`/recommendations/job/${jobId}`),
  getSimilarJobs: (jobId) => api.get(`/recommendations/similar/${jobId}`),
};

export default api;
