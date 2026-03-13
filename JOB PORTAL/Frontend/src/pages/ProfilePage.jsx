import React, { useState, useEffect, useMemo } from 'react';
import { authAPI } from '../services/api';
// You might need to install react-hot-toast: npm install react-hot-toast
import { toast } from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for file uploads
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getMe();
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePicFile) {
      toast.error('Please select a picture to upload.');
      return;
    }
    setIsUploadingPic(true);
    const formData = new FormData();
    formData.append('profilePicture', profilePicFile);

    try {
      const res = await authAPI.uploadProfilePicture(formData);
      setUser((prev) => ({ ...prev, profilePicture: res.data.user.profilePicture }));
      toast.success('Profile picture updated!');
      setProfilePicFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Profile picture upload failed', error);
      toast.error(error.response?.data?.message || 'Upload failed.');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a resume file to upload.');
      return;
    }
    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await authAPI.uploadResume(formData);
      setUser((prev) => ({ ...prev, resume: res.data.user.resume }));
      toast.success('Resume updated!');
      setResumeFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Resume upload failed', error);
      toast.error(error.response?.data?.message || 'Upload failed.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const profilePicUrl = useMemo(() => {
    if (user?.profilePicture) {
      return `${BASE_URL}/${user.profilePicture}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`;
  }, [user]);

  const resumeUrl = user?.resume ? `${BASE_URL}/${user.resume}` : null;

  if (loading) {
    return <div className="text-center p-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-10 text-red-500">Could not load user profile.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={profilePicUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize mt-2 bg-gray-100 inline-block px-3 py-1 rounded-full">{user.role}</p>

            <form onSubmit={handleProfilePicUpload} className="mt-6">
              <label htmlFor="profile-pic-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Update Profile Picture
              </label>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {profilePicFile && (
                <button
                  type="submit"
                  disabled={isUploadingPic}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                  {isUploadingPic ? 'Uploading...' : 'Upload Picture'}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Profile Details & Resume Section */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Profile Details</h3>
            <p className="mb-2"><span className="font-semibold text-gray-700">Bio:</span> {user.bio || 'Not set'}</p>
            <p><span className="font-semibold text-gray-700">Location:</span> {user.location || 'Not set'}</p>

            {user.role === 'candidate' && (
              <>
                <hr className="my-6" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Resume</h3>
                {resumeUrl ? (
                  <div className="mb-4">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      View Current Resume
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4">No resume uploaded yet.</p>
                )}

                <form onSubmit={handleResumeUpload} className="mt-4">
                  <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Resume (.pdf, .doc, .docx)
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {resumeFile && (
                    <button
                      type="submit"
                      disabled={isUploadingResume}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                      {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </button>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;