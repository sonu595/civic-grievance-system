// pages/citizen/ComplaintDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById } from '../../api/complaintsapi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMedia, setCurrentMedia] = useState('image');
  const [imageError, setImageError] = useState(false);
  const mediaContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Check login
    if (!isAuthenticated) {
      setError('Please login to view complaint details');
      setLoading(false);
      return;
    }

    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaintById(id);
        
        console.log('Full complaint data:', data);
        
        if (data.success === false) {
          setError(data.message || 'Failed to load complaint');
          setLoading(false);
          return;
        }
        
        setComplaint(data);
        
        const userRole = user?.role;
        const isOwnComplaint = data.userId === user?.id || data.userAadhaar === user?.aadhaar;
        
        console.log('🔍 Role Check:', { userRole, isOwnComplaint });
        
        // ✅ SOLVER - Can view ANY complaint
        if (userRole === 'solver') {
          console.log('✅ Solver access granted');
          setImageError(false);
          setLoading(false);
          return;
        }
        
        // ✅ DEPARTMENT - Can view ANY complaint
        if (userRole === 'department') {
          console.log('✅ Department access granted');
          setImageError(false);
          setLoading(false);
          return;
        }
        
        // ✅ CITIZEN - Can only view own complaints
        if (userRole === 'citizen') {
          if (!isOwnComplaint) {
            setError('You can only view your own complaints');
            setLoading(false);
            return;
          }
          console.log('✅ Citizen viewing own complaint');
          setImageError(false);
          setLoading(false);
          return;
        }
        
        // Fallback - deny access
        setError('You are not authorized to view this complaint');
        setLoading(false);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load complaint details');
        setLoading(false);
      }
    };

    if (id) fetchComplaint();
  }, [id, user, isAuthenticated]);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateStr;
    }
  };

  // Format time
  const formatTime = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return null;
    }
  };

  // Get image source
  const getImageSource = () => {
    if (!complaint?.image) return null;
    
    if (complaint.image.startsWith('data:image')) {
      return complaint.image;
    }
    
    if (complaint.image.startsWith('http')) {
      return complaint.image;
    }
    
    return `data:image/jpeg;base64,${complaint.image}`;
  };

  // Fallback image
  const getFallbackImage = () => {
    return `https://t3.ftcdn.net/jpg/10/22/24/80/360_F_1022248039_7LDxHRi3Mlt9BK3wzLBUGZp9XAO1gt2s.jpg`;
  };

  // Handle image error
  const handleImageError = (e) => {
    console.error('🚨 Image load failed');
    setImageError(true);
    e.target.src = getFallbackImage();
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageError(false);
  };

  // Check if video exists
  const hasVideo = complaint?.video && complaint.video.length > 10;

  // Handle next media
  const handleNext = (e) => {
    e.stopPropagation();
    if (hasVideo && currentMedia === 'image') {
      setCurrentMedia('video');
      if (mediaContainerRef.current) {
        mediaContainerRef.current.scrollTo({
          left: mediaContainerRef.current.offsetWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handle previous media
  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentMedia === 'video') {
      setCurrentMedia('image');
      if (mediaContainerRef.current) {
        mediaContainerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  // SVG Icons
  const NextArrowIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.9" />
      <path d="M10 8L14 12L10 16" stroke="#8C52FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PrevArrowIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.9" />
      <path d="M14 8L10 12L14 16" stroke="#8C52FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  // Show error state
  if (error) {
    // Unauthorized access screen
    if (error?.includes('login') || error?.includes('own') || error?.includes('authorized')) {
      return (
        <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl border-2 border-[#8C52FF]"
          >
            <div className="text-7xl mb-4 animate-bounce">🔒</div>
            <h2 className="text-3xl font-black text-[#8C52FF] mb-3">
              {!isAuthenticated ? 'Login Required' : 'Access Denied'}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">{error}</p>
            <div className="bg-[#FFF4D9] p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-[#8C52FF]">Note:</span>
                {!isAuthenticated ? ' Please login to continue.' :
                 user?.role === 'citizen' ? ' You can only view complaints that you have filed yourself.' :
                 ' You should have access. Please contact admin.'}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition"
                >
                  Go to Login
                </button>
              ) : user?.role === 'citizen' ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition"
                >
                  View My Complaints
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition"
                >
                  Go to Home
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Go to Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
    
    // Generic error
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show not found
  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600 text-xl mb-4">Complaint not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#8C52FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show complaint details
  return (
    <div className="min-h-screen bg-[#FDEBD0] py-4 sm:py-6 md:py-10 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 text-[#8C52FF] font-medium hover:underline flex items-center gap-2 text-sm sm:text-base"
        >
          <span className="text-xl">←</span> Back
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] md:rounded-[40px] p-1 shadow-xl"
        >
          <div className="bg-white rounded-[18px] sm:rounded-[28px] md:rounded-[35px] overflow-hidden border border-orange-200">
            
            {/* Header */}
            <div className="bg-[#8C52FF] text-white p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold wrap-break-word pr-2">
                    {complaint.title || 'Untitled Complaint'}
                  </h1>
                  <p className="text-xs sm:text-sm opacity-90 mt-1 break-all">
                    ID: {complaint.id || 'N/A'}
                  </p>
                </div>
                <div className="self-end sm:self-auto">
                  <StatusBadge status={complaint.status || 'Pending'} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                
                {/* Left: Media Section */}
                <div className="w-full lg:w-1/2 relative">
                  <div 
                    ref={mediaContainerRef}
                    className="flex overflow-x-hidden scroll-smooth rounded-2xl sm:rounded-3xl border-2 border-gray-300 shadow-md bg-gray-100 relative"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {/* Image Slide */}
                    <div className="shrink-0 w-full">
                      {complaint.image ? (
                        <img
                          src={getImageSource()}
                          alt={complaint.title}
                          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                        />
                      ) : (
                        <img
                          src={getFallbackImage()}
                          alt={complaint.title}
                          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                        />
                      )}
                      
                      {imageError && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                          ⚠️ Fallback Image
                        </div>
                      )}
                    </div>

                    {/* Video Slide */}
                    {hasVideo && (
                      <div className="shrink-0 w-full">
                        <video
                          src={`data:video/mp4;base64,${complaint.video}`}
                          controls
                          className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-contain bg-black"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {hasVideo && complaint.image && (
                    <>
                      {currentMedia === 'image' && (
                        <button
                          onClick={handleNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg z-10 border border-gray-200"
                        >
                          <NextArrowIcon />
                        </button>
                      )}

                      {currentMedia === 'video' && (
                        <button
                          onClick={handlePrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg z-10 border border-gray-200"
                        >
                          <PrevArrowIcon />
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Timestamp */}
                  {complaint.createdAt && (
                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 font-medium px-1">
                      <span className="block sm:inline">{formatDate(complaint.createdAt)}</span>
                      {formatTime(complaint.createdAt) && (
                        <>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="block sm:inline">{formatTime(complaint.createdAt)}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Current Media Badge */}
                  {hasVideo && complaint.image && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentMedia === 'image' ? '1/2' : '2/2'}
                    </div>
                  )}
                </div>

                {/* Right: Details Section */}
                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                  
                  {/* Department */}
                  {(complaint.category || complaint.department) && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-black mb-1 sm:mb-2">
                        Department
                      </h3>
                      <span className="inline-block bg-[#8C52FF] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        {complaint.category || complaint.department}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {complaint.location && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-black mb-1 sm:mb-2">
                        Location
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 wrap-break-word">
                        {complaint.location}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  {complaint.address && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#5C4016] mb-1 sm:mb-2">
                        Address
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 wrap-break-word">
                        {complaint.address}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  {complaint.description && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#5C4016] mb-1 sm:mb-2">
                        Description : 
                      </h3>
                      <div className="bg-[#FFF1D1] p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed wrap-break-word">
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* User Info */}
                  {complaint.userName && (
                    <div className="pt-2">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Filed by: <span className="font-medium text-gray-700">{complaint.userName}</span>
                        {complaint.userCity && `, ${complaint.userCity}`}
                      </p>
                      {user && (user.id === complaint.userId || user.aadhaar === complaint.userAadhaar) && (
                        <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          ✓ This is your complaint
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status History Section */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-[#8C52FF] mb-4 sm:mb-6">
                  Status History
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Complaint Registered */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm sm:text-base shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Complaint Registered</p>
                      {complaint.createdAt && (
                        <p className="text-xs sm:text-sm text-gray-600 wrap-break-word">
                          {formatDate(complaint.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      complaint.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      complaint.status === 'assigned' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {complaint.status === 'resolved' ? '✓' :
                       complaint.status === 'in-progress' ? '→' :
                       complaint.status === 'rejected' ? '✕' :
                       complaint.status === 'assigned' ? '👤' : '⏳'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base capitalize">
                        {complaint.status || 'Pending'}
                      </p>
                      {complaint.resolvedAt && complaint.status === 'resolved' && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formatDate(complaint.resolvedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:flex-1 bg-[#8C52FF] text-white py-3 rounded-xl font-bold hover:bg-[#6a3cbe] transition text-sm sm:text-base"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintDetail;