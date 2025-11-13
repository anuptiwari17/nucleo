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

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Header with Orbitron logo and premium light theme
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
        <p className="text-sm text-slate-500">{user?.department || 'Management'}</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="font-semibold text-slate-900">{user?.full_name || user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
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

// Modal with clean light design
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Large Modal for Task Logs
const LargeModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [newEmployee, setNewEmployee] = useState({
    name: '', email: '', position: '', password: '', department: ''
  });

  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium', assignedTo: '', dueDate: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
    fetchTaskLogs();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/employees/${user.organization_id}`, {
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
      const response = await axios.get(`${baseURL}/tasks/manager/${user.id}`);
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
      const response = await axios.get(`${baseURL}/tasks/logs/organization/${user.organization_id}`);
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

  const handleDeleteTask = async (taskId, taskTitle) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${taskTitle}"?\nThis action cannot be undone.`);
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`${baseURL}/tasks/${taskId}`, { data: { manager_id: user.id } });
      if (response.data.success) {
        alert("Task deleted successfully!");
        fetchTasks();
        fetchTaskLogs();
      }
    } catch (error) {
      alert("Failed to delete task: " + (error.response?.data?.message || error.message));
    }
  };

  const handleBulkDeleteTasks = async (taskIds) => {
    const isConfirmed = window.confirm(`Delete ${taskIds.length} selected tasks? This cannot be undone.`);
    if (!isConfirmed) return;

    try {
      const results = await Promise.allSettled(
        taskIds.map(id => axios.delete(`${baseURL}/tasks/${id}`, { data: { manager_id: user.id } }))
      );
      const success = results.filter(r => r.status === 'fulfilled').length;
      alert(`${success} task(s) deleted successfully!`);
      fetchTasks();
      fetchTaskLogs();
    } catch (error) {
      alert("Error during bulk delete");
      console.error(error);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(`${baseURL}/users/create-employee`, {
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
      alert("Failed to create employee: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(`${baseURL}/tasks/assign`, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority.toLowerCase(),
        due_date: newTask.dueDate,
        assigned_by: user.id,
        assigned_to: newTask.assignedTo,
        organization_id: user.organization_id,
      });
      alert("Task assigned successfully!");
      closeModal();
      fetchTasks();
      fetchTaskLogs();
    } catch (err) {
      alert("Failed to assign task: " + (err.response?.data?.message || err.message));
    }
  };

  const viewEmployeeTaskLogs = (employee) => {
    setSelectedEmployee(employee);
    setModalType('taskLogs');
    setShowModal(true);
  };

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

  const getEmployeeTaskLogs = (employeeId) => taskLogs.filter(log => log.user_id === employeeId);

  // Stats
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'accepted').length;
  const newTasks = tasks.filter(t => t.status === 'new').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  const taskStatusData = {
    labels: ['Completed', 'Active', 'New', 'Failed'],
    datasets: [{
      data: [completedTasks, activeTasks, newTasks, failedTasks],
      backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const employeePerformanceData = {
    labels: employees.map(emp => emp.full_name.split(' ')[0]),
    datasets: [
      {
        label: 'Completed',
        data: employees.map(emp => tasks.filter(t => t.assigned_to === emp.id && t.status === 'completed').length),
        backgroundColor: '#10b981',
      },
      {
        label: 'Pending',
        data: employees.map(emp => tasks.filter(t => t.assigned_to === emp.id && ['new', 'accepted'].includes(t.status)).length),
        backgroundColor: '#f59e0b',
      },
    ],
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

  const TabButton = ({  label, count, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label} {count !== undefined && <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">{count}</span>}
    </button>
  );

  const getPriorityBadge = (priority) => {
    const map = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-green-100 text-green-700',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[priority?.toLowerCase()] || 'bg-slate-100 text-slate-700'}`}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: 'bg-emerald-100 text-emerald-700',
      accepted: 'bg-blue-100 text-blue-700',
      new: 'bg-purple-100 text-purple-700',
      failed: 'bg-red-100 text-red-700',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status?.toLowerCase()] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Task Status</h3>
          <div className="h-72"><Pie data={taskStatusData} options={{ plugins: { legend: { position: 'bottom' } } }} /></div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Employee Performance</h3>
          <div className="h-72"><Bar data={employeePerformanceData} options={{ plugins: { legend: { position: 'top' } } }} /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent Tasks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Task</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Assigned To</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Priority</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map(task => {
                const emp = employees.find(e => e.id === task.assigned_to);
                return (
                  <tr key={task.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-medium text-slate-900">{task.title}</td>
                    <td className="py-4 px-6 text-slate-600">{emp?.full_name || '—'}</td>
                    <td className="py-4 px-6">{getPriorityBadge(task.priority)}</td>
                    <td className="py-4 px-6">{getStatusBadge(task.status)}</td>
                    <td className="py-4 px-6 text-slate-600">{new Date(task.due_date).toLocaleDateString()}</td>
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">My Team</h3>
        <button onClick={() => openModal('employee')} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition">
          Add Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Name</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Email</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Position</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Active Tasks</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const active = tasks.filter(t => t.assigned_to === emp.id && ['new', 'accepted'].includes(t.status)).length;
              return (
                <tr key={emp.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6 font-medium text-slate-900">{emp.full_name}</td>
                  <td className="py-4 px-6 text-slate-600">{emp.email}</td>
                  <td className="py-4 px-6 text-slate-600">{emp.position}</td>
                  <td className="py-4 px-6 text-slate-600">{active}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => viewEmployeeTaskLogs(emp)} className="text-violet-600 hover:text-violet-800 font-medium">
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">All Tasks</h3>
        <div className="flex gap-3">
          {selectedTasks.length > 0 && (
            <button onClick={() => handleBulkDeleteTasks(selectedTasks)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
              Delete Selected ({selectedTasks.length})
            </button>
          )}
          <button onClick={() => openModal('task')} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition">
            Assign Task
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-12"><input type="checkbox" checked={selectedTasks.length === tasks.length && tasks.length > 0} onChange={e => e.target.checked ? setSelectedTasks(tasks.map(t => t.id)) : setSelectedTasks([])} className="rounded" /></th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Task</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Assigned To</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Priority</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Due Date</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const emp = employees.find(e => e.id === task.assigned_to);
              return (
                <tr key={task.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6"><input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={e => handleTaskSelection(task.id, e.target.checked)} /></td>
                  <td className="py-4 px-6 font-medium text-slate-900">{task.title}</td>
                  <td className="py-4 px-6 text-slate-600">{emp?.full_name || '—'}</td>
                  <td className="py-4 px-6">{getPriorityBadge(task.priority)}</td>
                  <td className="py-4 px-6">{getStatusBadge(task.status)}</td>
                  <td className="py-4 px-6 text-slate-600">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDeleteTask(task.id, task.title)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTaskLogs = () => {
    const logs = getEmployeeTaskLogs(selectedEmployee?.id);
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
          <h4 className="text-xl font-bold text-slate-900">{selectedEmployee?.full_name}</h4>
          <p className="text-slate-600">{selectedEmployee?.email} • {selectedEmployee?.position}</p>
        </div>
        <div className="space-y-4">
          {logs.length > 0 ? logs.map(log => {
            const task = tasks.find(t => t.id === log.task_id);
            return (
              <div key={log.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex justify-between items-start">
                  <h5 className="font-semibold text-slate-900">{task?.title || 'Unknown Task'}</h5>
                  {getStatusBadge(log.action)}
                </div>
                <p className="text-sm text-slate-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                {log.note && <p className="mt-3 text-slate-700 bg-white p-3 rounded-lg"><strong>Note:</strong> {log.note}</p>}
              </div>
            );
          }) : <p className="text-center text-slate-500 py-12">No logs found</p>}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'team') return renderMyTeam();
    if (activeTab === 'tasks') return renderTasks();
    return renderOverview();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header onLogout={handleLogout} user={user} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Manager'}!
          </h1>
          <p className="text-lg text-slate-600 mt-2">Here's what's happening with your team today.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          <StatsCard title="Team Members" value={employees.length} color="text-violet-600" icon={<svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21h3a2 2 0 002-2v-1a6 6 0 00-12 0v1a2 2 0 002 2h3m2-7a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatsCard title="New Tasks" value={newTasks} color="text-purple-600" icon={<svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>} />
          <StatsCard title="Active Tasks" value={activeTasks} color="text-blue-600" icon={<svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <StatsCard title="Completed" value={completedTasks} color="text-emerald-600" icon={<svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>} />
          <StatsCard title="Failed" value={failedTasks} color="text-red-600" icon={<svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>} />
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton id="team" label="My Team" count={employees.length} isActive={activeTab === 'team'} onClick={() => setActiveTab('team')} />
          <TabButton id="tasks" label="All Tasks" count={tasks.length} isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
        </div>

        {renderTabContent()}
      </main>

      {/* Modals */}
      <Modal isOpen={showModal && modalType === 'employee'} onClose={closeModal} title="Add Team Member">
        <form onSubmit={handleCreateEmployee} className="space-y-5">
          <input type="text" placeholder="Full Name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent" required />
          <input type="email" placeholder="Email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent" required />
          <input type="text" placeholder="Position" value={newEmployee.position} onChange={e => setNewEmployee({...newEmployee, position: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-transparent" required />
          <input type="text" placeholder="Department (optional)" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
          <input type="password" placeholder="Password (default: emp123)" value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl" />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition">Add Member</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'task'} onClose={closeModal} title="Assign New Task">
        <form onSubmit={handleAssignTask} className="space-y-5">
          <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-600" required />
          <textarea placeholder="Description (optional)" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} rows="3" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-600"></textarea>
          <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl" required>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
          </select>
          <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-slate-300 rounded-xl" required />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 py-3 border border-slate-300 rounded-xl hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:shadow-lg">Assign Task</button>
          </div>
        </form>
      </Modal>

      <LargeModal isOpen={showModal && modalType === 'taskLogs'} onClose={closeModal} title={`Task Logs – ${selectedEmployee?.full_name}`}>
        {renderTaskLogs()}
      </LargeModal>
    </div>
  );
};

export default ManagerDashboard;