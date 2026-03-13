import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase } from 'react-icons/fa';

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    jobType: '',
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAll(filters);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Job Listings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="bg-surface rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title, skills..."
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, country..."
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                <option value="">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Job Type</label>
              <select name="jobType" value={filters.jobType} onChange={handleFilterChange} className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary">
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <button onClick={handleSearch} className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
              Apply Filters
            </button>
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-text-secondary">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
                <p className="text-xl text-text-secondary">No jobs found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div
                    key={job._id}
                    className="bg-surface rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition border border-transparent hover:border-primary"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-primary">{job.title}</h3>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{job.company?.companyName || 'Company'}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-text-secondary">
                        <FaMapMarkerAlt className="mr-2 text-primary" /> {job.location}
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <FaMoneyBillWave className="mr-2 text-primary" /> ${job.salary?.min || 0} - ${job.salary?.max || 0}
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <FaBriefcase className="mr-2 text-primary" /> {job.category}
                      </div>
                    </div>

                    <p className="text-text-secondary mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 5).map(skill => (
                        <span key={skill} className="bg-dark-bg text-text-secondary px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;
