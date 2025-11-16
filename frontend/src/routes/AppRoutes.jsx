import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';
import ForgotPassword from '../components/Auth/ForgotPassword';
import Legal from '../components/pages/Legal';
import Pricing from '../components/pages/Pricing';
import ShowcaseDemo from '../components/pages/Demo';


const DashboardRedirector = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-lg font-medium text-gray-600 animate-pulse">Authenticating...</div>
  </div>
);

  }

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'manager':
      return <Navigate to="/manager" />;
    case 'employee':
      return <Navigate to="/employee" />;
    default:
      return <Navigate to="/" />;
  }
};


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/legal" element={<Legal />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/demo" element={<ShowcaseDemo/>}/>


    {/* Role-based redirector */}
    <Route path="/dashboard" element={<DashboardRedirector />} />

    {/* Protected dashboard routes */}
    <Route
      path="/admin"
      element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/manager"
      element={
        <PrivateRoute role="manager">
          <ManagerDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/employee"
      element={
        <PrivateRoute role="employee">
          <EmployeeDashboard />
        </PrivateRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
