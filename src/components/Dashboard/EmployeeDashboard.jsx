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
    new: [],
    active: [],
    completed: [],
    failed: []
  });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  
  const API_BASE_URL ='http://localhost:5000/api';

  // Fetch all tasks for the employee
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/tasks/employee/${user.id}`, {
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
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/accept`, {
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
        // Refresh tasks after successful acceptance
        await fetchTasks();
        
        // Show success message (you can replace this with a toast notification)
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
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
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
        // Refresh tasks after successful completion
        await fetchTasks();
        
        // Show success message
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
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/fail`, {
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
        // Refresh tasks after successful failure marking
        await fetchTasks();
        
        // Show success message
        alert('Task marked as failed successfully!');
      } else {
        throw new Error(data.message || 'Failed to mark task as failed');
      }
    } catch (err) {
      console.error('Error marking task as failed:', err);
      alert('Error marking task as failed: ' + err.message);
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
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Error loading tasks</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchTasks}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || user?.email}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your tasks today.</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Tasks'}
          </button>
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