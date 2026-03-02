import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDEBD0]">
        <div className="text-[#8C52FF] text-xl font-bold animate-pulse">
          Checking access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    let redirectPath = '/dashboard';
    if (role === 'department') redirectPath = '/department/dashboard';
    if (role === 'solver') redirectPath = '/solver/dashboard';
    if (role === 'citizen') redirectPath = '/citizen/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;