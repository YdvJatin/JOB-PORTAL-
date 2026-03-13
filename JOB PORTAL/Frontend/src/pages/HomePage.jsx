import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, jobAPI } from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const HomePage = () => {
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await jobAPI.getAll({ limit: 6 });
      setFeaturedJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchTerm}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-violet-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-8">AI-Powered Job Matching for Better Career Outcomes</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto bg-surface rounded-lg overflow-hidden shadow-lg">
            <FaSearch className="text-text-secondary mx-4" />
            <input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-4 bg-surface text-text-primary focus:outline-none placeholder-text-secondary"
            />
            <button type="submit" className="bg-primary text-white px-8 py-4 font-semibold hover:bg-primary-focus">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-dark-bg px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">{featuredJobs.length}+</h3>
            <p className="text-text-secondary">Active Job Listings</p>
          </div>
          <div className="bg-surface p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
            <p className="text-text-secondary">Companies Hiring</p>
          </div>
          <div className="bg-surface p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="text-text-secondary">Successful Placements</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 px-4 bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-text-primary">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <div key={job._id} className="bg-surface p-6 rounded-lg shadow-lg border border-border-color cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/jobs/${job._id}`)}>
                <h3 className="text-xl font-bold mb-2 text-text-primary">{job.title}</h3>
                <p className="text-text-secondary mb-3">{job.company?.companyName || 'Company'}</p>
                <div className="flex items-center text-text-secondary mb-2">
                  <FaMapMarkerAlt className="mr-2" /> {job.location}
                </div>
                <div className="flex items-center text-text-secondary mb-4">
                  <FaMoneyBillWave className="mr-2" /> ${job.salary?.min || 0} - ${job.salary?.max || 0}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requiredSkills.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-dark-bg text-text-secondary px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-dark-bg px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ProNexus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p className="text-text-secondary">Our AI algorithm matches your skills with perfect job opportunities</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
              <p className="text-text-secondary">Get personalized job recommendations based on your profile</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3">Career Growth</h3>
              <p className="text-text-secondary">Track your applications and grow your professional network</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
