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
// In AcceptTask.jsx
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
      // Refresh tasks after successful failure marking
      await fetchTasks();
      
      // Show success message
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

  // Chart data for task status
  const taskStatusData = {
    labels: ['New', 'Active', 'Completed', 'Failed'],
    datasets: [
      {
        data: [tasks.new.length, tasks.active.length, tasks.completed.length, tasks.failed.length],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const StatsCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
          : 'bg-white/10 text-white hover:bg-white/20 shadow-md'
      }`}
    >
      {label} {count !== undefined && (
        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-white/20' : 'bg-white/10'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-white/80">Loading tasks...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center backdrop-blur-lg">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-white">Error loading tasks</p>
            <p className="text-sm text-white/80">{error}</p>
          </div>
          <button
            onClick={fetchTasks}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header onLogout={handleLogout} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || user?.name || 'Employee'}! 👋
          </h1>
          <p className="text-white/80">Here's what's happening with your tasks today.</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
            color="text-purple-400"
            bgColor="bg-purple-500/20"
            icon={
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatsCard
            title="Active Tasks"
            value={tasks.active.length}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Completed"
            value={tasks.completed.length}
            color="text-green-400"
            bgColor="bg-green-500/20"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="Success Rate"
            value={`${completionRate}%`}
            color="text-indigo-400"
            bgColor="bg-indigo-500/20"
            icon={
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Task Distribution Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Task Status Distribution</h3>
          <div className="h-64">
            <Pie 
              data={taskStatusData} 
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }
                }
              }} 
            />
          </div>
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