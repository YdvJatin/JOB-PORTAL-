import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaBriefcase } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg border-b-4 border-yellow-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-white">
            <FaBriefcase className="mr-2" />
            ProNexus
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/jobs" className="text-gray-300 hover:text-white transition">
              Browse Jobs
            </Link>
            {isAuthenticated && userRole === 'candidate' && (
              <>
                <Link to="/recommendations" className="text-gray-300 hover:text-white transition">
                  AI Recommendations
                </Link>
                <Link to="/my-applications" className="text-gray-300 hover:text-white transition">
                  My Applications
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'employer' && (
              <>
                <Link to="/post-job" className="text-gray-300 hover:text-white transition">
                  Post Job
                </Link>
                <Link to="/employer-dashboard" className="text-gray-300 hover:text-white transition">
                  Dashboard
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="bg-surface border border-border-color hover:bg-dark-bg text-text-primary font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-text-primary hover:text-primary transition">
                  Profile
                </Link>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-text-primary"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/jobs" className="block py-2 text-text-primary hover:text-primary">
              Browse Jobs
            </Link>
            {isAuthenticated && userRole === 'candidate' && (
              <>
                <Link to="/recommendations" className="block py-2 text-text-primary hover:text-primary">
                  AI Recommendations
                </Link>
                <Link to="/my-applications" className="block py-2 text-text-primary hover:text-primary">
                  My Applications
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'employer' && (
              <>
                <Link to="/post-job" className="block py-2 text-text-primary hover:text-primary">
                  Post Job
                </Link>
                <Link to="/employer-dashboard" className="block py-2 text-text-primary hover:text-primary">
                  Dashboard
                </Link>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block mt-2 py-2 bg-primary hover:bg-primary-focus text-white font-semibold rounded-md transition-colors duration-300 w-full text-center">
                  Login
                </Link>
                <Link to="/register" className="block mt-2 py-2 bg-surface border border-border-color hover:bg-dark-bg text-text-primary font-semibold rounded-md transition-colors duration-300 w-full text-center">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block py-2 text-text-primary hover:text-primary">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full mt-2 text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
