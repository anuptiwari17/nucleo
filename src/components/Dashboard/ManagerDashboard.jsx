import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';


// Mock Header component
const Header = ({ onLogout,user }) => (
  <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-800">Nucleo</h1>
          <p className="text-sm text-gray-600">{user?.department}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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

const ManagerDashboard = ({ onLogout, employees = [], onCreateEmployee, onAssignTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 


  const handleLogout = () => {
  logout(); 
  navigate('/login'); 
};



  const [activeTab, setActiveTab] = React.useState('overview');
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  
  // New Employee State
  const [newEmployee, setNewEmployee] = React.useState({
    name: '',
    email: '',
    position: '',
    password: ''
  });

  // New Task State
  const [newTask, setNewTask] = React.useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });

  // Mock Tasks Data
  const [tasks, setTasks] = React.useState([
    { id: 1, title: "Complete Project Documentation", priority: "High", assignedTo: "John Doe", status: "active", dueDate: "2025-06-30", createdBy: user?.id },
    { id: 2, title: "Review Code Changes", priority: "Medium", assignedTo: "Jane Smith", status: "completed", dueDate: "2025-06-28", createdBy: user?.id },
    { id: 3, title: "Setup Testing Environment", priority: "Low", assignedTo: "John Doe", status: "new", dueDate: "2025-07-02", createdBy: user?.id },
    { id: 4, title: "Database Schema Review", priority: "High", assignedTo: "Jane Smith", status: "failed", dueDate: "2025-06-26", createdBy: user?.id }
  ]);

  // Filter employees under this manager
  const myEmployees = employees.filter(emp => emp.managerId === user?.id);

  // Handle Create Employee
const handleCreateEmployee = async (e) => {
  e.preventDefault();
  console.log("e.preveD crossed!!");
  console.log("Yeh user hai,", user);



  if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
    alert("Please fill in all employee fields");
    return;
  }

  console.log("API call iske baad hogi")

  try {
    await axios.post("http://localhost:5000/api/users/create-employee", {
      full_name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      password: newEmployee.password || "emp123",
      manager_id: user.id,
      organization_id: user.organization_id, // comes from useAuth
    });

    alert("✅ Employee created successfully!");
    setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
    closeModal();

  } catch (err) {
    console.error("Error creating employee:", err);
    alert("❌ Failed to create employee");
  }
};


  const handleAssignTask = async (e) => {
  e.preventDefault();

  if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
    alert("❗Please fill all required fields");
    return;
  }

  const taskData = {
    title: newTask.title,
    description: newTask.description,
    priority: newTask.priority.toLowerCase(), // Make sure it's one of: low, medium, high
    due_date: newTask.dueDate,
    assigned_by: user.id,
    assigned_to: newTask.assignedTo,
    organization_id: user.organization_id,
  };

  try {
    const response = await axios.post("http://localhost:5000/api/tasks/assign", taskData);

    alert("✅ Task assigned successfully!");
    setTasks(prev => [...prev, response.data.task]); // use returned task
    closeModal();
  } catch (err) {
    console.error("🔥 Failed to assign task:", err.response?.data || err.message);
    alert("❌ Failed to assign task");
  }
};


  // Open Modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Close Modal  
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setNewEmployee({ name: '', email: '', position: '', password: '' });
    setNewTask({ title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: '' });
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;
  const newTasks = tasks.filter(t => t.status === 'new').length;

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

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('task')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Assign New Task
            </button>
            <button
              onClick={() => openModal('employee')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Team Member
            </button>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasks Completed</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Team Members</span>
              <span className="text-sm font-medium text-gray-800">{myEmployees.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Tasks</span>
              <span className="text-sm font-medium text-gray-800">{newTasks + activeTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Task</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map(task => (
                <tr key={task.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{task.title}</td>
                  <td className="py-3 px-4 text-gray-600">{task.assignedTo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'new' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMyTeam = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">My Team</h3>
        <button
          onClick={() => openModal('employee')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Team Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Position</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Active Tasks</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {myEmployees.map(employee => {
              const employeeTasks = tasks.filter(task => task.assignedTo === employee.name);
              const activeTasks = employeeTasks.filter(task => task.status === 'active' || task.status === 'new');
              return (
                <tr key={employee.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{employee.name}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.email}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.position}</td>
                  <td className="py-3 px-4 text-gray-600">{activeTasks.length}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">All Tasks</h3>
        <button
          onClick={() => openModal('task')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Assign Task
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Task</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned To</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-800">{task.title}</td>
                <td className="py-3 px-4 text-gray-600">{task.assignedTo}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'new' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manager Dashboard 👨‍💼</h1>
          <p className="text-gray-600">Manage your team and assign tasks effectively.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Team Members"
            value={myEmployees.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="New Tasks"
            value={newTasks}
            color="text-purple-600"
            bgColor="bg-purple-100"
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <StatsCard
            title="Active Tasks"
            value={activeTasks}
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
            value={completedTasks}
            color="text-green-600"
            bgColor="bg-green-100"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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
            count={myEmployees.length}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank for default (emp123)"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Team Member</option>
                {myEmployees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.position})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Task
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;