// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Bar, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// const Modal = React.memo(({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full border-2 border-slate-200 shadow-2xl overflow-hidden">
//         <div className="p-6 border-b border-slate-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-bold text-slate-900">{title}</h3>
//             <button
//               onClick={onClose}
//               className="text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// });

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // State
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const [managers, setManagers] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [taskLogs, setTaskLogs] = useState([]);
//   const [taskStats, setTaskStats] = useState({
//     total_tasks: 0,
//     new_tasks: 0,
//     accepted_tasks: 0,
//     completed_tasks: 0,
//     failed_tasks: 0,
//     high_priority: 0,
//     medium_priority: 0,
//     low_priority: 0,
//   });

//   const [newManager, setNewManager] = useState({
//     name: '',
//     email: '',
//     department: '',
//     password: '',
//   });

//   const [newEmployee, setNewEmployee] = useState({
//     name: '',
//     email: '',
//     position: '',
//     managerId: '',
//     password: '',
//   });

//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     priority: 'medium',
//     due_date: '',
//     assigned_to: '',
//   });

//   // Fetch data
//   useEffect(() => {
//     if (user?.organization_id) fetchAllData();
//   }, [user?.organization_id]);

//   const fetchAllData = async () => {
//     if (!user?.organization_id) return;
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchManagers(),
//         fetchEmployees(),
//         fetchAllTasks(),
//         fetchTaskLogs(),
//         fetchTaskStats(),
//       ]);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchManagers = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/users/managers/${user.organization_id}`);
//       const data = res.data?.managers || res.data || [];
//       setManagers(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       setManagers([]);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/users/employees/${user.organization_id}`);
//       setEmployees(res.data?.employees || []);
//     } catch (e) {
//       console.error(e);
//       setEmployees([]);
//     }
//   };

//   const fetchAllTasks = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/tasks/organization/${user.organization_id}`);
//       setTasks(res.data.tasks || []);
//     } catch (e) {
//       console.error(e);
//       setTasks([]);
//     }
//   };

//   const fetchTaskLogs = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/tasks/logs/organization/${user.organization_id}`);
//       setTaskLogs(res.data.logs || []);
//     } catch (e) {
//       console.error(e);
//       setTaskLogs([]);
//     }
//   };

//   const fetchTaskStats = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/tasks/stats/organization/${user.organization_id}`);
//       const s = res.data.stats;
//       setTaskStats({
//         total_tasks: parseInt(s.total_tasks) || 0,
//         new_tasks: parseInt(s.new_tasks) || 0,
//         accepted_tasks: parseInt(s.accepted_tasks) || 0,
//         completed人心: parseInt(s.completed_tasks) || 0,
//         failed_tasks: parseInt(s.failed_tasks) || 0,
//         high_priority: parseInt(s.high_priority) || 0,
//         medium_priority: parseInt(s.medium_priority) || 0,
//         low_priority: parseInt(s.low_priority) || 0,
//       });
//     } catch (e) {
//       console.error(e);
//       setTaskStats({
//         total_tasks: 0,
//         new_tasks: 0,
//         accepted_tasks: 0,
//         completed_tasks: 0,
//         failed_tasks: 0,
//         high_priority: 0,
//         medium_priority: 0,
//         low_priority: 0,
//       });
//     }
//   };

//   const refreshData = async () => {
//     setRefreshing(true);
//     await fetchAllData();
//     setRefreshing(false);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleCreateManager = async () => {
//     if (!newManager.name || !newManager.email || !newManager.department) {
//       alert('Please fill all manager fields');
//       return;
//     }
//     try {
//       await axios.post(`${baseURL}/users/create-manager`, {
//         full_name: newManager.name,
//         email: newManager.email,
//         department: newManager.department,
//         password: newManager.password || 'manager123',
//         organization_id: user.organization_id,
//       });
//       alert('Manager created successfully!');
//       setNewManager({ name: '', email: '', department: '', password: '' });
//       closeModal();
//       await fetchManagers();
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to create manager');
//     }
//   };

//   const handleCreateEmployee = async (e) => {
//     e.preventDefault();
//     if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.managerId) {
//       alert('Please fill all employee fields');
//       return;
//     }
//     try {
//       await axios.post(`${baseURL}/users/create-employee`, {
//         full_name: newEmployee.name,
//         email: newEmployee.email,
//         position: newEmployee.position,
//         manager_id: newEmployee.managerId,
//         password: newEmployee.password || 'emp123',
//         organization_id: user.organization_id,
//       });
//       alert('Employee created successfully!');
//       setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
//       setShowModal(false);
//       await fetchEmployees();
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to create employee');
//     }
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     if (!newTask.title || !newTask.due_date || !newTask.assigned_to) {
//       alert('Please fill required task fields');
//       return;
//     }
//     try {
//       await axios.post(`${baseURL}/tasks/assign`, {
//         title: newTask.title,
//         description: newTask.description,
//         priority: newTask.priority,
//         due_date: newTask.due_date,
//         assigned_by: user.id,
//         assigned_to: newTask.assigned_to,
//         organization_id: user.organization_id,
//       });
//       alert('Task created successfully!');
//       setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
//       setShowModal(false);
//       await fetchAllTasks();
//       await fetchTaskStats();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to create task');
//     }
//   };

//   const deleteTask = async (taskId) => {
//     if (!window.confirm('Delete this task?')) return;
//     try {
//       await axios.delete(`${baseURL}/tasks/${taskId}`, {
//         data: { manager_id: user.id },
//       });
//       alert('Task deleted');
//       await fetchAllTasks();
//       await fetchTaskStats();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete task');
//     }
//   };

//   const openModal = (type) => {
//     setModalType(type);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setModalType('');
//     setNewManager({ name: '', email: '', department: '', password: '' });
//     setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
//     setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
//   };

//   // Stats
//   const totalUsers = managers.length + employees.length;
//   const activeTasks = taskStats.new_tasks + taskStats.accepted_tasks;

//   // Chart data
//   const taskStatusData = {
//     labels: ['New', 'Accepted', 'Completed', 'Failed'],
//     datasets: [
//       {
//         data: [
//           taskStats.new_tasks,
//           taskStats.accepted_tasks,
//           taskStats.completed_tasks,
//           taskStats.failed_tasks,
//         ],
//         backgroundColor: [
//           'rgba(99, 102, 241, 0.7)',
//           'rgba(251, 191, 36, 0.7)',
//           'rgba(34, 197, 94, 0.7)',
//           'rgba(239, 68, 68, 0.7)',
//         ],
//         borderColor: [
//           'rgba(99, 102, 241, 1)',
//           'rgba(251, 191, 36, 1)',
//           'rgba(34, 197, 94, 1)',
//           'rgba(239, 68, 68, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const taskPriorityData = {
//     labels: ['High', 'Medium', 'Low'],
//     datasets: [
//       {
//         data: [taskStats.high_priority, taskStats.medium_priority, taskStats.low_priority],
//         backgroundColor: [
//           'rgba(239, 68, 68, 0.7)',
//           'rgba(251, 191, 36, 0.7)',
//           'rgba(34, 197, 94, 0.7)',
//         ],
//         borderColor: [
//           'rgba(239, 68, 68, 1)',
//           'rgba(251, 191, 36, 1)',
//           'rgba(34, 197, 94, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const userDistributionData = {
//     labels: ['Managers', 'Employees'],
//     datasets: [
//       {
//         data: [managers.length, employees.length],
//         backgroundColor: ['rgba(139, 92, 246, 0.7)', 'rgba(6, 182, 212, 0.7)'],
//         borderColor: ['rgba(139, 92, 246, 1)', 'rgba(6, 182, 212, 1)'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // UI Components
//   const Header = () => (
//     <header className="bg-white border-b-2 border-slate-200 shadow-sm">
//       <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
//         <div className="flex items-center space-x-4">
//           <div className="w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//             <span
//               className="text-white font-black text-2xl"
//               style={{
//                 fontFamily:
//                   '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
//                 letterSpacing: '0.05em',
//               }}
//             >
//               N
//             </span>
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               {user?.organizationName || 'Organization'}
//             </h1>
//             <p className="text-slate-600">Admin Dashboard</p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-6">
//           <div className="hidden md:block text-right">
//             <p className="font-medium text-slate-900">{user?.name}</p>
//             <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );

//   const StatsCard = ({ title, value, icon, bgColor, subtitle, chart }) => (
//     <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start mb-3">
//         <div>
//           <p className="text-sm font-medium text-slate-600">{title}</p>
//           <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
//           {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
//         </div>
//         {icon && (
//           <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-white`}>
//             {icon}
//           </div>
//         )}
//       </div>
//       {chart && <div className="h-28">{chart}</div>}
//     </div>
//   );

//   const TabButton = ({ label, count, isActive, onClick }) => (
//     <button
//       onClick={onClick}
//       className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
//         isActive
//           ? 'bg-slate-900 text-white shadow-md'
//           : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50'
//       }`}
//     >
//       <span>{label}</span>
//       {count !== undefined && (
//         <span
//           className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//             isActive ? 'bg-white/20' : 'bg-slate-200 text-slate-700'
//           }`}
//         >
//           {count}
//         </span>
//       )}
//     </button>
//   );

//   const TaskStatusBadge = ({ status }) => {
//     const colors = {
//       new: 'bg-indigo-100 text-indigo-700',
//       accepted: 'bg-amber-100 text-amberseven-700',
//       completed: 'bg-green-100 text-green-700',
//       failed: 'bg-red-100 text-red-700',
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   const PriorityBadge = ({ priority }) => {
//     const colors = {
//       high: 'bg-red-100 text-red-700',
//       medium: 'bg-amber-100 text-amber-700',
//       low: 'bg-green-100 text-green-700',
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
//         {priority.charAt(0).toUpperCase() + priority.slice(1)}
//       </span>
//     );
//   };

//   const LoadingSpinner = () => (
//     <div className="flex justify-center items-center py-12">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
//     </div>
//   );

//   const renderTabContent = () => {
//     if (loading) return <LoadingSpinner />;

//     switch (activeTab) {
//       case 'managers':
//         return renderManagers();
//       case 'employees':
//         return renderEmployees();
//       case 'tasks':
//         return renderTasks();
//       case 'logs':
//         return renderTaskLogs();
//       default:
//         return renderOverview();
//     }
//   };

//   const renderOverview = () => (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Users"
//           value={totalUsers}
//           icon={
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path

//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//           }
//           bgColor="bg-violet-600"
//           subtitle={`${managers.length} managers, ${employees.length} employees`}
//           chart={<Pie data={userDistributionData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}
//         />
//         <StatsCard
//           title="Total Tasks"
//           value={taskStats.total_tasks}
//           icon={
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//           }
//           bgColor="bg-purple-600"
//           subtitle={`${taskStats.completed_tasks} completed, ${taskStats.failed_tasks} failed`}
//           chart={<Pie data={taskStatusData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}
//         />
//         <StatsCard
//           title="Active Tasks"
//           value={activeTasks}
//           icon={
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           }
//           bgColor="bg-amber-600"
//           subtitle={`${taskStats.new_tasks} new, ${taskStats.accepted_tasks} in progress`}
//         />
//         <StatsCard
//           title="Task Priority"
//           value=""
//           icon={
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
//               />
//             </svg>
//           }
//           bgColor="bg-slate-600"
//           subtitle={
//             <div className="flex justify-between text-xs mt-2 space-x-2">
//               <span className="text-red-600">High: {taskStats.high_priority}</span>
//               <span className="text-amber-600">Med: {taskStats.medium_priority}</span>
//               <span className="text-green-600">Low: {taskStats.low_priority}</span>
//             </div>
//           }
//           chart={<Bar data={taskPriorityData} options={{ plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } }, maintainAspectRatio: false }} />}
//         />
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             Quick Actions
//           </h3>
//           <div className="space-y-3">
//             <button
//               onClick={() => openModal('manager')}
//               className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Manager
//             </button>
//             <button
//               onClick={() => openModal('employee')}
//               disabled={managers.length === 0}
//               className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
//                 managers.length === 0
//                   ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Employee
//             </button>
//             <button
//               onClick={() => openModal('task')}
//               disabled={employees.length === 0}
//               className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
//                 employees.length === 0
//                   ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                   : 'bg-purple-600 hover:bg-purple-700 text-white'
//               }`}
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Create Task
//             </button>
//           </div>
//         </div>

//         {/* Recent Tasks */}
//         <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               Recent Tasks ({tasks.length})
//             </h3>
//             <button
//               onClick={() => setActiveTab('tasks')}
//               className="text-violet-600 hover:text-violet-700 text-sm font-medium"
//             >
//               View All
//             </button>
//           </div>

//           {tasks.length === 0 ? (
//             <div className="text-center py-8 text-slate-500">
//               <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               No tasks yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="border-b border-slate-200">
//                     <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned To</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-600">Priority</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-600">Due</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tasks.slice(0, 5).map((t) => (
//                     <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="py-3 px-4 font-medium text-slate-900">{t.title}</td>
//                       <td className="py-3 px-4 text-slate-700">{t.assigned_to_name}</td>
//                       <td className="py-3 px-4"><PriorityBadge priority={t.priority} /></td>
//                       <td className="py-3 px-4"><TaskStatusBadge status={t.status} /></td>
//                       <td className="py-3 px-4 text-slate-600">
//                         {new Date(t.due_date).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             Recent Activity
//           </h3>
//           <button
//             onClick={() => setActiveTab('logs')}
//             className="text-violet-600 hover:text-violet-700 text-sm font-medium"
//           >
//             View All
//           </button>
//         </div>

//         {taskLogs.length === 0 ? (
//           <p className="text-center py-8 text-slate-500">No activity yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {taskLogs.slice(0, 5).map((log) => (
//               <div key={log.id} className="border-b border-slate-100 pb-4 last:border-0">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium text-slate-900">
//                       {log.user_name} <span className="text-slate-500">({log.user_role})</span>
//                     </p>
//                     <p className="text-sm text-slate-600">{log.note}</p>
//                   </div>
//                   <div className="text-right text-xs">
//                     <p className="text-slate-500">
//                       {new Date(log.timestamp).toLocaleString()}
//                     </p>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         log.action === 'created'
//                           ? 'bg-indigo-100 text-indigo-700'
//                           : log.action === 'accepted'
//                           ? 'bg-amber-100 text-amber-700'
//                           : log.action === 'completed'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}
//                     >
//                       {log.action}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderManagers = () => (
//     <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <svg className="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           Managers ({managers.length})
//         </h3>
//         <button
//           onClick={() => openModal('manager')}
//           className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           <span>Add Manager</span>
//         </button>
//       </div>

//       {managers.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <p className="mb-4">No managers yet.</p>
//           <button
//             onClick={() => openModal('manager')}
//             className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium"
//           >
//             Create First Manager
//           </button>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b border-slate-200">
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Employees</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Tasks</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {managers.map((m) => {
//                 const empCount = employees.filter((e) => e.manager_id === m.id).length;
//                 const taskCount = tasks.filter((t) => t.assigned_by === m.id).length;
//                 return (
//                   <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
//                     <td className="py-3 px-4 font-medium text-slate-900">{m.full_name}</td>
//                     <td className="py-3 px-4 text-slate-700">{m.email}</td>
//                     <td className="py-3 px-4 text-slate-700">{m.department}</td>
//                     <td className="py-3 px-4">
//                       <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
//                         {empCount}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
//                         {taskCount}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
//                         Active
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   const renderEmployees = () => (
//     <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//           </svg>
//           Employees ({employees.length})
//         </h3>
//         <button
//           onClick={() => openModal('employee')}
//           disabled={managers.length === 0}
//           className={`px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
//             managers.length === 0
//               ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//               : 'bg-green-600 hover:bg-green-700 text-white'
//           }`}
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           <span>Add Employee</span>
//         </button>
//       </div>

//       {employees.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <p className="mb-4">No employees yet.</p>
//           {managers.length === 0 ? (
//             <p className="text-sm text-orange-600">Create a manager first.</p>
//           ) : (
//             <button
//               onClick={() => openModal('employee')}
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
//             >
//               Add First Employee
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b border-slate-200">
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Manager</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Tasks</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((e) => {
//                 const mgr = managers.find((m) => m.id === e.manager_id);
//                 const taskCount = tasks.filter((t) => t.assigned_to === e.id).length;
//                 return (
//                   <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
//                     <td className="py-3 px-4 font-medium text-slate-900">{e.full_name}</td>
//                     <td className="py-3 px-4 text-slate-700">{e.email}</td>
//                     <td className="py-3 px-4 text-slate-700">{e.position}</td>
//                     <td className="py-3 px-4 text-slate-700">
//                       {mgr ? `${mgr.full_name} (${mgr.department})` : '—'}
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
//                         {taskCount}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
//                         Active
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   const renderTasks = () => (
//     <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//           Tasks ({tasks.length})
//         </h3>
//         <button
//           onClick={() => openModal('task')}
//           disabled={employees.length === 0}
//           className={`px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
//             employees.length === 0
//               ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//               : 'bg-purple-600 hover:bg-purple-700 text-white'
//           }`}
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           <span>Create Task</span>
//         </button>
//       </div>

//       {tasks.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <p className="mb-4">No tasks yet.</p>
//           {employees.length === 0 ? (
//             <p className="text-sm text-orange-600">Add employees first.</p>
//           ) : (
//             <button
//               onClick={() => openModal('task')}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium"
//             >
//               Create First Task
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b border-slate-200">
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Description</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned To</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned By</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Priority</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Due</th>
//                 <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((t) => {
//                 const assignedBy = managers.find((m) => m.id === t.assigned_by) ||
//                                   employees.find((e) => e.id === t.assigned_by);
//                 return (
//                   <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
//                     <td className="py-3 px-4 font-medium text-slate-900">{t.title}</td>
//                     <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{t.description}</td>
//                     <td className="py-3 px-4 text-slate-700">{t.assigned_to_name}</td>
//                     <td className="py-3 px-4 text-slate-700">
//                       {assignedBy?.full_name || '—'}
//                     </td>
//                     <td className="py-3 px-4"><PriorityBadge priority={t.priority} /></td>
//                     <td className="py-3 px-4"><TaskStatusBadge status={t.status} /></td>
//                     <td className="py-3 px-4 text-slate-600">
//                       {new Date(t.due_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4">
//                       <button
//                         onClick={() => deleteTask(t.id)}
//                         className="text-red-600 hover:text-red-700 text-sm font-medium"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   const renderTaskLogs = () => (
//     <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           Activity Logs ({taskLogs.length})
//         </h3>
//         <button
//           onClick={refreshData}
//           disabled={refreshing}
//           className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium flex items-center space-x-2"
//         >
//           <svg
//             className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//           <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//         </button>
//       </div>

//       {taskLogs.length === 0 ? (
//         <p className="text-center py-12 text-slate-500">No logs yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {taskLogs.map((log) => (
//             <div key={log.id} className="border-b border-slate-100 pb-4 last:border-0">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium text-slate-900">
//                     {log.user_name} <span className="text-slate-500">({log.user_role})</span>
//                   </p>
//                   <p className="text-sm text-slate-600">
//                     <span className="font-medium">Task:</span> {log.task_title} ({log.task_priority})
//                   </p>
//                   <p className="text-sm text-slate-600">{log.note}</p>
//                 </div>
//                 <div className="text-right text-xs">
//                   <p className="text-slate-500">
//                     {new Date(log.timestamp).toLocaleString()}
//                   </p>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       log.action === 'created'
//                         ? 'bg-indigo-100 text-indigo-700'
//                         : log.action === 'accepted'
//                         ? 'bg-amber-100 text-amber-700'
//                         : log.action === 'completed'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}
//                   >
//                     {log.action}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <Header />

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-slate-900 mb-2">
//             Welcome, {user?.full_name?.split(' ')[0] || 'Admin'}
//           </h1>
//           <p className="text-slate-600 text-xl">Manage your organization with ease.</p>
//         </div>

//         <div className="flex flex-wrap gap-3 mb-8">
//           <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
//           <TabButton id="managers" label="Managers" count={managers.length} isActive={activeTab === 'managers'} onClick={() => setActiveTab('managers')} />
//           <TabButton id="employees" label="Employees" count={employees.length} isActive={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
//           <TabButton id="tasks" label="Tasks" count={tasks.length} isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
//           <TabButton id="logs" label="Activity Logs" count={taskLogs.length} isActive={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
//         </div>

//         <div>{renderTabContent()}</div>
//       </div>

//       {/* Modals */}
//       <Modal isOpen={showModal && modalType === 'manager'} onClose={closeModal} title="Add New Manager">
//         <div className="space-y-4">
//           {['name', 'email', 'department'].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 {field === 'name' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//               <input
//                 type={field === 'email' ? 'email' : 'text'}
//                 value={newManager[field]}
//                 onChange={(e) => setNewManager((p) => ({ ...p, [field]: e.target.value }))}
//                 className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//                 required
//               />
//             </div>
//           ))}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Password (optional)</label>
//             <input
//               type="password"
//               value={newManager.password}
//               onChange={(e) => setNewManager((p) => ({ ...p, password: e.target.value }))}
//               placeholder="Leave blank for default"
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//             />
//           </div>
//           <div className="flex space-x-3 pt-4">
//             <button onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
//               Cancel
//             </button>
//             <button onClick={handleCreateManager} className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
//               Create Manager
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Modal isOpen={showModal && modalType === 'employee'} onClose={closeModal} title="Add New Employee">
//         <form onSubmit={handleCreateEmployee} className="space-y-4">
//           {['name', 'email', 'position'].map((field) => (
//             <div key={field}>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//               <input
//                 type={field === 'email' ? 'email' : 'text'}
//                 value={newEmployee[field]}
//                 onChange={(e) => setNewEmployee((p) => ({ ...p, [field]: e.target.value }))}
//                 className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//                 required
//               />
//             </div>
//           ))}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Manager</label>
//             <select
//               value={newEmployee.managerId}
//               onChange={(e) => setNewEmployee((p) => ({ ...p, managerId: e.target.value }))}
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//               required
//             >
//               <option value="">Select Manager</option>
//               {managers.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.full_name} – {m.department}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Password (optional)</label>
//             <input
//               type="password"
//               value={newEmployee.password}
//               onChange={(e) => setNewEmployee((p) => ({ ...p, password: e.target.value }))}
//               placeholder="Leave blank for default"
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//             />
//           </div>
//           <div className="flex space-x-3 pt-4">
//             <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
//               Cancel
//             </button>
//             <button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
//               Create Employee
//             </button>
//           </div>
//         </form>
//       </Modal>

//       <Modal isOpen={showModal && modalType === 'task'} onClose={closeModal} title="Create New Task">
//         <form onSubmit={handleCreateTask} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
//             <input
//               type="text"
//               value={newTask.title}
//               onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
//             <textarea
//               value={newTask.description}
//               onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
//               rows="3"
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Priority *</label>
//             <select
//               value={newTask.priority}
//               onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//               required
//             >
//               <option value="high">High</option>
//               <option value="medium">Medium</option>
//               <option value="low">Low</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Assign To *</label>
//             <select
//               value={newTask.assigned_to}
//               onChange={(e) => setNewTask((p) => ({ ...p, assigned_to: e.target.value }))}
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//               required
//             >
//               <option value="">Select Employee</option>
//               {employees.map((e) => (
//                 <option key={e.id} value={e.id}>
//                   {e.full_name} ({e.position})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
//             <input
//               type="date"
//               value={newTask.due_date}
//               onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))}
//               className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
//               required
//             />
//           </div>
//           <div className="flex space-x-3 pt-4">
//             <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
//               Cancel
//             </button>
//             <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
//               Create Task
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;













































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Import shared components
import {
  Header,
  Modal,
  StatsCard,
  TabButton,
  PriorityBadge,
  StatusBadge,
  LoadingSpinner,
} from '../common';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    low_priority: 0,
  });

  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    managerId: '',
    password: '',
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
  });

  // Fetch data
  useEffect(() => {
    if (user?.organization_id) fetchAllData();
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
        fetchTaskStats(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${baseURL}/users/managers/${user.organization_id}`);
      const data = res.data?.managers || res.data || [];
      setManagers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setManagers([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${baseURL}/users/employees/${user.organization_id}`);
      setEmployees(res.data?.employees || []);
    } catch (e) {
      console.error(e);
      setEmployees([]);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${baseURL}/tasks/organization/${user.organization_id}`);
      setTasks(res.data.tasks || []);
    } catch (e) {
      console.error(e);
      setTasks([]);
    }
  };

  const fetchTaskLogs = async () => {
    try {
      const res = await axios.get(`${baseURL}/tasks/logs/organization/${user.organization_id}`);
      setTaskLogs(res.data.logs || []);
    } catch (e) {
      console.error(e);
      setTaskLogs([]);
    }
  };

  const fetchTaskStats = async () => {
    try {
      const res = await axios.get(`${baseURL}/tasks/stats/organization/${user.organization_id}`);
      const s = res.data.stats;
      setTaskStats({
        total_tasks: parseInt(s.total_tasks) || 0,
        new_tasks: parseInt(s.new_tasks) || 0,
        accepted_tasks: parseInt(s.accepted_tasks) || 0,
        completed_tasks: parseInt(s.completed_tasks) || 0,
        failed_tasks: parseInt(s.failed_tasks) || 0,
        high_priority: parseInt(s.high_priority) || 0,
        medium_priority: parseInt(s.medium_priority) || 0,
        low_priority: parseInt(s.low_priority) || 0,
      });
    } catch (e) {
      console.error(e);
      setTaskStats({
        total_tasks: 0,
        new_tasks: 0,
        accepted_tasks: 0,
        completed_tasks: 0,
        failed_tasks: 0,
        high_priority: 0,
        medium_priority: 0,
        low_priority: 0,
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
      alert('Please fill all manager fields');
      return;
    }
    try {
      await axios.post(`${baseURL}/users/create-manager`, {
        full_name: newManager.name,
        email: newManager.email,
        department: newManager.department,
        password: newManager.password || 'manager123',
        organization_id: user.organization_id,
      });
      alert('Manager created successfully!');
      setNewManager({ name: '', email: '', department: '', password: '' });
      closeModal();
      await fetchManagers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create manager');
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.managerId) {
      alert('Please fill all employee fields');
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
      alert(err.response?.data?.error || 'Failed to create employee');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.due_date || !newTask.assigned_to) {
      alert('Please fill required task fields');
      return;
    }
    try {
      await axios.post(`${baseURL}/tasks/assign`, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        due_date: newTask.due_date,
        assigned_by: user.id,
        assigned_to: newTask.assigned_to,
        organization_id: user.organization_id,
      });
      alert('Task created successfully!');
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' });
      setShowModal(false);
      await fetchAllTasks();
      await fetchTaskStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${baseURL}/tasks/${taskId}`, {
        data: { manager_id: user.id },
      });
      alert('Task deleted');
      await fetchAllTasks();
      await fetchTaskStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

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

  // Stats
  const totalUsers = managers.length + employees.length;
  const activeTasks = taskStats.new_tasks + taskStats.accepted_tasks;

  // Chart data
  const taskStatusData = {
    labels: ['New', 'Accepted', 'Completed', 'Failed'],
    datasets: [
      {
        data: [
          taskStats.new_tasks,
          taskStats.accepted_tasks,
          taskStats.completed_tasks,
          taskStats.failed_tasks,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
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
          'rgba(251, 191, 36, 0.7)',
          'rgba(34, 197, 94, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)',
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
        backgroundColor: ['rgba(139, 92, 246, 0.7)', 'rgba(6, 182, 212, 0.7)'],
        borderColor: ['rgba(139, 92, 246, 1)', 'rgba(6, 182, 212, 1)'],
        borderWidth: 1,
      },
    ],
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          bgColor="bg-violet-600"
          subtitle={`${managers.length} managers, ${employees.length} employees`}
          chart={<Pie data={userDistributionData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}
        />
        <StatsCard
          title="Total Tasks"
          value={taskStats.total_tasks}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          bgColor="bg-purple-600"
          subtitle={`${taskStats.completed_tasks} completed, ${taskStats.failed_tasks} failed`}
          chart={<Pie data={taskStatusData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}
        />
        <StatsCard
          title="Active Tasks"
          value={activeTasks}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          bgColor="bg-amber-600"
          subtitle={`${taskStats.new_tasks} new, ${taskStats.accepted_tasks} in progress`}
        />
        <StatsCard
          title="Task Priority"
          value=""
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          }
          bgColor="bg-slate-600"
          subtitle={
            <div className="flex justify-between text-xs mt-2 space-x-2">
              <span className="text-red-600">High: {taskStats.high_priority}</span>
              <span className="text-amber-600">Med: {taskStats.medium_priority}</span>
              <span className="text-green-600">Low: {taskStats.low_priority}</span>
            </div>
          }
          chart={<Bar data={taskPriorityData} options={{ plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } }, maintainAspectRatio: false }} />}
        />
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('manager')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Manager
            </button>
            <button
              onClick={() => openModal('employee')}
              disabled={managers.length === 0}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                managers.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </button>
            <button
              onClick={() => openModal('task')}
              disabled={employees.length === 0}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                employees.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Task
            </button>
          </div>
        </div>
        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Tasks ({tasks.length})
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-violet-600 hover:text-violet-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              No tasks yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{t.title}</td>
                      <td className="py-3 px-4 text-slate-700">{t.assigned_to_name}</td>
                      <td className="py-3 px-4"><PriorityBadge priority={t.priority} /></td>
                      <td className="py-3 px-4"><StatusBadge status={t.status} /></td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(t.due_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Recent Activity
          </h3>
          <button
            onClick={() => setActiveTab('logs')}
            className="text-violet-600 hover:text-violet-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        {taskLogs.length === 0 ? (
          <p className="text-center py-8 text-slate-500">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {taskLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">
                      {log.user_name} <span className="text-slate-500">({log.user_role})</span>
                    </p>
                    <p className="text-sm text-slate-600">{log.note}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <StatusBadge status={log.action} />
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
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Managers ({managers.length})
        </h3>
        <button
          onClick={() => openModal('manager')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Manager</span>
        </button>
      </div>
      {managers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="mb-4">No managers yet.</p>
          <button
            onClick={() => openModal('manager')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium"
          >
            Create First Manager
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => {
                const empCount = employees.filter((e) => e.manager_id === m.id).length;
                const taskCount = tasks.filter((t) => t.assigned_by === m.id).length;
                return (
                  <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{m.full_name}</td>
                    <td className="py-3 px-4 text-slate-700">{m.email}</td>
                    <td className="py-3 px-4 text-slate-700">{m.department}</td>
                    <td className="py-3 px-4">
                      <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
                        {empCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {taskCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
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
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Employees ({employees.length})
        </h3>
        <button
          onClick={() => openModal('employee')}
          disabled={managers.length === 0}
          className={`px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
            managers.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Employee</span>
        </button>
      </div>
      {employees.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="mb-4">No employees yet.</p>
          {managers.length === 0 ? (
            <p className="text-sm text-orange-600">Create a manager first.</p>
          ) : (
            <button
              onClick={() => openModal('employee')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Add First Employee
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Position</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Manager</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const mgr = managers.find((m) => m.id === e.manager_id);
                const taskCount = tasks.filter((t) => t.assigned_to === e.id).length;
                return (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{e.full_name}</td>
                    <td className="py-3 px-4 text-slate-700">{e.email}</td>
                    <td className="py-3 px-4 text-slate-700">{e.position}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {mgr ? `${mgr.full_name} (${mgr.department})` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {taskCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
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
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Tasks ({tasks.length})
        </h3>
        <button
          onClick={() => openModal('task')}
          disabled={employees.length === 0}
          className={`px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
            employees.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="mb-4">No tasks yet.</p>
          {employees.length === 0 ? (
            <p className="text-sm text-orange-600">Add employees first.</p>
          ) : (
            <button
              onClick={() => openModal('task')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Assigned By</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Due</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const assignedBy = managers.find((m) => m.id === t.assigned_by) ||
                                  employees.find((e) => e.id === t.assigned_by);
                return (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{t.title}</td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{t.description}</td>
                    <td className="py-3 px-4 text-slate-700">{t.assigned_to_name}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {assignedBy?.full_name || '—'}
                    </td>
                    <td className="py-3 px-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3 px-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(t.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
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
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Activity Logs ({taskLogs.length})
        </h3>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium flex items-center space-x-2"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      {taskLogs.length === 0 ? (
        <p className="text-center py-12 text-slate-500">No logs yet.</p>
      ) : (
        <div className="space-y-4">
          {taskLogs.map((log) => (
            <div key={log.id} className="border-b border-slate-100 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">
                    {log.user_name} <span className="text-slate-500">({log.user_role})</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Task:</span> {log.task_title} ({log.task_priority})
                  </p>
                  <p className="text-sm text-slate-600">{log.note}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <StatusBadge status={log.action} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header user={user} onLogout={handleLogout} subtitle="Admin Dashboard" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome, {user?.full_name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-slate-600 text-xl">Manage your organization with ease.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton label="Managers" count={managers.length} isActive={activeTab === 'managers'} onClick={() => setActiveTab('managers')} />
          <TabButton label="Employees" count={employees.length} isActive={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <TabButton label="Tasks" count={tasks.length} isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <TabButton label="Activity Logs" count={taskLogs.length} isActive={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        </div>

        <div>{renderTabContent()}</div>
      </div>

      {/* Modals */}
      <Modal isOpen={showModal && modalType === 'manager'} onClose={closeModal} title="Add New Manager">
        <div className="space-y-4">
          {['name', 'email', 'department'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field === 'name' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={newManager[field]}
                onChange={(e) => setNewManager((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password (optional)</label>
            <input
              type="password"
              value={newManager.password}
              onChange={(e) => setNewManager((p) => ({ ...p, password: e.target.value }))}
              placeholder="Leave blank for default"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleCreateManager} className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
              Create Manager
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showModal && modalType === 'employee'} onClose={closeModal} title="Add New Employee">
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          {['name', 'email', 'position'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={newEmployee[field]}
                onChange={(e) => setNewEmployee((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Manager</label>
            <select
              value={newEmployee.managerId}
              onChange={(e) => setNewEmployee((p) => ({ ...p, managerId: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              required
            >
              <option value="">Select Manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} – {m.department}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password (optional)</label>
            <input
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee((p) => ({ ...p, password: e.target.value }))}
              placeholder="Leave blank for default"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              Create Employee
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModal && modalType === 'task'} onClose={closeModal} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
              rows="3"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority *</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              required
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign To *</label>
            <select
              value={newTask.assigned_to}
              onChange={(e) => setNewTask((p) => ({ ...p, assigned_to: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name} ({e.position})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;