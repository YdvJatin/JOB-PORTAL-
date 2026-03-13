import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { FaPlus, FaBriefcase, FaUsers } from 'react-icons/fa';

const EmployerDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'employer') {
      navigate('/login');
    } else {
      fetchJobs();
    }
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll({ limit: 100 });
      setJobs(response.data.jobs);
      if (response.data.jobs.length > 0) {
        setSelectedJob(response.data.jobs[0]);
        fetchApplications(response.data.jobs[0]._id);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await applicationAPI.getJobApplications(jobId);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    fetchApplications(job._id);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Employer Dashboard</h1>
          <button
            onClick={() => navigate('/post-job')}
            className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Jobs</p>
                <h3 className="text-3xl font-bold text-primary">{jobs.length}</h3>
              </div>
              <FaBriefcase className="text-4xl text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Applications</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0)}
                </h3>
              </div>
              <FaUsers className="text-4xl text-green-400 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Jobs List */}
          <div className="bg-surface rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Jobs</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {jobs.length === 0 ? (
                <p className="text-text-secondary">No jobs posted yet</p>
              ) : (
                jobs.map(job => (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJob(job)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedJob?._id === job._id
                        ? 'bg-dark-bg border-l-4 border-primary'
                        : 'bg-surface hover:bg-dark-bg'
                    }`}
                  >
                    <h3 className="font-semibold text-sm text-text-primary">{job.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{job.applicantCount || 0} applications</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Applications */}
          <div className="md:col-span-3 bg-surface rounded-lg shadow-lg p-6">
            {selectedJob ? (
              <>
                <div className="mb-6 pb-6 border-b border-border-color">
                  <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/jobs/${selectedJob._id}`)}
                      className="bg-dark-bg border border-border-color hover:bg-border-color text-text-primary font-semibold py-1 px-3 rounded-md transition-colors duration-300 text-sm"
                    >
                      View Job
                    </button>
                    <button
                      onClick={() => handleDeleteJob(selectedJob._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-300 text-sm"
                    >
                      Delete Job
                    </button>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <p className="text-text-secondary">No applications yet</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {applications.map(application => (
                      <div key={application._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold">{application.candidate?.name}</h3>
                            <p className="text-sm text-text-secondary">{application.candidate?.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            application.status === 'accepted' ? 'bg-green-900/50 text-green-300' :
                            application.status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                            application.status === 'shortlisted' ? 'bg-border-color text-text-secondary' :
                            application.status === 'under-review' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-dark-bg text-text-secondary'
                          }`}>
                            {application.status}
                          </span>
                        </div>

                        {application.matchScore && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-text-secondary">Match Score</span>
                              <span className="font-bold">{application.matchScore}%</span>
                            </div>
                            <div className="w-full bg-dark-bg rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${application.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                            className="text-sm bg-dark-bg border border-border-color rounded px-2 py-1 text-text-primary"
                          >
                            <option value="applied">Applied</option>
                            <option value="under-review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="accepted">Accepted</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-secondary">Post a job to see applications</p>
                <button
                  onClick={() => navigate('/post-job')}
                  className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4"
                >
                  Post Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
