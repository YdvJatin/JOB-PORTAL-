import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import PostJobPage from './pages/PostJobPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-bg text-text-primary">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/employer-dashboard" element={<EmployerDashboardPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
