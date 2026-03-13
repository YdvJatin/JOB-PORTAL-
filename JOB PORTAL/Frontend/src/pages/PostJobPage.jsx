import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    jobType: 'Full-time',
    requiredSkills: '',
    experience: 0,
    education: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'employer') {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        salary: {
          min: parseInt(formData.salaryMin) || 0,
          max: parseInt(formData.salaryMax) || 0,
        },
      };

      delete jobData.salaryMin;
      delete jobData.salaryMax;

      await jobAPI.create(jobData);
      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        jobType: 'Full-time',
        requiredSkills: '',
        experience: 0,
        education: '',
        salaryMin: '',
        salaryMax: '',
        deadline: '',
      });

      setTimeout(() => {
        navigate('/employer-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

          {error && <div className="bg-red-900/50 text-red-300 p-4 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-900/50 text-green-300 p-4 rounded mb-4">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                placeholder="e.g., Senior React Developer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary h-32"
                placeholder="Describe the job responsibilities and requirements..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-text-primary font-semibold mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                  placeholder="e.g., New York, USA"
                />
              </div>
              <div>
                <label className="block text-text-primary font-semibold mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-text-primary font-semibold mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-text-primary font-semibold mb-2">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Required Skills (comma separated) *</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                required
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-text-primary font-semibold mb-2">Min Salary (USD)</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-text-primary font-semibold mb-2">Max Salary (USD)</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                  placeholder="150000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-text-primary font-semibold mb-2">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
                  placeholder="e.g., Bachelor's in Computer Science"
                />
              </div>
              <div>
                <label className="block text-text-primary font-semibold mb-2">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Posting Job...' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/employer-dashboard')}
                className="flex-1 bg-dark-bg border border-border-color hover:bg-border-color text-text-primary font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
