import React from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = React.useState('landing');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  
  // Simple mock users database
  const [users, setUsers] = React.useState([
    { 
      id: 1, 
      email: 'admin@nucleo.com', 
      password: 'admin123', 
      name: 'Admin User', 
      role: 'admin',
      organizationName: 'Nucleo Corp'
    },
    { 
      id: 2, 
      email: 'manager@nucleo.com', 
      password: 'manager123', 
      name: 'Jane Manager', 
      role: 'manager',
      department: 'Operations'
    },
    { 
      id: 3, 
      email: 'employee@nucleo.com', 
      password: 'emp123', 
      name: 'John Employee', 
      role: 'employee',
      position: 'Developer'
    }
  ]);


  
  const managers = users.filter(u => u.role === 'manager');
  const employees = users.filter(u => u.role === 'employee');


  // Navigation handler
  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };


    const handleCreateManager = (managerData) => {
    // Check for duplicate email
    if (users.some(u => u.email === managerData.email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newManager = {
      ...managerData,
      id: users.length + 1,
      role: 'manager'
    };
    setUsers(prev => [...prev, newManager]);
    return { success: true };
  };


  const handleCreateEmployee = (employeeData) => {
    if (users.some(u => u.email === employeeData.email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newEmployee = {
      ...employeeData,
      id: users.length + 1,
      role: 'employee'
    };
    setUsers(prev => [...prev, newEmployee]);
    return { success: true };
  };


  // Login handler
  const handleLogin = (loginData) => {
    console.log('Login attempt:', loginData);
    const foundUser = users.find(u => 
      u.email === loginData.email && 
      u.password === loginData.password
    );

    if (foundUser) {
      console.log('Login successful for:', foundUser);
      setIsAuthenticated(true);
      setUser(foundUser);
      setCurrentPage('dashboard');
      return { success: true };
    } else {
      console.log('Login failed: invalid credentials');
      return { success: false, message: 'Invalid credentials' };
    }
  };

  // Signup handler
  const handleSignup = (signupData) => {
    console.log('Signup attempt:', signupData);
    return { 
      success: true, 
      message: 'Signup would create account in real app' 
    };
  };

  // Logout handler
  const handleLogout = () => {
    console.log('Logging out');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('landing');
  };

  // Render the current page
  const renderCurrentPage = () => {
    console.log('Rendering:', currentPage);

    switch (currentPage) {
      case 'login':
        return <Login 
                 onNavigate={handleNavigation} 
                 onLogin={handleLogin} 
               />;
      case 'signup':
        return <Signup 
                 onNavigate={handleNavigation} 
                 onSignup={handleSignup} 
               />;
      case 'dashboard':
        if (!isAuthenticated || !user) {
          console.log('Not authenticated, redirecting to login');
          return <Login onNavigate={handleNavigation} onLogin={handleLogin} />;
        }

        console.log('User role:', user.role);

        if (user.role === 'admin') {
          return (
            <AdminDashboard
              onLogout={handleLogout}
              user={user}
              managers={managers}
              employees={employees}
              onCreateManager={handleCreateManager}
              onCreateEmployee={handleCreateEmployee}
            />
          );
        } else if (user.role === 'manager') {
          return (
            <ManagerDashboard
              onLogout={handleLogout}
              user={user}
              employees={employees}
              onCreateEmployee={handleCreateEmployee}
            />
          );
        } else {
          return <EmployeeDashboard onLogout={handleLogout} user={user} />;
        }

      case 'landing':
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentPage()}
    </div>
  );
}

export default App;