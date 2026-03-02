import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileComplaintForm from '../../components/complaint/FileComplaintForm';
import { fileComplaint } from '../../api/complaintsapi';
import { useAuth } from '../../context/AuthContext';

const FileComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (formData) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fileComplaint(formData);
      console.log('Complaint filed:', response);
      setSuccess(true);
      
      // 2 seconds mein dashboard par redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-[#8C52FF] hover:underline flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl text-center font-medium">
            ✅ Complaint submitted successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-center">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <FileComplaintForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default FileComplaint;