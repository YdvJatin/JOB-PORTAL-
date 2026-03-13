import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, recommendationAPI } from '../services/api';
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaCalendar, FaShareAlt } from 'react-icons/fa';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobAPI.getById(id);
      setJob(response.data);
      fetchSimilarJobs();
    } catch (error) {
      setError('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarJobs = async () => {
    try {
      const response = await recommendationAPI.getSimilarJobs(id);
      setSimilarJobs(response.data);
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await applicationAPI.apply({
        jobId: id,
        resume: 'resume_path',
        coverLetter,
      });
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="bg-surface rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
              <p className="text-xl text-text-secondary">{job.company?.companyName}</p>
            </div>
            <button className="bg-dark-bg border border-border-color hover:bg-border-color text-text-primary font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center">
              <FaShareAlt className="mr-2" /> Share
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-text-secondary">
              <FaMapMarkerAlt className="mr-2 text-primary" /> {job.location}
            </div>
            <div className="flex items-center text-text-secondary">
              <FaMoneyBillWave className="mr-2 text-primary" /> ${job.salary?.min || 0} - ${job.salary?.max || 0}
            </div>
            <div className="flex items-center text-text-secondary">
              <FaBriefcase className="mr-2 text-primary" /> {job.jobType}
            </div>
            <div className="flex items-center text-text-secondary">
              <FaCalendar className="mr-2 text-primary" /> {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="bg-dark-bg text-text-secondary px-4 py-2 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) {
                navigate('/login');
              } else {
                setShowApplyModal(true);
              }
            }}
            className="bg-primary hover:bg-primary-focus text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300 text-lg"
          >
            Apply Now
          </button>
        </div>

        {/* Job Description */}
        <div className="bg-surface rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">About the Job</h2>
          <p className="text-text-secondary mb-6">{job.description}</p>

          <h3 className="text-xl font-bold mb-3">Requirements</h3>
          <ul className="list-disc list-inside text-text-secondary mb-6">
            <li>Experience: {job.experience}+ years</li>
            <li>Education: {job.education || 'Not specified'}</li>
            <li>Skills: {job.requiredSkills.join(', ')}</li>
          </ul>

          {job.aiSummary && (
            <div className="bg-dark-bg p-4 rounded-lg border border-border-color">
              <h3 className="text-lg font-bold mb-2">AI Summary</h3>
              <p className="text-text-secondary">{job.aiSummary}</p>
            </div>
          )}
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Similar Jobs</h2>
            <div className="space-y-4">
              {similarJobs.slice(0, 3).map(similarJob => (
                <div
                  key={similarJob._id}
                  className="border border-border-color rounded-lg p-4 cursor-pointer hover:bg-dark-bg"
                  onClick={() => navigate(`/jobs/${similarJob._id}`)}
                >
                  <h3 className="font-bold text-lg">{similarJob.title}</h3>
                  <p className="text-text-secondary">{similarJob.company?.companyName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>

            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded mb-4">{error}</div>}

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter..."
              className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary placeholder-text-secondary mb-4 h-40"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 bg-dark-bg border border-border-color hover:bg-border-color text-text-primary font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
