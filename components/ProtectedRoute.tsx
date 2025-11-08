import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User, UserRole } from '../types';
import { DEMO_MODE } from '@/config';
import { getCurrentDemoUser } from '@/state/demoAuth';

interface ProtectedRouteProps {
  currentUser?: User | undefined;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ currentUser, allowedRoles }) => {
  // In demo mode, use the demo user
  const effectiveUser = DEMO_MODE ? getCurrentDemoUser() : currentUser;

  if (!effectiveUser) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(effectiveUser.role)) {
    // Redirect to the user's appropriate dashboard
    switch (effectiveUser.role) {
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
