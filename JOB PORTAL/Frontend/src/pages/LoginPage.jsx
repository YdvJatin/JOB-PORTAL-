import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
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

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);

      navigate(user.role === 'employer' ? '/employer-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="bg-surface rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login</h2>

        {error && <div className="bg-red-900/50 text-red-300 p-4 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-primary font-semibold mb-2">Email</label>
            <div className="flex items-center bg-dark-bg border border-border-color rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary">
              <FaEnvelope className="text-text-secondary mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="bg-transparent text-text-primary flex-1 border-none focus:ring-0 placeholder-text-secondary"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-text-primary font-semibold mb-2">Password</label>
            <div className="flex items-center bg-dark-bg border border-border-color rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary">
              <FaLock className="text-text-secondary mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="bg-transparent text-text-primary flex-1 border-none focus:ring-0 placeholder-text-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-text-secondary">
          Don't have an account? <a href="/register" className="text-primary font-bold hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
