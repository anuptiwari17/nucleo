import React from 'react';
import Header from '../ui/Header';
import NewTask from '../TaskList/NewTask';
import AcceptTask from '../TaskList/AcceptTask';
import CompleteTask from '../TaskList/CompleteTask';
import FailedTask from '../TaskList/FailedTask';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeDashboard = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [tasks, setTasks] = React.useState({
    new: [],
    active: [],
    completed: [],
    failed: []
  });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Fetch all tasks for the employee
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/tasks/employee/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      
      if (data.success) {
        // Organize tasks by status
        const organizedTasks = {
          new: data.tasks.filter(task => task.status === 'new'),
          active: data.tasks.filter(task => task.status === 'accepted'),
          completed: data.tasks.filter(task => task.status === 'completed'),
          failed: data.tasks.filter(task => task.status === 'failed')
        };
        
        setTasks(organizedTasks);
      } else {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Accept a task
  const acceptTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/tasks/${taskId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept task');
      }

      if (data.success) {
        await fetchTasks();
        alert('Task accepted successfully!');
      } else {
        throw new Error(data.message || 'Failed to accept task');
      }
    } catch (err) {
      console.error('Error accepting task:', err);
      alert('Error accepting task: ' + err.message);
    }
  };

  // Complete a task
  const completeTask = async (taskId, note = '') => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          note: note
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete task');
      }

      if (data.success) {
        await fetchTasks();
        alert('Task completed successfully!');
      } else {
        throw new Error(data.message || 'Failed to complete task');
      }
    } catch (err) {
      console.error('Error completing task:', err);
      alert('Error completing task: ' + err.message);
    }
  };

  // Fail a task
  const failTask = async (taskId, reason) => {
    try {
      if (!reason || reason.trim() === '') {
        alert('Please provide a reason for failing the task');
        return;
      }

      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseURL}/tasks/${taskId}/fail`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          reason: reason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark task as failed');
      }

      if (data.success) {
        await fetchTasks();
        alert('Task marked as failed successfully!');
      } else {
        throw new Error(data.message || 'Failed to mark task as failed');
      }
    } catch (err) {
      console.error("Error marking task as failed:", err);
      alert("Error marking task as failed: " + err.message);
    }
  };

  // Load tasks on component mount
  React.useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    }
  }, [user]);

  // Calculate stats
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks.completed.length;
  const activeTasks = tasks.active.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Enhanced Chart data with improved colors
  const taskStatusData = {
    labels: ['New Tasks', 'Active Tasks', 'Completed', 'Failed'],
    datasets: [
      {
        data: [tasks.new.length, tasks.active.length, tasks.completed.length, tasks.failed.length],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)', 
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const StatsCard = ({ title, value, icon, color, bgColor, trend }) => (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] hover:border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/70 mb-2 group-hover:text-white/90 transition-colors duration-300">{title}</p>
          <p className={`text-3xl font-bold ${color} group-hover:scale-110 transition-transform duration-300`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <svg className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={trend > 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
              </svg>
              <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
          {icon}
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className={`h-full ${bgColor.replace('bg-', 'bg-gradient-to-r from-')} transition-all duration-500 group-hover:shadow-sm`} 
             style={{width: `${Math.min((value / Math.max(totalTasks, 1)) * 100, 100)}%`}}></div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, count, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`relative px-6 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm overflow-hidden group ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white shadow-xl border-purple-400/50 scale-105'
          : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:shadow-lg hover:scale-[1.02] border-white/10 hover:border-white/20'
      }`}
    >
      {/* Animated background for active tab */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      <div className="relative flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {label}
        {count !== undefined && (
          <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            isActive 
              ? 'bg-white/20 text-white shadow-sm' 
              : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'
          }`}>
            {count}
          </span>
        )}
      </div>
    </button>
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <span className="mt-4 text-white/80 font-medium">Loading your tasks...</span>
          <span className="mt-1 text-white/60 text-sm">Please wait a moment</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-lg">
          <div className="text-red-400 mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</p>
            <p className="text-white/70 mb-6">{error}</p>
          </div>
          <button
            onClick={fetchTasks}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      );
    }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header onLogout={handleLogout} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome back, {user?.full_name?.split(' ')[0]}! 
                <span className="ml-2">👋</span>
              </h1>
              <p className="text-white/70 text-lg">Here's what's happening with your tasks today.</p>
              {totalTasks > 0 && (
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-white/60 text-sm">
                    📊 Total tasks: <span className="font-semibold text-white/80">{totalTasks}</span>
                  </span>
                  <span className="text-white/60 text-sm">
                    ⚡ Active: <span className="font-semibold text-blue-400">{activeTasks}</span>
                  </span>
                  <span className="text-white/60 text-sm">
                    ✅ Completed: <span className="font-semibold text-green-400">{completedTasks}</span>
                  </span>
                </div>
              )}
            </div>
            
            {/* Enhanced Refresh Button */}
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Tasks'}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="New Tasks"
            value={tasks.new.length}
            color="text-purple-400"
            bgColor="bg-gradient-to-br from-purple-500/20 to-purple-600/30"
            trend={5}
            icon={
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatsCard
            title="Active Tasks"
            value={tasks.active.length}
            color="text-blue-400"
            bgColor="bg-gradient-to-br from-blue-500/20 to-blue-600/30"
            trend={12}
            icon={
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Completed"
            value={tasks.completed.length}
            color="text-green-400"
            bgColor="bg-gradient-to-br from-green-500/20 to-green-600/30"
            trend={8}
            icon={
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="Success Rate"
            value={`${completionRate}%`}
            color="text-indigo-400"
            bgColor="bg-gradient-to-br from-indigo-500/20 to-indigo-600/30"
            trend={-2}
            icon={
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Enhanced Task Distribution Chart */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl mb-8 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Task Status Distribution</h3>
              <p className="text-white/60 text-sm">Overview of your task management</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="h-72 flex justify-center items-center">
            {totalTasks > 0 ? (
              <Pie 
                data={taskStatusData} 
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: { size: 12, weight: '500' },
                        padding: 20
                      },
                      position: 'bottom'
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: 'rgba(255, 255, 255, 0.9)',
                      bodyColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderWidth: 1
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }} 
              />
            ) : (
              <div className="text-center text-white/60">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg">No tasks available</p>
                <p className="text-sm opacity-70">Tasks will appear here when assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <TabButton
            id="overview"
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon="📊"
          />
          <TabButton
            id="new"
            label="New Tasks"
            count={tasks.new.length}
            isActive={activeTab === 'new'}
            onClick={() => setActiveTab('new')}
            icon="⭐"
          />
          <TabButton
            id="active"
            label="Active Tasks"
            count={tasks.active.length}
            isActive={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
            icon="⚡"
          />
          <TabButton
            id="completed"
            label="Completed"
            count={tasks.completed.length}
            isActive={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
            icon="✅"
          />
          <TabButton
            id="failed"
            label="Failed"
            count={tasks.failed.length}
            isActive={activeTab === 'failed'}
            onClick={() => setActiveTab('failed')}
            icon="❌"
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