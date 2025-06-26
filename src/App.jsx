import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { useAuth } from './context/AuthContext'; // if you moved auth context here

// ✅ Define this HERE
const isProtectedRoute = (page) => {
  const publicRoutes = ['landing', 'login', 'signup'];
  return !publicRoutes.includes(page);
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('landing');
  };

  const renderCurrentPage = () => {
    // ✅ PROTECT ROUTES
    if (isProtectedRoute(currentPage) && !user) {
      return <Login onNavigate={handleNavigation} onLogin={handleLogin}/>;
    }

    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigation} />;
      case 'signup':
        return <Signup onNavigate={handleNavigation} />;
      case 'dashboard':
        if (user?.role === 'admin') {
          return <AdminDashboard user={user} onLogout={handleLogout} />;
        } else if (user?.role === 'manager') {
          return <ManagerDashboard user={user} onLogout={handleLogout} />;
        } else {
          return <EmployeeDashboard user={user} onLogout={handleLogout} />;
        }
      case 'landing':
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return <div className="app">{renderCurrentPage()}</div>;
}

export default App;
