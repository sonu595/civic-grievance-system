import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const profileImg = user?.profileImage || `?name=${user?.name || 'Guest'}&background=#8C52FF&color=000`;

  const getDepartmentDashboardUrl = () => {
    if (user?.role === 'department' && user?.departmentName) {
      return `/department/${encodeURIComponent(user.departmentName)}/dashboard`;
    }
    return '#';
  };

  // Solver dashboard URL
  const getSolverDashboardUrl = () => {
    if (user?.role === 'solver') {
      return '/solver/dashboard';
    }
    return '#';
  };

  const getCitizenDashboardUrl = () => {
    return '/citizen/dashboard'; 
  };

  // Role-based dashboard click handler
  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    switch (user?.role) {
      case 'department':
        navigate(getDepartmentDashboardUrl()); 
        break;
      case 'solver':
        navigate(getSolverDashboardUrl());    
        break;
      default: // citizen
        navigate(getCitizenDashboardUrl());     
        break;
    }
  };

  return (
    <nav className="bg-[#FFF] flex items-center justify-between px-6 py-3 text-[#8C52FF] shadow-md sticky top-0 z-50">
      <div 
        className="text-3xl font-black tracking-tighter cursor-pointer flex items-center gap-2 hover:opacity-80 transition"
        onClick={() => navigate('/')}
      >
        Civic +
      </div>

      <div className="flex items-center gap-6">
        {isAuthenticated && (
          <button
            onClick={handleDashboardClick}
            className="bg-[#8C52FF] px-5 py-2 rounded-full hover:bg-[#b490fd]  text-white font-medium transition-colors text-sm sm:text-base flex items-center gap-1"
            title="Go to your dashboard"
          >
            Dashboard
          </button>
        )}

        {!isAuthenticated ? (
          // NOT LOGGED IN - Guest profile image jo login pe le jayega 
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 hover:opacity-80 transition"
            title="Login to access profile"
          >
            <img
              src="https://ui-avatars.com/api/?name=Guest&background=#8C52FF&color=000"
              alt="Guest"
              className="w-10 h-10 rounded-full border-2 border-black object-cover"
            />
          </button>
        ) : (
          // LOGGED IN - User ki profile image jo profile page pe le jayegi
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:opacity-80 transition"
            title="My Profile"
          >
            <img
              src={profileImg}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-black object-cover"
            />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;