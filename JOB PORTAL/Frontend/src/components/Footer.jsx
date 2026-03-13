import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">ProNexus</h3>
            <p className="text-text-secondary">
              Where Talent Connects - AI-Powered platform for seamless recruitment and career management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="/jobs" className="hover:text-primary">Browse Jobs</a></li>
              <li><a href="/about" className="hover:text-primary">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">For Candidates</h4>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="/jobs" className="hover:text-primary">Find Jobs</a></li>
              <li><a href="/recommendations" className="hover:text-primary">Recommendations</a></li>
              <li><a href="/profile" className="hover:text-primary">My Profile</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">For Employers</h4>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="/post-job" className="hover:text-primary">Post Job</a></li>
              <li><a href="/employer-dashboard" className="hover:text-primary">Dashboard</a></li>
              <li><a href="/contact" className="hover:text-primary">Pricing</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border-color pt-8 flex justify-between items-center flex-wrap">
          <p className="text-text-secondary">© 2024 ProNexus. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-text-secondary hover:text-primary"><FaFacebook size={20} /></a>
            <a href="#" className="text-text-secondary hover:text-primary"><FaTwitter size={20} /></a>
            <a href="#" className="text-text-secondary hover:text-primary"><FaLinkedin size={20} /></a>
            <a href="#" className="text-text-secondary hover:text-primary"><FaGithub size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
