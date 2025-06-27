import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ role, children }) => {
  const { isAuthenticated, user, isAuthLoading } = useAuth();

  // Wait until AuthContext finishes loading localStorage
  if (isAuthLoading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  // If not logged in, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role doesn't match, redirect
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // If all good, show the route
  return children;
};

export default PrivateRoute;
