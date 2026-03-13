import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, recommendationAPI } from '../services/api';
import { FaMapMarkerAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchRecommendations();
    }
  }, [navigate]);

  const fetchRecommendations = async () => {
    try {
      const response = await recommendationAPI.getJobRecommendations();
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center">
            <FaChartLine className="mr-3 text-primary" />
            Personalized Job Recommendations
          </h1>
          <p className="text-text-secondary">Based on your skills and profile, here are the best matches for you</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-text-secondary">No recommendations available. Update your profile to get better matches!</p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4"
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((job, index) => (
              <div
                key={job._id}
                className="bg-surface rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition border border-transparent hover:border-primary"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                    <p className="text-text-secondary">{job.company?.companyName}</p>
                  </div>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-text-secondary">Match Score</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${job.matchScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-text-secondary">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary" /> {job.location}
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-primary" /> ${job.salary?.min || 0} - ${job.salary?.max || 0}
                  </div>
                </div>

                <p className="text-text-secondary mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requiredSkills.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-dark-bg text-text-secondary px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job._id}`);
                  }}
                  className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  View & Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
