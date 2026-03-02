// components/complaint/ComplaintCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import { getComplaintById } from '../../api/complaintsapi';

const ComplaintCard = ({ data, onClick, showPublicInfo = false, isMyComplaint = false }) => {
  const [currentMedia, setCurrentMedia] = useState('image');
  const [timeLeft, setTimeLeft] = useState('');
  const [complaintData, setComplaintData] = useState(data);
  const mediaContainerRef = useRef(null);

  const formatId = (id) => {
    if (!id) return 'JAI-CENT';
    const idString = String(id);
    return idString.slice(0, 8);
  };

  // ✅ Auto-refresh only for active complaints
  useEffect(() => {
    if (!data?.id) return;
    
    // 🔴 FIXED: Sirf active complaints refresh karo
    const activeStatuses = ['pending', 'assigned', 'in-progress'];
    if (!activeStatuses.includes(data.status)) {
      return;
    }

    const fetchUpdatedComplaint = async () => {
      try {
        const response = await getComplaintById(data.id);
        if (response.success && response.complaint) {
          console.log('🔄 Complaint updated:', {
            department: response.complaint.department,
            level: response.complaint.escalationLevel,
            status: response.complaint.status
          });
          
          setComplaintData(response.complaint);
        }
      } catch (error) {
        console.error('Error fetching complaint:', error);
      }
    };

    fetchUpdatedComplaint();
    const interval = setInterval(fetchUpdatedComplaint, 10000);

    return () => clearInterval(interval);
  }, [data.id, data.status]);

  // ⏰ LIVE TIMER - Only for active complaints
  useEffect(() => {
    if (!complaintData.resolutionDeadline) return;
    
    // 🔴 FIXED: Sirf active statuses par timer chalao
    const activeStatuses = ['pending', 'assigned', 'in-progress'];
    
    // Agar status active nahi hai to timer band karo
    if (!activeStatuses.includes(complaintData.status)) {
      setTimeLeft(''); // Timer clear karo
      return;
    }
    
    const updateTimer = () => {
      const deadlineStr = complaintData.resolutionDeadline;
      const deadline = new Date(deadlineStr);
      const now = new Date();
      
      if (isNaN(deadline.getTime())) {
        setTimeLeft('Invalid date');
        return;
      }
      
      const diffMs = deadline - now;
      
      if (diffMs <= 0) {
        setTimeLeft('OVERDUE');
        return;
      }
      
      const totalSeconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [complaintData.resolutionDeadline, complaintData.status]);

  // ✅ Get department display with icon based on status
  const getDepartmentDisplay = () => {
    if (!complaintData.department) return 'Department';
    
    // Show approved status
    if (complaintData.status === 'approved') {
      return `${complaintData.department}`;
    }
    
    if (complaintData.isEscalated) {
      if (complaintData.escalationLevel === 4) {
        return `${complaintData.department}`;
      }
      return `${complaintData.department}`;
    }
    
    return `${complaintData.department}`;
  };

  const getFallbackImage = () => {
    const id = complaintData.id || Math.floor(Math.random() * 1000);
    return `https://t3.ftcdn.net/jpg/10/22/24/80/360_F_1022248039_7LDxHRi3Mlt9BK3wzLBUGZp9XAO1gt2s.jpg`;
  };

  const hasVideo = complaintData.video && complaintData.video.length > 10;

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

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-[#DDCCFF] rounded-[20px] sm:rounded-[30px] md:rounded-[40px] p-1 shadow-md hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white rounded-[18px] sm:rounded-[28px] md:rounded-[35px] overflow-hidden border border-[#8C52FF]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border-b border-[#8C52FF] gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 tracking-tight">
              #{formatId(complaintData.id)}
            </h2>
            
            {isMyComplaint && (
              <span className="text-xs sm:text-sm bg-blue-500 text-white px-3 sm:px-4 py-1 rounded-full font-medium">
                My Complaint
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* 🔴 FIXED: Live Timer - Sirf active complaints ke liye */}
            {complaintData.resolutionDeadline && 
             ['pending', 'assigned', 'in-progress'].includes(complaintData.status) && (
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                timeLeft === 'OVERDUE' 
                  ? 'bg-red-100 text-red-700 animate-pulse' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {timeLeft}
              </div>
            )}
            <StatusBadge status={complaintData.status || 'Pending'} />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
          
          {/* Left: Media Section */}
          <div className="w-full lg:w-[45%] relative">
            <div 
              ref={mediaContainerRef}
              className="flex overflow-x-hidden scroll-smooth rounded-2xl sm:rounded-3xl md:rounded-4xl border-2 border-gray-300 shadow-md bg-gray-100 relative"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Image Slide */}
              <div className="shrink-0 w-full">
                {complaintData.image ? (
                  <img
                    src={`data:image/jpeg;base64,${complaintData.image}`}
                    alt="Complaint"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                    onError={(e) => { e.target.src = getFallbackImage(); }}
                  />
                ) : (
                  <img
                    src={getFallbackImage()}
                    alt="Complaint"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                  />
                )}
              </div>

              {/* Video Slide */}
              {hasVideo && (
                <div className="shrink-0 w-full">
                  <video
                    src={`data:video/mp4;base64,${complaintData.video}`}
                    controls
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-contain bg-black"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {hasVideo && complaintData.image && (
              <>
                {currentMedia === 'image' && (
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-1 shadow-lg z-10 border border-gray-200"
                  >
                    <NextArrowIcon />
                  </button>
                )}
                {currentMedia === 'video' && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 rounded-full p-1 shadow-lg z-10 border border-gray-200"
                  >
                    <PrevArrowIcon />
                  </button>
                )}
              </>
            )}
            
            {/* Timestamp */}
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-800 px-1">
              {complaintData.createdAt ? new Date(complaintData.createdAt).toLocaleString('en-IN') : '12 Jan 2026 • 12:36 pm'}
            </div>

            {/* Media Counter */}
            {hasVideo && complaintData.image && (
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                {currentMedia === 'image' ? '1/2' : '2/2'}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h3 className="text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2 sm:mb-3 leading-tight">
              {complaintData.title || 'Untitled Complaint'}
            </h3>

            {/* Department Name with Icon */}
            <div className="mb-3 sm:mb-4">
              <span className="inline-block bg-[#8B7CFF] text-white px-6 sm:px-8 md:px-10 py-1.5 sm:py-2 rounded-full text-sm sm:text-base md:text-lg tracking-wide shadow-sm">
                {getDepartmentDisplay()}
              </span>
            </div>

            {/* Escalation Level Progress */}
            {complaintData.escalationLevel > 1 && (
              <div className="mb-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map(level => (
                    <div
                      key={level}
                      className={`w-6 h-2 rounded-full ${
                        level <= complaintData.escalationLevel 
                          ? level === complaintData.escalationLevel 
                            ? 'bg-orange-500 animate-pulse' 
                            : 'bg-[#8C52FF]' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Level {complaintData.escalationLevel}/4
                  {complaintData.fromDepartment && (
                    <span className="ml-2 text-orange-600">
                      (from {complaintData.fromDepartment})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Location */}
            <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-3 sm:mb-4">
              <span className="font-medium">Location:</span> {complaintData.location || 'Jaipur'}
            </p>

            {/* Description Box */}
            <div className="bg-[#D9D9D9] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 relative grow shadow-inner">
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Description:</h4>
              <p className="text-sm sm:text-base text-gray-800 leading-snug line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                {complaintData.description || 'No description provided'}
              </p>
              
              {showPublicInfo && complaintData.userCity && (
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-[#8B7CFF] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
                  {complaintData.userCity}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Icons
const NextArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.9" />
    <path d="M10 8L14 12L10 16" stroke="#8C52FF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PrevArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.9" />
    <path d="M14 8L10 12L14 16" stroke="#8C52FF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default ComplaintCard;