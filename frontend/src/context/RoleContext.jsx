import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { role } = useAuth();

  const canAccessDepartment = role === 'department';
  const canAccessSolver = role === 'solver';
  const isCitizen = role === 'citizen' || !role;

  const value = {
    role,
    isCitizen,
    canAccessDepartment,
    canAccessSolver,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};