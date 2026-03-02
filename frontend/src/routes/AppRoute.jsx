// routes/AppRoute.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import FileComplaint from '../pages/citizen/FileComplaint';
import Dashboard from '../pages/citizen/Dashboard';
import ComplaintDetail from '../pages/citizen/ComplaintDetail';
import DepartmentDashboard from '../pages/department/DepartmentDashboard';
import PendingComplaints from '../pages/department/PendingComplaints';
import SolverDashboard from '../pages/solver/SolverDashboard';
import TaskDetails from '../pages/solver/TaskDetails';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Navbar from '../components/layout/Navbar';

const AppRoutes = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

 
  useEffect(() => {
    if (!location.pathname.includes('/login') && !location.pathname.includes('/register')) {
      const timer = setTimeout(() => {
        setAuthMode('login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleLoginSuccess = () => {
    console.log('Login successful');
    // Navigation already handled in AuthContext
  };

  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /></>} />

      <Route 
        path="/login" 
        element={
          <>
          <Navbar />
          {authMode === 'login' ? (
            <Login 
              onToggle={toggleAuthMode} 
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Navigate to="/register" replace />
          )}
          </>
        } 
      />

      <Route 
        path="/register" 
        element={
          <>
          <Navbar/>
         { authMode === 'register' ? (
            <Register 
              onToggle={toggleAuthMode} 
            />
          ) : (
            <Navigate to="/login" replace />
          )}
          </>
        } 
      />

      {/* ✅ PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
       <Route path="/citizen/dashboard" element={<><Navbar /><Dashboard/></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/file-complaint" element={<><Navbar /><FileComplaint /></>} />
        <Route path="/complaint/:id" element={<><Navbar /><ComplaintDetail /></>} />
        
        {/* DEPARTMENT ROUTES */}
        <Route element={<RoleBasedRoute allowedRoles={['department']} />}>
          <Route path="/department/:departmentName/dashboard" element={<><Navbar /><DepartmentDashboard /></>} />
          <Route path="/department/:departmentName/pending" element={<><Navbar /><PendingComplaints /></>} />
          <Route path="/department/dashboard" element={<Navigate to="/" />} />
          <Route path="/department/pending" element={<Navigate to="/" />} />
          <Route path="/department-dashboard" element={<Navigate to="/" />} />
        </Route>

        {/* SOLVER ROUTES */}
        <Route element={<RoleBasedRoute allowedRoles={['solver']} />}>
          <Route path="/solver/dashboard" element={<><Navbar /><SolverDashboard /></>} />
          <Route path="/solver/task/:id" element={<><Navbar /><TaskDetails /></>} />
        </Route>
      </Route>

      {/* ✅ FALLBACK FOR UNAUTHORIZED */}
      <Route path="/dashboard" element={<Navigate to="/" />} />

      {/* ✅ 404 NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;