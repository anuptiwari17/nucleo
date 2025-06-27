import React from 'react';
import Header from '../ui/Header';
import NewTask from '../TaskList/NewTask';
import AcceptTask from '../TaskList/AcceptTask';
import CompleteTask from '../TaskList/CompleteTask';
import FailedTask from '../TaskList/FailedTask';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [tasks, setTasks] = React.useState({
    new: [
      { id: 1, title: "Complete Project Documentation", priority: "High", dueDate: "2025-06-30", assignedBy: "Manager" },
      { id: 2, title: "Review Code Changes", priority: "Medium", dueDate: "2025-06-28", assignedBy: "Team Lead" }
    ],
    active: [
      { id: 3, title: "Implement User Authentication", priority: "High", dueDate: "2025-07-05", assignedBy: "CTO" },
      { id: 4, title: "Database Optimization", priority: "Medium", dueDate: "2025-07-02", assignedBy: "Manager" }
    ],
    completed: [
      { id: 5, title: "Setup Development Environment", priority: "Low", assignedBy: "Team Lead", completedDate: "2025-06-20" },
      { id: 6, title: "Unit Testing Implementation", priority: "Medium", assignedBy: "Manager", completedDate: "2025-06-22" }
    ],
    failed: [
      { id: 7, title: "API Integration", priority: "High", assignedBy: "CTO", failedDate: "2025-06-25", reason: "External API deprecated" }
    ]
  });

  const [activeTab, setActiveTab] = React.useState('overview');

  const acceptTask = (taskId) => {
    const taskToMove = tasks.new.find(task => task.id === taskId);
    if (taskToMove) {
      setTasks(prev => ({
        ...prev,
        new: prev.new.filter(task => task.id !== taskId),
        active: [...prev.active, { ...taskToMove, acceptedDate: new Date().toISOString().split('T')[0] }]
      }));
    }
  };

  const completeTask = (taskId) => {
    const taskToMove = tasks.active.find(task => task.id === taskId);
    if (taskToMove) {
      setTasks(prev => ({
        ...prev,
        active: prev.active.filter(task => task.id !== taskId),
        completed: [...prev.completed, { ...taskToMove, completedDate: new Date().toISOString().split('T')[0] }]
      }));
    }
  };

  const failTask = (taskId, reason) => {
    const taskToMove = tasks.active.find(task => task.id === taskId);
    if (taskToMove) {
      setTasks(prev => ({
        ...prev,
        active: prev.active.filter(task => task.id !== taskId),
        failed: [...prev.failed, { ...taskToMove, failedDate: new Date().toISOString().split('T')[0], reason }]
      }));
    }
  };

  // Calculate stats
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks.completed.length;
  const activeTasks = tasks.active.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const StatsCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
      }`}
    >
      {label} {count !== undefined && (
        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-white bg-opacity-20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'new':
        return <NewTask tasks={tasks.new} onAccept={acceptTask} />;
      case 'active':
        return <AcceptTask tasks={tasks.active} onComplete={completeTask} onFail={failTask} />;
      case 'completed':
        return <CompleteTask tasks={tasks.completed} />;
      case 'failed':
        return <FailedTask tasks={tasks.failed} />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NewTask tasks={tasks.new} onAccept={acceptTask} />
            <AcceptTask tasks={tasks.active} onComplete={completeTask} onFail={failTask} />
            <CompleteTask tasks={tasks.completed} />
            <FailedTask tasks={tasks.failed} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="New Tasks"
            value={tasks.new.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatsCard
            title="Active Tasks"
            value={tasks.active.length}
            color="text-orange-600"
            bgColor="bg-orange-100"
            icon={
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Completed"
            value={tasks.completed.length}
            color="text-green-600"
            bgColor="bg-green-100"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="Success Rate"
            value={`${completionRate}%`}
            color="text-purple-600"
            bgColor="bg-purple-100"
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton
            id="overview"
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            id="new"
            label="New Tasks"
            count={tasks.new.length}
            isActive={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
          />
          <TabButton
            id="active"
            label="Active Tasks"
            count={tasks.active.length}
            isActive={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          />
          <TabButton
            id="completed"
            label="Completed"
            count={tasks.completed.length}
            isActive={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
          />
          <TabButton
            id="failed"
            label="Failed"
            count={tasks.failed.length}
            isActive={activeTab === 'failed'}
            onClick={() => setActiveTab('failed')}
          />
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;