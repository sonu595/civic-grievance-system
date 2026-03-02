// pages/solver/TaskDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTaskDetails, startWork, completeComplaint } from '../../api/solverapi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast';
import { motion } from 'framer-motion';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    loadTaskDetails();
  }, [id]);

  // Live timer
  useEffect(() => {
    if (!task?.resolutionDeadline) return;
    
    const updateTimer = () => {
      const deadline = new Date(task.resolutionDeadline);
      const now = new Date();
      const diffMs = deadline - now;
      
      if (diffMs <= 0) {
        setTimeLeft('OVERDUE');
        return;
      }
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      
      if (diffMins > 0) {
        setTimeLeft(`${diffMins}m ${diffSecs}s`);
      } else {
        setTimeLeft(`${diffSecs}s`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [task?.resolutionDeadline]);

  const loadTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await getTaskDetails(id);
      if (response.success) {
        setTask(response.complaint);
      } else {
        showToast(response.message || 'Failed to load task', 'error');
      }
    } catch (err) {
      console.error('Load task error:', err);
      showToast(err.message || 'Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async () => {
    setActionLoading(true);
    try {
      const response = await startWork(id);
      if (response.success) {
        showToast('✅ Work started successfully!', 'success');
        loadTaskDetails();
      } else {
        showToast(response.message || 'Failed to start work', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to start work', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo size should be less than 5MB', 'warning');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'warning');
        return;
      }
      
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (!photo) {
      showToast('Please upload completion photo', 'warning');
      return;
    }

    setActionLoading(true);
    
    const formData = new FormData();
    formData.append('completionPhoto', photo);
    if (comment.trim()) {
      formData.append('comment', comment);
    }

    try {
      const response = await completeComplaint(id, formData);
      if (response.success) {
        showToast('🎉 Work completed successfully!', 'success');
        setTimeout(() => {
          navigate('/solver/dashboard');
        }, 2000);
      } else {
        showToast(response.message || 'Failed to complete work', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete work', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-6 px-4">
      <div className="max-w-5xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-[#8C52FF] hover:underline flex items-center gap-2"
        >
          ← Back to Tasks
        </button>

        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[30px] shadow-xl overflow-hidden border border-[#8C52FF]"
        >
          <div className="bg-[#8C52FF] text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{task?.title}</h1>
                  {task?.priority === 'CRITICAL' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      🚨 CRITICAL
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-90 mt-1">Task ID: #{task?.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Live Timer */}
                {task?.resolutionDeadline && (
                  <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                    timeLeft === 'OVERDUE' 
                      ? 'bg-red-100 text-red-700 animate-pulse' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    ⏰ {timeLeft}
                  </div>
                )}
                <StatusBadge status={task?.status} />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN */}
              <div>
                {task?.image ? (
                  <img
                    src={`data:image/jpeg;base64,${task.image}`}
                    alt="Complaint"
                    className="w-full rounded-2xl border-2 border-gray-200 shadow-md object-cover h-64 md:h-80"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📷</div>
                      <p>No Image Available</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="bg-[#FFF4D9] p-4 rounded-xl">
                    <p className="text-sm text-gray-600">📍 Location</p>
                    <p className="font-medium">{task?.location || 'N/A'}</p>
                  </div>

                  <div className="bg-[#FFF4D9] p-4 rounded-xl">
                    <p className="text-sm text-gray-600">🏢 Department</p>
                    <p className="font-medium">{task?.department}</p>
                  </div>

                  {task?.userName && (
                    <div className="bg-[#FFF4D9] p-4 rounded-xl">
                      <p className="text-sm text-gray-600">👤 Reported By</p>
                      <p className="font-medium">{task.userName}</p>
                    </div>
                  )}

                  <div className="bg-[#FFF4D9] p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">⏰ Timeline</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Assigned:</span> {formatDate(task?.assignedAt)}</p>
                      <p><span className="text-gray-500">Deadline:</span> {formatDate(task?.resolutionDeadline)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <div className="bg-[#FFF1D1] p-5 rounded-2xl mb-6">
                  <h3 className="font-bold text-[#8C52FF] mb-2 text-lg">📝 Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {task?.description || 'No description provided'}
                  </p>
                </div>

                {task?.status === 'assigned' && (
                  <Button
                    onClick={handleStartWork}
                    disabled={actionLoading}
                    size="large"
                    className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
                  >
                    {actionLoading ? 'Starting...' : '🚀 Start Work'}
                  </Button>
                )}

                {task?.status === 'in-progress' && !showCompleteForm && (
                  <Button
                    onClick={() => setShowCompleteForm(true)}
                    size="large"
                    className="w-full mb-4 bg-green-600 hover:bg-green-700"
                  >
                    ✅ Complete Work
                  </Button>
                )}

                {task?.status === 'completed' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <p className="text-green-700 font-bold text-xl mb-2">Work Completed!</p>
                    {task.completionComment && (
                      <div className="mt-3 p-3 bg-white rounded-xl">
                        <p className="text-sm text-gray-600">Work Summary:</p>
                        <p className="text-gray-800 mt-1">{task.completionComment}</p>
                      </div>
                    )}
                  </div>
                )}

                {showCompleteForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-2 border-[#8C52FF] rounded-2xl p-5 mt-4"
                  >
                    <h3 className="font-bold text-[#8C52FF] mb-4">Complete Work</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Summary (Optional)
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Describe what you did, materials used, etc..."
                          className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#8C52FF] outline-none"
                          rows="4"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completion Photo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="w-full p-2 border border-gray-300 rounded-xl"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Max size: 5MB. Format: JPG, PNG
                        </p>
                        
                        {photoPreview && (
                          <div className="mt-3 relative">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border"
                            />
                            <button
                              onClick={() => {
                                setPhoto(null);
                                setPhotoPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleComplete}
                          disabled={actionLoading || !photo}
                          className="flex-1"
                        >
                          {actionLoading ? 'Submitting...' : 'Submit Work'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowCompleteForm(false);
                            setComment('');
                            setPhoto(null);
                            setPhotoPreview(null);
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskDetails;