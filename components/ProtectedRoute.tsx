import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User, UserRole } from '../types';

interface ProtectedRouteProps {
  currentUser: User | undefined;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ currentUser, allowedRoles }) => {
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to the user's appropriate dashboard
    switch (currentUser.role) {
      case 'fan':
        return <Navigate to="/fan/home" replace />;
      case 'creator':
        return <Navigate to="/creator/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/auth/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
