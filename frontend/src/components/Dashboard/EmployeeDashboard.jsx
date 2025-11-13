import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NewTask from '../TaskList/NewTask';
import AcceptTask from '../TaskList/AcceptTask';
import CompleteTask from '../TaskList/CompleteTask';
import FailedTask from '../TaskList/FailedTask';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

// Reusable Header (same as Manager)
const Header = ({ onLogout, user }) => (
  <header className="bg-white border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-4xl font-black tracking-tight">
          <span
            className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
            style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}
          >
            Nucleo
          </span>
        </h1>
        <p className="text-sm text-slate-500">Employee Portal</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="font-semibold text-slate-900">{user?.full_name || user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.position || user?.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState({
    new: [],
    active: [],
    completed: [],
    failed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/tasks/employee/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();

      if (data.success) {
        const organized = {
          new: data.tasks.filter(t => t.status === 'new'),
          active: data.tasks.filter(t => t.status === 'accepted'),
          completed: data.tasks.filter(t => t.status === 'completed'),
          failed: data.tasks.filter(t => t.status === 'failed')
        };
        setTasks(organized);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchTasks();
  }, [user]);

  const acceptTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseURL}/tasks/${taskId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.id })
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        alert('Task accepted!');
      }
    } catch (err) {
      alert('Failed to accept task');
      console.error(err);
    }
  };

  const completeTask = async (taskId, note = '') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseURL}/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.id, note })
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        alert('Task completed!');
      }
    } catch (err) {
      alert('Failed to complete task');
      console.error(err);
    }
  };

  const failTask = async (taskId, reason) => {
    if (!reason?.trim()) return alert('Reason is required');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseURL}/tasks/${taskId}/fail`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user.id, reason })
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        alert('Task marked as failed');
      }
    } catch (err) {
      alert('Failed to fail task');
      console.error(err);
    }
  };

  // Optimized stats using useMemo
  const stats = useMemo(() => {
    const newCount = tasks.new.length;
    const activeCount = tasks.active.length;
    const completedCount = tasks.completed.length;
    const failedCount = tasks.failed.length;
    const total = newCount + activeCount + completedCount + failedCount;
    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return { newCount, activeCount, completedCount, failedCount, total, completionRate };
  }, [tasks]);

  const pieData = {
    labels: ['New', 'Active', 'Completed', 'Failed'],
    datasets: [{
      data: [stats.newCount, stats.activeCount, stats.completedCount, stats.failedCount],
      backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`w-14 h-14 ${color.replace('text-', 'bg-').replace('600', '100')} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ label, count, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
        isActive
          ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
      {count > 0 && <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">{count}</span>}
    </button>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading your tasks...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200">
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button onClick={fetchTasks} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            Try Again
          </button>
        </div>
      );
    }

    if (activeTab === 'overview') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tasks.new.length > 0 && <NewTask tasks={tasks.new} onAccept={acceptTask} />}
          {tasks.active.length > 0 && <AcceptTask tasks={tasks.active} onComplete={completeTask} onFail={failTask} />}
          {tasks.completed.length > 0 && <CompleteTask tasks={tasks.completed} />}
          {tasks.failed.length > 0 && <FailedTask tasks={tasks.failed} />}
          {stats.total === 0 && (
            <div className="col-span-2 text-center py-20 text-slate-500">
              <p className="text-2xl font-medium mb-2">No tasks yet!</p>
              <p>Your manager will assign tasks soon.</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'new') return <NewTask tasks={tasks.new} onAccept={acceptTask} />;
    if (activeTab === 'active') return <AcceptTask tasks={tasks.active} onComplete={completeTask} onFail={failTask} />;
    if (activeTab === 'completed') return <CompleteTask tasks={tasks.completed} />;
    if (activeTab === 'failed') return <FailedTask tasks={tasks.failed} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header onLogout={handleLogout} user={user} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Employee'}!
          </h1>
          <p className="text-lg text-slate-600 mt-2">Here are your current tasks and progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatsCard title="New Tasks" value={stats.newCount} color="text-violet-600" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>} />
          <StatsCard title="Active" value={stats.activeCount} color="text-blue-600" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <StatsCard title="Completed" value={stats.completedCount} color="text-emerald-600" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>} />
          <StatsCard title="Success Rate" value={`${stats.completionRate}%`} color="text-indigo-600" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
        </div>

        {/* Pie Chart */}
        {stats.total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Task Distribution</h3>
            <div className="h-80">
              <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <TabButton label="Overview" icon="Dashboard" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton label="New Tasks" count={stats.newCount} icon="New" isActive={activeTab === 'new'} onClick={() => setActiveTab('new')} />
          <TabButton label="Active" count={stats.activeCount} icon="Active" isActive={activeTab === 'active'} onClick={() => setActiveTab('active')} />
          <TabButton label="Completed" count={stats.completedCount} icon="Done" isActive={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
          <TabButton label="Failed" count={stats.failedCount} icon="Failed" isActive={activeTab === 'failed'} onClick={() => setActiveTab('failed')} />
        </div>

        <button
          onClick={fetchTasks}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition flex items-center gap-2"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Tasks
        </button>

        {/* Main Content */}
        <div>{renderContent()}</div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;