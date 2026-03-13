import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // OTP flow: backend returns only a message when OTP sent
      if (response.data.message && !response.data.token) {
        setOtpSent(true);
      } else {
        // legacy/token case
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        navigate(user.role === 'employer' ? '/employer-dashboard' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="bg-surface rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">Register</h2>

        {error && <div className="bg-red-900/50 text-red-300 p-4 rounded mb-4">{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Full Name</label>
              <div className="flex items-center bg-dark-bg border border-border-color rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary">
                <FaUser className="text-text-secondary mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="bg-transparent text-text-primary flex-1 border-none focus:ring-0 placeholder-text-secondary"
                />
              </div>
            </div>

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

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Confirm Password</label>
              <div className="flex items-center bg-dark-bg border border-border-color rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-primary">
                <FaLock className="text-text-secondary mr-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="bg-transparent text-text-primary flex-1 border-none focus:ring-0 placeholder-text-secondary"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-text-primary font-semibold mb-2">Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
              >
                <option value="candidate">Job Candidate</option>
                <option value="employer">Employer/Recruiter</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
              const { data } = await authAPI.verifyOtp({ email: formData.email, otp: otpCode });
              const { token } = data;
              localStorage.setItem('token', token);
              localStorage.setItem('userId', data.user?.id);
              localStorage.setItem('userRole', data.user?.role);
              navigate(data.user?.role === 'employer' ? '/employer-dashboard' : '/dashboard');
            } catch (err) {
              setError(err.response?.data?.message || 'Verification failed');
            } finally {
              setLoading(false);
            }
          }}>
            <div className="mb-4">
              <label className="block text-text-primary font-semibold mb-2">Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full bg-dark-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
        )}

        <p className="text-center text-text-secondary">
          Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
