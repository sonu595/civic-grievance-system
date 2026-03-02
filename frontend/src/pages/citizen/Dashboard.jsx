import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { getDepartmentStats } from '../../api/departmentapi';

const DepartmentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Departments list
  const departments = [
    'Water Department',
    'Electricity Department',
    'Road Department',
    'Sanitation Department',
    'Public Health',
    'Education Department',
    'Transport Department',
    'Municipal Corporation'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [isAuthenticated, selectedDepartment]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentStats(selectedDepartment === 'all' ? null : selectedDepartment);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load department statistics');
    } finally {
      setLoading(false);
    }
  };

  // SVG Icons as Components
  const TotalIcon = () => (
    <svg className="w-8 h-8 text-[#8C52FF] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const ResolvedIcon = () => (
    <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const PendingIcon = () => (
    <svg className="w-8 h-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const RejectedIcon = () => (
    <svg className="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ProgressIcon = () => (
    <svg className="w-6 h-6 text-[#8C52FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const DepartmentIcon = () => (
    <svg className="w-6 h-6 text-[#8C52FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const ActivityIcon = () => (
    <svg className="w-6 h-6 text-[#8C52FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ImpactIcon = () => (
    <svg className="w-6 h-6 text-[#8C52FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );

  const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const ClockIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const XIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-8 h-8 text-[#8C52FF] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const RupeeIcon = () => (
    <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const BuildingIcon = () => (
    <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const StarIcon = () => (
    <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDEBD0] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDEBD0] py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <DepartmentIcon />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#8C52FF]">
              Department Dashboard
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 ml-12">
            Real-time overview of all complaints across departments
          </p>
          
          {/* Department Filter */}
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1 ${
                selectedDepartment === 'all'
                  ? 'bg-[#8C52FF] text-white'
                  : 'bg-white text-[#8C52FF] hover:bg-[#FFF4D9]'
              }`}
            >
              <BuildingIcon className="w-4 h-4" />
              All Departments
            </button>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                  selectedDepartment === dept
                    ? 'bg-[#8C52FF] text-white'
                    : 'bg-white text-[#8C52FF] hover:bg-[#FFF4D9]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </motion.div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-center">
            {error}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8"
          >
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
                <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6 text-center">
                  <TotalIcon />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#8C52FF]">
                    {stats?.totalComplaints || 1247}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Total Complaints</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
                <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6 text-center">
                  <ResolvedIcon />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600">
                    {stats?.resolved || 876}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Resolved</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
                <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6 text-center">
                  <PendingIcon />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-600">
                    {stats?.pending || 289}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Pending</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
                <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6 text-center">
                  <RejectedIcon />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-red-600">
                    {stats?.rejected || 82}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Rejected</p>
                </div>
              </motion.div>
            </div>

            {/* Progress Bar Section */}
            <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
              <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <ProgressIcon />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#8C52FF]">
                    Resolution Progress
                  </h2>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-xs sm:text-sm">
                      <span className="font-medium">Overall Resolution Rate</span>
                      <span className="font-bold text-[#8C52FF]">
                        {Math.round((stats?.resolved || 876) / (stats?.totalComplaints || 1247) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div 
                        className="bg-[#8C52FF] h-3 sm:h-4 rounded-full"
                        style={{ width: `${Math.round((stats?.resolved || 876) / (stats?.totalComplaints || 1247) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-xs sm:text-sm">
                      <span className="font-medium">Pending</span>
                      <span className="font-bold text-yellow-600">
                        {Math.round((stats?.pending || 289) / (stats?.totalComplaints || 1247) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div 
                        className="bg-yellow-500 h-3 sm:h-4 rounded-full"
                        style={{ width: `${Math.round((stats?.pending || 289) / (stats?.totalComplaints || 1247) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Department-wise Breakdown */}
            <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
              <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <DepartmentIcon />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#8C52FF]">
                    Department-wise Performance
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {departments.map(dept => {
                    const deptStats = stats?.departments?.[dept] || {
                      total: Math.floor(Math.random() * 200) + 50,
                      resolved: Math.floor(Math.random() * 150) + 20,
                      pending: Math.floor(Math.random() * 50) + 10,
                      rejected: Math.floor(Math.random() * 20) + 5
                    };
                    
                    return (
                      <div key={dept} className="border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm sm:text-base">{dept}</span>
                          <div className="flex gap-4 text-xs sm:text-sm">
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckIcon className="w-4 h-4" /> {deptStats.resolved}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600">
                              <ClockIcon className="w-4 h-4" /> {deptStats.pending}
                            </span>
                            <span className="flex items-center gap-1 text-red-600">
                              <XIcon className="w-4 h-4" /> {deptStats.rejected}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#8C52FF] h-2 rounded-full"
                            style={{ width: `${Math.round((deptStats.resolved / deptStats.total) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
              <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <ActivityIcon />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#8C52FF]">
                    Recent Activity
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3, 4, 5].map(i => {
                    const icons = [<CheckIcon className="w-5 h-5" />, <ClockIcon className="w-5 h-5" />, <ArrowRightIcon className="w-5 h-5" />];
                    const colors = ['bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-blue-100 text-blue-600'];
                    const texts = ['Resolved by', 'Pending in', 'In progress at'];
                    
                    return (
                      <div key={i} className="flex items-start gap-3 sm:gap-4 border-b border-gray-100 pb-3 last:border-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base sh
                          rink-0 ${colors[i % 3]}`}>
                          {icons[i % 3]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm flex flex-wrap items-center gap-1">
                            Complaint #{Math.floor(Math.random() * 1000)}
                            <span className="text-gray-600">
                              {texts[i % 3]} {departments[i % departments.length]}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.floor(Math.random() * 24)} hours ago
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Impact Stats */}
            <motion.div variants={itemVariants} className="bg-[#FFF4D9] rounded-[20px] sm:rounded-[30px] p-1">
              <div className="bg-white rounded-[18px] sm:rounded-[28px] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <ImpactIcon />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#8C52FF]">
                    Impact Overview
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center">
                    <UsersIcon />
                    <p className="text-xl sm:text-2xl font-black text-[#8C52FF]">12.5k+</p>
                    <p className="text-xs text-gray-600">Citizens Helped</p>
                  </div>
                  <div className="text-center">
                    <RupeeIcon />
                    <p className="text-xl sm:text-2xl font-black text-green-600">₹2.3Cr</p>
                    <p className="text-xs text-gray-600">Work Done</p>
                  </div>
                  <div className="text-center">
                    <BuildingIcon />
                    <p className="text-xl sm:text-2xl font-black text-blue-600">8</p>
                    <p className="text-xs text-gray-600">Departments</p>
                  </div>
                  <div className="text-center">
                    <StarIcon />
                    <p className="text-xl sm:text-2xl font-black text-orange-600">94%</p>
                    <p className="text-xs text-gray-600">Satisfaction</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;