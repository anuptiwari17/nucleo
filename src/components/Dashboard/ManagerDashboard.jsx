import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';


require('dotenv').config();
const baseURL = process.env.BACKEND_API_BASE_URL;



ChartJS.register(ArcElement, Tooltip, Legend);

// Header component with glassmorphism effect
const Header = ({ onLogout, user }) => (
  <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-wide relative transition-all duration-300 group-hover:scale-105">
      <span 
        className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        style={{ 
          fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
          fontWeight: 900,
          letterSpacing: '0.1em'
        }}
      >
        Nucleo
      </span>
      
      {/* Simple glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-cyan-400/30 
                      rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </h1>
          <p className="text-sm text-white/80">{user?.department || 'Management'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user?.full_name || user?.name}</p>
          <p className="text-xs text-white/80 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

// Modal Component with glass effect
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-xl shadow-purple-500/25">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Large Modal for Task Logs with glass effect
const LargeModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-xl shadow-purple-500/25">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    password: '',
    department: ''
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchTasks();
    fetchTaskLogs();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // API calls
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}users/employees/${user.organization_id}`, {
        params: { manager_id: user.id }
      });
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}tasks/manager/${user.id}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskLogs = async () => {
    try {
      const response = await axios.get(`${baseURL}tasks/logs/organization/${user.organization_id}`);
      setTaskLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching task logs:', error);
      setTaskLogs([]);
    }
  };

  const handleTaskSelection = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  // Delete Task Function
  const handleDeleteTask = async (taskId, taskTitle) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the task "${taskTitle}"?\n\nThis action cannot be undone and will remove all associated task logs.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(`${baseURL}tasks/${taskId}`, {
        data: { manager_id: user.id }
      });

      if (response.data.success) {
        alert("Task deleted successfully!");
        fetchTasks(); 
        fetchTaskLogs();
      } else {
        alert("Failed to delete task: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("❌ Failed to delete task: " + (error.response?.data?.message || error.message));
    }
  };

  const handleBulkDeleteTasks = async (taskIds) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${taskIds.length} selected tasks?\n\nThis action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const deletePromises = taskIds.map(taskId => 
        axios.delete(`${baseURL}tasks/${taskId}`, {
          data: { manager_id: user.id }
        })
      );

      const results = await Promise.allSettled(deletePromises);
      
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        alert(`${successCount} task(s) deleted successfully!${failureCount > 0 ? ` ${failureCount} failed to delete.` : ''}`);
        fetchTasks();
        fetchTaskLogs();
      } else {
        alert("Failed to delete any tasks");
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      alert("Failed to delete tasks: " + error.message);
    }
  };

  // Handle Create Employee
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await axios.post("${baseURL}users/create-employee", {
        full_name: newEmployee.name,
        email: newEmployee.email,
        position: newEmployee.position,
        department: newEmployee.department || 'General',
        password: newEmployee.password || "emp123",
        manager_id: user.id,
        organization_id: user.organization_id,
      });

      alert("Employee created successfully!");
      setNewEmployee({ name: '', email: '', position: '', password: '', department: '' });
      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error("Error creating employee:", err);
      alert("Failed to create employee: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle Assign Task
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill all required fields");
      return;
    }

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority.toLowerCase(),
      due_date: newTask.dueDate,
      assigned_by: user.id,
      assigned_to: newTask.assignedTo,
      organization_id: user.organization_id,
    };

    try {
      const response = await axios.post("${baseURL}tasks/assign", taskData);
      alert("Task assigned successfully!");
      closeModal();
      fetchTasks();
      fetchTaskLogs();
    } catch (err) {
      console.error("Failed to assign task:", err.response?.data || err.message);
      alert("Failed to assign task: " + (err.response?.data?.message || err.message));
    }
  };

  // View employee task logs
  const viewEmployeeTaskLogs = (employee) => {
    setSelectedEmployee(employee);
    setModalType('taskLogs');
    setShowModal(true);
  };

  // Modal handlers
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedEmployee(null);
    setNewEmployee({ name: '', email: '', position: '', password: '', department: '' });
    setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
  };

  // Get employee task logs
  const getEmployeeTaskLogs = (employeeId) => {
    return taskLogs.filter(log => log.user_id === employeeId);
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'accepted').length;
  const newTasks = tasks.filter(t => t.status === 'new').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  // Chart data for task status
  const taskStatusData = {
    labels: ['Completed', 'Active', 'New', 'Failed'],
    datasets: [
      {
        data: [completedTasks, activeTasks, newTasks, failedTasks],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for employee performance
const employeePerformanceData = {
  labels: employees.map(emp => emp.full_name),
  datasets: [
    {
      label: 'Completed Tasks',
      data: employees.map(emp =>
        tasks.filter(t => t.assigned_to === emp.id && t.status === 'completed').length
      ),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    },
    {
      label: 'Pending Tasks',
      data: employees.map(emp =>
        tasks.filter(t => t.assigned_to === emp.id && (t.status === 'new' || t.status === 'accepted')).length
      ),
      backgroundColor: 'rgba(245, 158, 11, 0.7)',
      borderColor: 'rgba(245, 158, 11, 1)',
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

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'accepted': return 'bg-blue-500/20 text-blue-400';
      case 'new': return 'bg-purple-500/20 text-purple-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('task')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Assign New Task
            </button>
            <button
              onClick={() => openModal('employee')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Team Member
            </button>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Team Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Tasks Completed</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-500/20 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-white">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Active Team Members</span>
              <span className="text-sm font-medium text-white">{employees.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Pending Tasks</span>
              <span className="text-sm font-medium text-white">{newTasks + activeTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
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
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Employee Performance</h3>
          <div className="h-64">
            <Bar 
              data={employeePerformanceData} 
              options={{
                responsive: true,
                scales: {
                  x: {
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.8)'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                },
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
      </div>

      {/* Recent Tasks */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-white/80">Task</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map(task => {
                const assignedEmployee = employees.find(emp => emp.id === task.assigned_to);


                <tbody>
  {tasks.slice(0, 5).map(task => {
    const assignedEmployee = employees.find(emp => emp.id === task.assigned_to);
    
  
    console.log('Task:', task.id, 'Assigned to:', task.assigned_to);
    console.log('All employees:', employees);
    console.log('Found employee:', assignedEmployee);
    
    return (
      <tr key={task.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
        <td className="py-3 px-4 text-white">{task.title}</td>
        <td className="py-3 px-4 text-white/80">
          {assignedEmployee?.full_name || `Unknown (ID: ${task.assigned_to})`}
        </td>
        {/* ... rest of your cells ... */}
      </tr>
    );
  })}
</tbody>


                return (
                  <tr key={task.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white">{task.title}</td>
                    <td className="py-3 px-4 text-white/80">{assignedEmployee?.full_name || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/80">{new Date(task.due_date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMyTeam = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">My Team</h3>
        <button
          onClick={() => openModal('employee')}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Add Team Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 font-medium text-white/80">Name</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Email</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Position</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Department</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Active Tasks</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const employeeTasks = tasks.filter(task => task.assigned_to === employee.id);
              const activeTasks = employeeTasks.filter(task => task.status === 'accepted' || task.status === 'new');
              return (
                <tr key={employee.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{employee.full_name}</td>
                  <td className="py-3 px-4 text-white/80">{employee.email}</td>
                  <td className="py-3 px-4 text-white/80">{employee.position}</td>
                  <td className="py-3 px-4 text-white/80">{employee.department}</td>
                  <td className="py-3 px-4 text-white/80">{activeTasks.length}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => viewEmployeeTaskLogs(employee)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">All Tasks</h3>
        <div className="flex gap-3">
          {selectedTasks.length > 0 && (
            <button
              onClick={() => handleBulkDeleteTasks(selectedTasks)}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Delete Selected ({selectedTasks.length})
            </button>
          )}
          <button
            onClick={() => openModal('task')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Assign Task
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 font-medium text-white/80 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 bg-white/10"
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTasks(tasks.map(task => task.id));
                    } else {
                      setSelectedTasks([]);
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Task</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Description</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Assigned To</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-white/80 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const assignedEmployee = employees.find(emp => emp.id === task.assigned_to);
              return (
                <tr key={task.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 bg-white/10"
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => handleTaskSelection(task.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{task.title}</td>
                  <td className="py-3 px-4 text-white/80 max-w-xs truncate">{task.description}</td>
                  <td className="py-3 px-4 text-white/80">{assignedEmployee?.full_name || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/80">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleDeleteTask(task.id, task.title)}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg text-white px-2 py-1 rounded text-xs transition-all duration-300 hover:scale-110"
                      title={`Delete task: ${task.title}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No tasks found. Create your first task by clicking "Assign Task".
        </div>
      )}
    </div>
  );

  const renderTaskLogs = () => {
    const employeeLogs = getEmployeeTaskLogs(selectedEmployee?.id);
    
    return (
      <div className="space-y-4">
        <div className="bg-white/10 p-4 rounded-lg border border-white/20">
          <h4 className="font-semibold text-white">{selectedEmployee?.full_name}</h4>
          <p className="text-sm text-white/80">{selectedEmployee?.email} • {selectedEmployee?.position}</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {employeeLogs.length > 0 ? (
            <div className="space-y-3">
              {employeeLogs.map(log => {
                const task = tasks.find(t => t.id === log.task_id);
                return (
                  <div key={log.id} className="border border-white/20 rounded-lg p-4 bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-white">{task?.title || 'Unknown Task'}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'completed' ? 'bg-green-500/20 text-green-400' :
                        log.action === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                        log.action === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 mb-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    {log.note && (
                      <p className="text-sm text-white/70 bg-white/10 p-2 rounded">
                        <strong>Note:</strong> {log.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No task logs found for this employee.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'team':
        return renderMyTeam();
      case 'tasks':
        return renderTasks();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white/80">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header onLogout={handleLogout} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Manager'}! 👋
          </h1>
          <p className="text-white/80">Here's what's happening with your team today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Team Members"
            value={employees.length}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
            icon={
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="New Tasks"
            value={newTasks}
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
            value={activeTasks}
            color="text-orange-400"
            bgColor="bg-orange-500/20"
            icon={
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Completed"
            value={completedTasks}
            color="text-green-400"
            bgColor="bg-green-500/20"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="Failed Tasks"
            value={failedTasks}
            color="text-red-400"
            bgColor="bg-red-500/20"
            icon={
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
            id="team"
            label="My Team"
            count={employees.length}
            isActive={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
          />
          <TabButton
            id="tasks"
            label="All Tasks"
            count={tasks.length}
            isActive={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          />
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal && modalType === 'employee'}
        onClose={closeModal}
        title="Add Team Member"
      >
        <form onSubmit={handleCreateEmployee}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Position</label>
              <input
                type="text"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Department</label>
              <input
                type="text"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="General"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Leave blank for default (emp123)"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Add Member
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'task'}
        onClose={closeModal}
        title="Assign New Task"
      >
        <form onSubmit={handleAssignTask}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Assign To</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              >
                <option value="">Select Team Member</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name} ({employee.position})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Assign Task
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Large Modal for Task Logs */}
      <LargeModal
        isOpen={showModal && modalType === 'taskLogs'}
        onClose={closeModal}
        title={`Task Logs - ${selectedEmployee?.full_name}`}
      >
        {renderTaskLogs()}
      </LargeModal>
    </div>
  );
};

export default ManagerDashboard;