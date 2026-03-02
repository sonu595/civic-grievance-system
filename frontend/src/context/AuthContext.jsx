// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/Authapi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginUser(credentials);
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      const token = data.token;
      const userData = data.user;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      const userInfo = {
        id: userData?.id || userData?._id,
        name: userData?.name || userData?.fullName,
        role: userData?.role || 'citizen',
        departmentName: userData?.departmentName,
        specialization: userData?.specialization,
        aadhaar: userData?.aadhaar || credentials.aadhaar,
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(token);
      setUser(userInfo);
      
      if (userInfo.role === 'department' && userInfo.departmentName) {
        const deptName = encodeURIComponent(userInfo.departmentName);
        navigate(`/department/${deptName}/dashboard`);
      } else if (userInfo.role === 'solver') {
        navigate('/solver/dashboard');
      } else {
        navigate('/');
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerUser(data);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    departmentName: user?.departmentName,
    loading,
    error,
    login,
    register,
    logout,
    updateUser, 
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};