import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-bg p-6 rounded-lg border border-border-color">
              <h2 className="text-xl font-bold text-primary">Profile Completion</h2>
              <p className="text-text-secondary mt-2">Complete your profile to get better job matches</p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4 w-full"
              >
                Complete Profile
              </button>
            </div>

            <div className="bg-green-900/30 p-6 rounded-lg border border-green-700">
              <h2 className="text-xl font-bold text-green-300">Applications</h2>
              <p className="text-text-secondary mt-2">Track your job applications</p>
              <button
                onClick={() => navigate('/my-applications')}
                className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4 w-full"
              >
                View Applications
              </button>
            </div>

            <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700">
              <h2 className="text-xl font-bold text-purple-300">Recommendations</h2>
              <p className="text-text-secondary mt-2">Get AI-powered job recommendations</p>
              <button
                onClick={() => navigate('/recommendations')}
                className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-4 w-full"
              >
                View Recommendations
              </button>
            </div>
          </div>

          <div className="bg-dark-bg p-6 rounded-lg border border-border-color">
            <h2 className="text-xl font-bold mb-4">Your Profile Information</h2>
            <div className="space-y-3">
              <p><span className="font-semibold text-text-secondary">Email:</span> {user?.email}</p>
              <p><span className="font-semibold text-text-secondary">Experience:</span> {user?.experience || 0} years</p>
              <p><span className="font-semibold text-text-secondary">Location:</span> {user?.location || 'Not specified'}</p>
              <p><span className="font-semibold text-text-secondary">Skills:</span> {user?.skills?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
