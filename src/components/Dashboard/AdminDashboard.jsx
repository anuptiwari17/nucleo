import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total_tasks: 0,
    new_tasks: 0,
    accepted_tasks: 0,
    completed_tasks: 0,
    failed_tasks: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0
  });

  // Form states
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    managerId: '',
    password: ''
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    assigned_to: ''
  });

require('dotenv').config();
const baseURL = process.env.BACKEND_API_BASE_URL;


  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, [user?.organization_id]);

  const fetchAllData = async () => {
    if (!user?.organization_id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchManagers(),
        fetchEmployees(),
        fetchAllTasks(),
        fetchTaskLogs(),
        fetchTaskStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/managers/${user.organization_id}`);
      const managersData = response.data?.managers || response.data || [];
      setManagers(Array.isArray(managersData) ? managersData : []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
    }
  };

 const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${baseURL}/users/employees/${user.organization_id}`);
    const employeesData = response.data?.employees || [];
    setEmployees(employeesData);
  } catch (error) {
    console.error('Error fetching employees:', error);
    setEmployees([]);
  }
};

const fetchAllTasks = async () => {
  try {
    const response = await axios.get(`${baseURL}/tasks/organization/${user.organization_id}`);
    setTasks(response.data.tasks || []);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    setTasks([]);
  }
};

  const fetchTaskLogs = async () => {
    try {
      const response = await axios.get(`${baseURL}/tasks/logs/organization/${user.organization_id}`);
      setTaskLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching task logs:', error);
      setTaskLogs([]);
    }
  };

const fetchTaskStats = async () => {
  try {
    const response = await axios.get(`${baseURL}/tasks/stats/organization/${user.organization_id}`);
    const stats = response.data.stats;
    
    // Convert all stats to numbers (PostgreSQL returns them as strings)
    const parsedStats = {
      total_tasks: parseInt(stats.total_tasks) || 0,
      new_tasks: parseInt(stats.new_tasks) || 0,
      accepted_tasks: parseInt(stats.accepted_tasks) || 0,
      completed_tasks: parseInt(stats.completed_tasks) || 0,
      failed_tasks: parseInt(stats.failed_tasks) || 0,
      high_priority: parseInt(stats.high_priority) || 0,
      medium_priority: parseInt(stats.medium_priority) || 0,
      low_priority: parseInt(stats.low_priority) || 0
    };

    setTaskStats(parsedStats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    setTaskStats({
      total_tasks: 0,
      new_tasks: 0,
      accepted_tasks: 0,
      completed_tasks: 0,
      failed_tasks: 0,
      high_priority: 0,
      medium_priority: 0,
      low_priority: 0
    });
  }
};

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateManager = async () => {
    if (!newManager.name || !newManager.email || !newManager.department) {
      alert("Please fill in all manager fields");
      return;
    }

    try {
      await axios.post(`${baseURL}/users/create-manager`, {
        full_name: newManager.name,
        email: newManager.email,
        department: newManager.department,
        password: newManager.password || "manager123",
        organization_id: user.organization_id,
      });

      alert("Manager created successfully!");
      setNewManager({ name: '', email: '', department: '', password: '' });
      closeModal();
      await fetchManagers();
    } catch (err) {
      console.error("Error creating manager:", err);
      if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Failed to create manager");
      }
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.managerId) {
      alert('Please fill all the fields!');
      return;
    }

    try {
      await axios.post(`${baseURL}/users/create-employee`, {
        full_name: newEmployee.name,
        email: newEmployee.email,
        position: newEmployee.position,
        manager_id: newEmployee.managerId,
        password: newEmployee.password || 'emp123',
        organization_id: user.organization_id,
      });

      alert('Employee created successfully!');
      setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
      setShowModal(false);
      await fetchEmployees();
    } catch (err) {
      console.error('Error creating employee:', err);
      if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert('Something went wrong while creating employee!');
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTask.title || !newTask.due_date || !newTask.assigned_to) {
      alert('Please fill all required task fields!');
      return;
    }

    try {
      const managerId = user.id; // Assuming admin is creating tasks
      await axios.post(`${baseURL}/tasks/assign`, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        due_date: newTask.due_date,
        assigned_by: managerId,
        assigned_to: newTask.assigned_to,
        organization_id: user.organization_id
      });

      alert('Task created successfully!');
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
      setShowModal(false);
      await fetchAllTasks();
      await fetchTaskStats();
    } catch (err) {
      console.error('Error creating task:', err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Something went wrong while creating task!');
      }
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`${baseURL}/tasks/${taskId}`, {
        data: { manager_id: user.id }
      });

      alert('Task deleted successfully!');
      await fetchAllTasks();
      await fetchTaskStats();
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to delete task');
      }
    }
  };

  // Modal handlers
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setNewManager({ name: '', email: '', department: '', password: '' });
    setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
    setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
  };

  // Stats calculations
  const totalUsers = managers.length + employees.length;
  const completedTasks = taskStats.completed_tasks;
  const activeTasks = taskStats.new_tasks + taskStats.accepted_tasks;
  const failedTasks = taskStats.failed_tasks;

  // Chart data
  const taskStatusData = {
    labels: ['New', 'Accepted', 'Completed', 'Failed'],
    datasets: [
      {
        data: [taskStats.new_tasks, taskStats.accepted_tasks, taskStats.completed_tasks, taskStats.failed_tasks],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const taskPriorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [taskStats.high_priority, taskStats.medium_priority, taskStats.low_priority],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const userDistributionData = {
    labels: ['Managers', 'Employees'],
    datasets: [
      {
        data: [managers.length, employees.length],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)',
          'rgba(6, 182, 212, 0.7)'
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(6, 182, 212, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Components
  const Header = () => (
    <header className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-6 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.organizationName || 'Organization'}</h1>
            <p className="text-white/80">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right hidden md:block">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-white/80 capitalize">{user?.role}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  const StatsCard = ({ title, value, icon, color, bgColor, subtitle, chart }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-white mb-1`}>{value}</p>
          {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
      {chart && (
        <div className="mt-4 h-32">
          {chart}
        </div>
      )}
    </div>
  );

  const TabButton = ({ id, label, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl'
          : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="relative z-10 flex items-center">
        {label}
        {count !== undefined && (
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            isActive ? 'bg-white/20' : 'bg-white/10'
          }`}>
            {count}
          </span>
        )}
      </span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30"></div>
      )}
    </button>
  );

  const TaskStatusBadge = ({ status }) => {
    const statusColors = {
      new: 'bg-blue-500/20 text-blue-400',
      accepted: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityColors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  const renderTabContent = () => {
    if (loading) return <LoadingSpinner />;
    
    switch (activeTab) {
      case 'managers':
        return renderManagers();
      case 'employees':
        return renderEmployees();
      case 'tasks':
        return renderTasks();
      case 'logs':
        return renderTaskLogs();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="text-white"
          bgColor="bg-blue-500/20"
          subtitle={`${managers.length} managers, ${employees.length} employees`}
          chart={
            <Pie 
              data={userDistributionData} 
              options={{ 
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
              }} 
            />
          }
        />
        
        
<StatsCard
  title="Total Tasks"
  value={taskStats.total_tasks}
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  }
  color="text-white"
  bgColor="bg-purple-500/20"
  subtitle={`${taskStats.completed_tasks} completed, ${taskStats.failed_tasks} failed`}
  chart={
    <Pie 
      data={taskStatusData} 
      options={{ 
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
      }} 
    />
  }
/>

<StatsCard
  title="Active Tasks"
  value={taskStats.new_tasks + taskStats.accepted_tasks}
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  }
  color="text-white"
  bgColor="bg-yellow-500/20"
  subtitle={`${taskStats.new_tasks} new, ${taskStats.accepted_tasks} in progress`}
/>

<StatsCard
  title="Task Priority"
  value=""
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  }
  color="text-white"
  bgColor="bg-gray-500/20"
  subtitle={
    <div className="flex justify-between text-xs mt-2 space-x-2">
      <span className="text-red-400">High: {taskStats.high_priority}</span>
      <span className="text-yellow-400">Med: {taskStats.medium_priority}</span>
      <span className="text-green-400">Low: {taskStats.low_priority}</span>
    </div>
  }
  chart={
    <Bar 
      data={taskPriorityData} 
      options={{ 
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { display: false } } },
        maintainAspectRatio: false
      }} 
    />
  }
/>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('manager')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Manager
            </button>
            <button
              onClick={() => openModal('employee')}
              disabled={managers.length === 0}
              className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] ${
                managers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Employee
            </button>
            <button
              onClick={() => openModal('task')}
              disabled={employees.length === 0}
              className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] ${
                employees.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Task
            </button>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Tasks ({tasks.length})
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View All Tasks →
            </button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-white/50">No tasks found. Create your first task to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-white/80">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-white/80">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium text-white/80">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-white/80">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map(task => (
                    <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{task.title}</td>
                      <td className="py-3 px-4 text-white/80">{task.assigned_to_name}</td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(task.due_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Recent Activity Logs
          </h3>
          <button
            onClick={() => setActiveTab('logs')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View All Logs →
          </button>
        </div>
        
        {taskLogs.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-white/50">No activity logs found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {taskLogs.slice(0, 5).map(log => (
              <div key={log.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">
                      {log.user_name} ({log.user_role})
                    </p>
                    <p className="text-sm text-white/70">{log.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      log.action === 'created' ? 'bg-blue-500/20 text-blue-400' :
                      log.action === 'accepted' ? 'bg-yellow-500/20 text-yellow-400' :
                      log.action === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderManagers = () => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Managers ({managers.length})
        </h3>
        <button
          onClick={() => openModal('manager')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Manager
        </button>
      </div>
      
      {managers.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-white/50 mb-4">No managers found</p>
          <button
            onClick={() => openModal('manager')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            Create Your First Manager
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-white/80">Name</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Email</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Department</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(manager => {
                const managerTasks = tasks.filter(t => t.assigned_by === manager.id);
                const managerEmployees = employees.filter(emp => emp.manager_id === manager.id);
                
                return (
                  <tr key={manager.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{manager.full_name}</td>
                    <td className="py-3 px-4 text-white/80">{manager.email}</td>
                    <td className="py-3 px-4 text-white/80">{manager.department}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                        {managerEmployees.length}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                        {managerTasks.length}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEmployees = () => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Employees ({employees.length})
        </h3>
        <button
          onClick={() => openModal('employee')}
          disabled={managers.length === 0}
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
            managers.length === 0 
              ? 'bg-gray-500/20 text-white/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-white/50 mb-4">No employees found</p>
          {managers.length === 0 ? (
            <p className="text-sm text-orange-400">Create managers first to add employees</p>
          ) : (
            <button
              onClick={() => openModal('employee')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Add Your First Employee
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-white/80">Name</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Email</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Position</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Manager</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => {
                const manager = managers.find(m => m.id === employee.manager_id);
                const employeeTasks = tasks.filter(t => t.assigned_to === employee.id);
                
                return (
                  <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{employee.full_name}</td>
                    <td className="py-3 px-4 text-white/80">{employee.email}</td>
                    <td className="py-3 px-4 text-white/80">{employee.position}</td>
                    <td className="py-3 px-4 text-white/80">
                      {manager ? `${manager.full_name} (${manager.department})` : 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                        {employeeTasks.length}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTasks = () => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tasks ({tasks.length})
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={() => openModal('task')}
            disabled={employees.length === 0}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
              employees.length === 0 
                ? 'bg-gray-500/20 text-white/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-white/50 mb-4">No tasks found</p>
          {employees.length === 0 ? (
            <p className="text-sm text-orange-400">Create employees first to assign tasks</p>
          ) : (
            <button
              onClick={() => openModal('task')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
            >
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-white/80">Title</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Description</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Assigned By</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const assignedBy = managers.find(m => m.id === task.assigned_by) || 
                                 employees.find(e => e.id === task.assigned_by);
                
                return (
                  <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{task.title}</td>
                    <td className="py-3 px-4 text-white/80 max-w-xs truncate">{task.description}</td>
                    <td className="py-3 px-4 text-white/80">{task.assigned_to_name}</td>
                    <td className="py-3 px-4 text-white/80">
                      {assignedBy ? assignedBy.full_name : 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      {new Date(task.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTaskLogs = () => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Task Activity Logs ({taskLogs.length})
        </h3>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="px-6 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center"
        >
          <svg className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {taskLogs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-white/50">No activity logs found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {taskLogs.map(log => (
            <div key={log.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">
                    {log.user_name} ({log.user_role})
                  </p>
                  <p className="text-sm text-white/70">
                    <span className="font-medium">Task:</span> {log.task_title} ({log.task_priority})
                  </p>
                  <p className="text-sm text-white/70">{log.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.action === 'created' ? 'bg-blue-500/20 text-blue-400' :
                    log.action === 'accepted' ? 'bg-yellow-500/20 text-yellow-400' :
                    log.action === 'completed' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {log.action}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}</h1>
          <p className="text-white/80 text-xl">Manage your organization's workforce and tasks</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton
            id="overview"
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            id="managers"
            label="Managers"
            count={managers.length}
            isActive={activeTab === 'managers'}
            onClick={() => setActiveTab('managers')}
          />
          <TabButton
            id="employees"
            label="Employees"
            count={employees.length}
            isActive={activeTab === 'employees'}
            onClick={() => setActiveTab('employees')}
          />
          <TabButton
            id="tasks"
            label="Tasks"
            count={tasks.length}
            isActive={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          />
          <TabButton
            id="logs"
            label="Activity Logs"
            count={taskLogs.length}
            isActive={activeTab === 'logs'}
            onClick={() => setActiveTab('logs')}
          />
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal && modalType === 'manager'}
        onClose={closeModal}
        title="Add New Manager"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
            <input
              type="text"
              value={newManager.name}
              onChange={(e) => setNewManager({...newManager, name: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              value={newManager.email}
              onChange={(e) => setNewManager({...newManager, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Department</label>
            <input
              type="text"
              value={newManager.department}
              onChange={(e) => setNewManager({...newManager, department: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <input
              type="password"
              value={newManager.password}
              onChange={(e) => setNewManager({...newManager, password: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Leave blank for default (manager123)"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateManager}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors"
            >
              Create Manager
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'employee'}
        onClose={closeModal}
        title="Add New Employee"
      >
        <form onSubmit={handleCreateEmployee}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Position</label>
              <input
                type="text"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Assign to Manager</label>
              <select
                value={newEmployee.managerId}
                onChange={(e) => setNewEmployee({...newEmployee, managerId: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option className="bg-black" value="">Select Manager</option>
                {managers.map(manager => (
                  <option className="bg-black" key={manager.id} value={manager.id}>
                    {manager.full_name} - {manager.department}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Leave blank for default (emp123)"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-colors"
              >
                Create Employee
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'task'}
        onClose={closeModal}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Title*</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Priority*</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Assign To*</label>
              <select
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} ({employee.position})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Due Date*</label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;