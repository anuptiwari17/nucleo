import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full opacity-25 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full opacity-20 blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-32 right-1/3 w-48 h-48 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full opacity-15 blur-3xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            
  <div className="group cursor-pointer">
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
  </div>
</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-white/80 hover:text-white font-medium transition-colors hover:scale-105 transform duration-200">Features</a>
            <a href="#showcase" className="text-white/80 hover:text-white font-medium transition-colors hover:scale-105 transform duration-200">Platform</a>
            <a href="#about" className="text-white/80 hover:text-white font-medium transition-colors hover:scale-105 transform duration-200">About</a>
          </div>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-white/90 hover:text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
  <div className="text-center">
    <div className="mb-6">
      <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 animate-bounce shadow-lg">
        🚀 Complete Employee Management Solution
      </span>
    </div>
    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
      Streamline Your{' '}
      <span className="relative">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Workflow
        </span>
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
      </span>
    </h2>
    <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
      A comprehensive platform for organizations to manage employees, assign tasks, 
      and track progress. Built for efficiency and simplicity.
    </p>
    <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
      <button 
        onClick={() => navigate('/signup')}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
      >
        Start Managing Today
      </button>
      <button 
        onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
        className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 hover:border-white/50 transform hover:scale-105"
      >
        Explore Features
      </button>
    </div>
    
    {/* Enhanced Dashboard Preview - Now Matches Actual Manager Dashboard */}
    <div className="relative max-w-6xl mx-auto">
      <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-purple-500/20">
        {/* Browser Header */}
        <div className="bg-slate-800/70 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 bg-slate-700/50">
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
            </div>
            <div className="text-white/60 text-sm font-mono">nucleo-dashboard.app/manager</div>
            <div className="w-8"></div>
          </div>
          
          {/* Dashboard Content - Matches Your Actual Manager Dashboard UI */}
          <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Header with User Info */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="-ml-20">
                <h3 className="text-2xl font-bold text-white">Welcome back, Jose!</h3> </div>
                <p className="text-white/60">Here's what's happening with your team today</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Jose Mourinho</p>
                  <p className="text-xs text-white/60">Manager</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">SJ</span>
                </div>
              </div>
            </div>
            
            {/* Stats Cards - Matches Your Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { title: "Team Members", value: "24", color: "text-blue-400", bg: "bg-blue-500/20", icon: "👥", trend: "+3" },
                { title: "New Tasks", value: "12", color: "text-purple-400", bg: "bg-purple-500/20", icon: "📝", trend: "+2" },
                { title: "Active Tasks", value: "34", color: "text-orange-400", bg: "bg-orange-500/20", icon: "🔄", trend: "5 due" },
                { title: "Completed", value: "156", color: "text-green-400", bg: "bg-green-500/20", icon: "✅", trend: "94%" },
                { title: "Failed", value: "9", color: "text-red-400", bg: "bg-red-500/20", icon: "❌", trend: "6%" }
              ].map((stat, i) => (
                <div key={i} className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:scale-105 transition-all duration-300 ${stat.bg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80 mb-1">{stat.title}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className="text-xl">{stat.icon}</div>
                  </div>
                  <p className="text-xs mt-1 text-white/60">{stat.trend}</p>
                </div>
              ))}
            </div>
            
            {/* Tabs Navigation - Matches Your Dashboard */}
            <div className="flex space-x-4 pt-4">
              {['Overview', 'My Team', 'All Tasks'].map((tab, i) => (
                <button 
                  key={i}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    i === 0 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 shadow-md'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Task Preview Section */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Assign New Task
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Team Member
                  </button>
                </div>
              </div>
              
              {/* Recent Tasks Table */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Tasks</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-medium text-white/80">Task</th>
                        <th className="text-left py-3 px-4 font-medium text-white/80">Assigned To</th>
                        <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { task: "Update customer database", employee: "John Smith", status: "In Progress", color: "blue" },
                        { task: "Fix login bug", employee: "Alice Johnson", status: "Completed", color: "green" },
                        { task: "Design new UI", employee: "Bob Williams", status: "New", color: "purple" },
                        { task: "Write documentation", employee: "Charlie Brown", status: "Failed", color: "red" }
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white">{item.task}</td>
                          <td className="py-3 px-4 text-white/80">{item.employee}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${item.color}-500/20 text-${item.color}-400`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Charts Preview */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Task Status</h4>
                <div className="h-48 flex items-center justify-center relative">
                  {/* Pie Chart Visualization */}
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1f2937" strokeWidth="2"></circle>
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="2" strokeDasharray="60 40" strokeDashoffset="0"></circle>
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="2" strokeDasharray="20 80" strokeDashoffset="-60"></circle>
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="2" strokeDasharray="15 85" strokeDashoffset="-80"></circle>
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 95" strokeDashoffset="-95"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">211</div>
                        <div className="text-xs text-white/60">Total</div>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="absolute right-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-white/80">Completed (156)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-white/80">In Progress (34)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-white/80">New (12)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-white/80">Failed (9)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Team Performance</h4>
                <div className="h-48 flex items-end justify-center space-x-2 px-4">
                  {/* Bar Chart */}
                  {[
                    { name: "John", value: 85, color: "bg-blue-500" },
                    { name: "Alice", value: 92, color: "bg-green-500" },
                    { name: "Bob", value: 78, color: "bg-purple-500" },
                    { name: "Charlie", value: 65, color: "bg-yellow-500" },
                    { name: "Diana", value: 88, color: "bg-pink-500" },
                    { name: "Eve", value: 95, color: "bg-indigo-500" }
                  ].map((member, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div className="text-xs text-white/80 font-medium">{member.value}%</div>
                      <div 
                        className={`w-8 ${member.color} rounded-t-md transition-all duration-1000 hover:opacity-80`}
                        style={{ height: `${(member.value * 120) / 100}px` }}
                      ></div>
                      <div className="text-xs text-white/60 transform rotate-45 origin-left mt-2">{member.name}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-white/60">Task completion rate by team member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements for Visual Interest */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-float-delay"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float-alt"></div>
      </div>
    </div>
  </div>
</section>

      {/* Platform Showcase */}
      <section id="showcase" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h3 className="text-5xl font-black text-white mb-6">How It Works</h3>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Simple workflow for organizations, managers, and employees
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              step: "01",
              title: "Organization Setup",
              description: "Create your organization account and set up your workspace. Add managers and define roles.",
              icon: "🏢",
              gradient: "from-purple-500 to-blue-500"
            },
            {
              step: "02", 
              title: "Manager Controls",
              description: "Managers can create employee accounts, assign tasks, and monitor progress in real-time.",
              icon: "👥",
              gradient: "from-pink-500 to-orange-500"
            },
            {
              step: "03",
              title: "Employee Workflow",
              description: "Employees receive tasks, update status, mark as completed or failed with detailed reasons.",
              icon: "✅",
              gradient: "from-emerald-500 to-cyan-500"
            }
          ].map((step, index) => (
            <div key={index} className="group relative">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 h-full">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center mb-4 mx-auto text-3xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {step.icon}
                  </div>
                  <div className="text-white/40 text-sm font-mono mb-2">STEP {step.step}</div>
                  <h4 className="text-2xl font-bold text-white mb-4">{step.title}</h4>
                </div>
                <p className="text-white/70 leading-relaxed text-center">{step.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h3 className="text-5xl font-black text-white mb-6">Core Features</h3>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Everything you need for comprehensive employee and task management
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "📋",
              title: "Task Management",
              description: "Create, assign, and track tasks with real-time status updates and progress monitoring",
              gradient: "from-purple-500 to-blue-500"
            },
            {
              icon: "👤",
              title: "Employee Management",
              description: "Manage employee accounts, roles, and permissions with secure authentication",
              gradient: "from-pink-500 to-orange-500"
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Monitor task completion rates, employee performance, and project timelines",
              gradient: "from-emerald-500 to-cyan-500"
            },
            {
              icon: "🔐",
              title: "Role-Based Access",
              description: "Secure role-based permissions for organizations, managers, and employees",
              gradient: "from-indigo-500 to-purple-500"
            },
            {
              icon: "⚡",
              title: "Real-Time Updates",
              description: "Instant notifications and live status updates across all user levels",
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              icon: "📱",
              title: "Responsive Design",
              description: "Works seamlessly across desktop, tablet, and mobile devices",
              gradient: "from-teal-500 to-green-500"
            }
          ].map((feature, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg group-hover:scale-110 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{feature.title}</h4>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-blue-600/30 backdrop-blur-lg rounded-3xl p-16 text-center border border-white/20 shadow-2xl shadow-purple-500/10">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
            
            <h3 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-8 tracking-tight">
              Transform Your Workforce
            </h3>
            
            <p className="text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Nucleo revolutionizes employee management with cutting-edge technology, 
              seamless workflows, and intelligent automation. Experience the future of 
              organizational efficiency with our comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h4 className="text-white text-xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Smart Management
              </h4>
              <p className="text-white/70 leading-relaxed">
                Intelligent task assignment, real-time progress tracking, and automated workflow optimization
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h4 className="text-white text-xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Lightning Fast
              </h4>
              <p className="text-white/70 leading-relaxed">
                Built with modern React architecture, delivering blazing-fast performance and seamless user experience
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🚀</div>
              <h4 className="text-white text-xl font-bold mb-4 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Enterprise Ready
              </h4>
              <p className="text-white/70 leading-relaxed">
                Complete role-based access control, secure authentication, and scalable architecture for any organization size
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-16 py-5 rounded-2xl text-xl font-bold transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                Get Started Free
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button className="group text-white/80 hover:text-white px-8 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                Watch Demo
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-white/10 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
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
              </div>
              
              <p className="text-white/60 leading-relaxed">
                A modern employee management platform built with passion and attention to detail.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#showcase" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Project</a></li>
                <li><button onClick={() => navigate('/signup')} className="hover:text-white transition-colors text-left">Get Started</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Start</h4>
              <ul className="space-y-2 text-white/60">
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button></li>
                <li><button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">Create Account</button></li>
                <li><a href="#showcase" className="hover:text-white transition-colors">Learn More</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60">© 2025 Nucleo Employee Management Platform. A personal development project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;