import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ComplaintCard from '../../components/complaint/ComplaintCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getAllComplaints } from '../../api/complaintsapi';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user,  isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = (id) => {
    navigate(`/complaint/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF]">
      {/* Hero Section - Fully Responsive */}
      <div className="bg-[#8C52FF] text-white px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-64 h-64 border-4 border-white/10 rounded-full -top-20 -right-20"></div>
          <div className="absolute w-48 h-48 border-4 border-white/10 rounded-full -bottom-16 -left-16"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-3 sm:mb-4 px-2"
          >
            Civic Grievance Portal
          </motion.h1>
                    
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              text-sm 
              sm:text-base 
              md:text-xl 
              lg:text-2xl 
              xl:text-3xl
              mb-4 sm:mb-6 md:mb-8
              text-[#8C52FF]
              px-4 sm:px-6 md:px-8
              py-2 sm:py-3
              w-fit
              max-w-[90%] 
              sm:max-w-[70%] 
              md:max-w-[50%] 
              lg:max-w-[40%]
              mx-auto
              bg-white/70
              rounded-full
              font-medium
              text-center
              wrap-break-word
            "
          >
            Your Voice, Our Action
          </motion.p>

          
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {!isAuthenticated ? (
            // 🔴 NOT LOGGED IN - Login button dikhao
            <Button 
              variant="" 
              onClick={() => navigate('/login')}
              className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-4xl"
            >
              Login to File Complaint
            </Button>
          ) : (
            // 🔴 LOGGED IN - Sirf CITIZEN ko button dikhao
            user?.role === 'citizen' && (
              <Button 
                variant="" 
                onClick={() => navigate('/file-complaint')}
                className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-4xl"
              >
                + File New Complaint
              </Button>
            )
            // 🔴 SOLVER aur DEPARTMENT ke liye KUCH NAHI DIKHEGA
          )}
        </motion.div>
        </div>
      </div>

      {/* Complaints Section - Fully Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Header with Count */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8C52FF] text-center sm:text-left">
            Recent Complaints
          </h2>
          
          <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-[#8C52FF]">
              {complaints.length} {complaints.length === 1 ? 'Complaint' : 'Complaints'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 sm:py-16 md:py-20 flex justify-center">
            <Loader size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12 bg-white/80 backdrop-blur-sm rounded-[30px] sm:rounded-[40px] shadow-xl p-4 sm:p-8"
          >
            <div className="bg-red-50 rounded-[25px] sm:rounded-[35px] p-6 sm:p-12">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 font-medium">{error}</p>
              <Button 
                variant="primary" 
                onClick={fetchAllComplaints}
                className="text-sm sm:text-base"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && complaints.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 md:py-16 bg-white/80 backdrop-blur-sm rounded-[30px] sm:rounded-[40px] shadow-xl p-4 sm:p-8"
          >
            <div className="bg-[#FFF4D9] rounded-[25px] sm:rounded-[35px] p-6 sm:p-12">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-[#8C52FF] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl sm:text-2xl md:text-3xl text-[#8C52FF] font-bold mb-2">No Complaints Yet</p>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Be the first to raise your voice!</p>
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/file-complaint')}
                  className="text-sm sm:text-base"
                >
                  File a Complaint
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/login')}
                  className="text-sm sm:text-base"
                >
                  Login to File Complaint
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Complaints List */}
        {!loading && !error && complaints.length > 0 && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {complaints.map((complaint, index) => (
              <motion.div
                key={complaint.id || complaint._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ComplaintCard 
                  data={complaint} 
                  onClick={() => handleViewComplaint(complaint.id || complaint._id)}
                  showPublicInfo={true}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button - If needed */}
        {!loading && !error && complaints.length > 0 && complaints.length >= 10 && (
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Button 
              variant="outline" 
              onClick={() => {}}
              className="text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3"
            >
              Load More Complaints
            </Button>
          </div>
        )}
      </div>

      {/* Footer Stats - Optional */}
      {/* <div className="bg-[#8C52FF] mt-8 sm:mt-12 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">24/7</p>
              <p className="text-xs sm:text-sm text-[#E67E22]">Support</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">100+</p>
              <p className="text-xs sm:text-sm text-[#E67E22]">Complaints</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">95%</p>
              <p className="text-xs sm:text-sm text-[#E67E22]">Resolution</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">5min</p>
              <p className="text-xs sm:text-sm text-[#E67E22]">Response</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;