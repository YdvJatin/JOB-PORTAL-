import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { FaBriefcase, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchApplications();
    }
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Applications</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'applied', 'under-review', 'shortlisted', 'rejected', 'accepted'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-primary border border-border-color hover:bg-dark-bg'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-text-secondary">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(application => (
              <div
                key={application._id}
                className="bg-surface rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition border border-transparent hover:border-primary"
                onClick={() => navigate(`/jobs/${application.job._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-primary">{application.job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    application.status === 'accepted' ? 'bg-green-900/50 text-green-300' :
                    application.status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                    application.status === 'shortlisted' ? 'bg-border-color text-text-secondary' :
                    application.status === 'under-review' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-dark-bg text-text-secondary'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-text-secondary">
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2" /> {application.job.company?.name}
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> {application.job.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" /> {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                {application.matchScore && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-text-secondary">Match Score</span>
                      <span className="text-lg font-bold text-primary">{application.matchScore}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${application.matchScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {application.aiReview && (
                  <div className="bg-dark-bg p-4 rounded-lg mt-4 border border-border-color">
                    <h4 className="font-bold mb-2">AI Review</h4>
                    <p className="text-text-secondary">{application.aiReview.overallFeedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
