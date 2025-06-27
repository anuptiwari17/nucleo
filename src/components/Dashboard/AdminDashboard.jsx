import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


// Header Component
const Header = ({ onLogout, user }) => (
  <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-800">Nucleo</h1>
          <p className="text-sm text-gray-600">{user?.organizationName}</p>
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

const AdminDashboard = ({ managers = [],employees = [], onCreateManager, onCreateEmployee }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [activeTab, setActiveTab] = React.useState('overview');
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');

  const [newManager, setNewManager] = React.useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });

  const [newEmployee, setNewEmployee] = React.useState({
    name: '',
    email: '',
    position: '',
    managerId: '',
    password: ''
  });

  const [tasks] = React.useState([
    { id: 1, title: "Complete Project Documentation", priority: "High", assignedTo: "John Doe", status: "active", dueDate: "2025-06-30", managerId: 2 },
    { id: 2, title: "Review Code Changes", priority: "Medium", assignedTo: "Jane Smith", status: "completed", dueDate: "2025-06-28", managerId: 2 },
    { id: 3, title: "Implement User Authentication", priority: "High", assignedTo: "John Doe", status: "active", dueDate: "2025-07-05", managerId: 3 },
    { id: 4, title: "Database Optimization", priority: "Medium", assignedTo: "Jane Smith", status: "failed", dueDate: "2025-07-02", managerId: 3 }
  ]);



  const handleCreateManager = async () => {
  if (!newManager.name || !newManager.email || !newManager.department) {
    alert("Please fill in all manager fields");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/users/create-manager", {
      full_name: newManager.name,
      email: newManager.email,
      department: newManager.department,
      password: newManager.password || "manager123",
      organization_id: user.organization_id, // comes from useAuth
    });

    alert("✅ Manager created successfully!");
    setNewManager({ name: '', email: '', department: '', password: '' });
    closeModal();

  } catch (err) {
    console.error("Error creating manager:", err);
    alert("❌ Failed to create manager");
  }
};


 const handleCreateEmployee = async (e) => {
  e.preventDefault();

  if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.managerId) {
    alert('⚠️ Please fill all the fields!');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/users/create-employee', {
      full_name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      manager_id: newEmployee.managerId,
      password: newEmployee.password || 'emp123',
      organization_id: user.organization_id, // from context
    });

    alert('✅ Employee created successfully!');
    setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
    setShowModal(false);
  } catch (err) {
    console.error('❌ Error creating employee:', err);
    if (err.response?.data?.error) {
      alert(`Error: ${err.response.data.error}`);
    } else {
      alert('Something went wrong while creating employee!');
    }
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
    setNewManager({ name: '', email: '', department: '', password: '' });
    setNewEmployee({ name: '', email: '', position: '', managerId: '', password: '' });
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;

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
      {label}
      {count !== undefined && (
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
      case 'managers':
        return renderManagers();
      case 'employees':
        return renderEmployees();
      default:
        return renderOverview();
    }
  };


  const renderOverview = () => (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal('manager')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Manager
            </button>
            <button
              onClick={() => openModal('employee')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Employee
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Task completed by John Doe</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New employee added</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Task assigned by Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Overview</h3>
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

  const renderManagers = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Managers</h3>
        <button
          onClick={() => openModal('manager')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Manager
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Employees</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {managers.map(manager => (
              <tr key={manager.id} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-800">{manager.name}</td>
                <td className="py-3 px-4 text-gray-600">{manager.email}</td>
                <td className="py-3 px-4 text-gray-600">{manager.department}</td>
                <td className="py-3 px-4 text-gray-600">
                  {employees.filter(emp => emp.managerId === manager.id).length}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Employees</h3>
        <button
          onClick={() => openModal('employee')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Employee
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Position</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Manager</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const manager = managers.find(m => m.id === employee.managerId);
              return (
                <tr key={employee.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{employee.name}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.email}</td>
                  <td className="py-3 px-4 text-gray-600">{employee.position}</td>
                  <td className="py-3 px-4 text-gray-600">{manager?.name || 'Unassigned'}</td>
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
     <Header onLogout={handleLogout} />

      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard 👑</h1>
          <p className="text-gray-600">Manage your organization, managers, and employees.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Managers"
            value={managers.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Total Employees"
            value={employees.length}
            color="text-green-600"
            bgColor="bg-green-100"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatsCard
            title="Completed Tasks"
            value={completedTasks}
            color="text-purple-600"
            bgColor="bg-purple-100"
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newManager.name}
              onChange={(e) => setNewManager({...newManager, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newManager.email}
              onChange={(e) => setNewManager({...newManager, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={newManager.department}
              onChange={(e) => setNewManager({...newManager, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={newManager.password}
              onChange={(e) => setNewManager({...newManager, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for default (manager123)"
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
              type="button"
              onClick={handleCreateManager}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Manager</label>
            <select
              value={newEmployee.managerId}
              onChange={(e) => setNewEmployee({...newEmployee, managerId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Manager</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} - {manager.department}
                </option>
              ))}
            </select>
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
              type="button"
              onClick={handleCreateEmployee}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Employee
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;