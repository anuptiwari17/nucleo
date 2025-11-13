import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './ui/Footer';

const LandingPage = () => {
  const [setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/30">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="group cursor-pointer">
                <h1 className="text-2xl font-black relative transition-all duration-300 group-hover:scale-105">
                  <span 
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}
                  >
                    Nucleo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-blue-400/20 
                              rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Features</a>
              <a href="#showcase" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Platform</a>
              <a href="#about" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">About</a>

              <Link 
                to="/pricing"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Pricing
              </Link>

            </div>

            
            
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 bg-violet-600 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700">Streamlined Employee Management</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Elevate Your Team
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Performance
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
            Enterprise-grade platform for managing teams, assigning tasks, and tracking progress with elegant simplicity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-base font-semibold text-slate-900 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-slate-200 hover:border-slate-300"
            >
              Explore Platform
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/40 to-blue-200/40 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-2 border-2 border-slate-200 shadow-2xl">
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                {/* Browser Chrome */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 max-w-md mx-4">
                    <div className="bg-white rounded-lg px-3 py-1.5 text-xs text-slate-500 font-medium border border-slate-200">
                      nucleo.app/dashboard
                    </div>
                  </div>
                  <div className="w-20"></div>
                </div>

                {/* Dashboard Content */}
                <div className="p-8 space-y-6 bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Welcome back, Jose</h3>
                      <p className="text-base text-slate-600">Here's your team overview</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">Jose Mourinho</p>
                        <p className="text-xs text-slate-600">Manager</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">JM</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      { label: "Team Members", value: "24", change: "+3 this week" },
                      { label: "Active Tasks", value: "34", change: "5 due today" },
                      { label: "Completed", value: "156", change: "94% rate" },
                      { label: "In Progress", value: "12", change: "On track" },
                      { label: "Overdue", value: "3", change: "Needs attention" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mb-1">{stat.label}</p>
                        <p className="text-xs text-slate-500">{stat.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-2 border-b border-slate-200">
                    {['Overview', 'Team', 'Tasks', 'Analytics'].map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={`px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-b-2 ${
                          activeTab === i
                            ? 'text-slate-900 border-slate-900'
                            : 'text-slate-500 border-transparent hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Content Grid */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    {/* Recent Activity */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        {[
                          { user: "Alice Johnson", action: "completed", task: "Q4 Report", time: "2m ago" },
                          { user: "John Smith", action: "started", task: "Database Migration", time: "15m ago" },
                          { user: "Bob Williams", action: "commented on", task: "UI Redesign", time: "1h ago" },
                          { user: "Sarah Davis", action: "submitted", task: "Marketing Plan", time: "2h ago" }
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center space-x-3 py-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-slate-700">{activity.user[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-900 truncate">
                                <span className="font-semibold">{activity.user}</span>
                                <span className="text-slate-600"> {activity.action} </span>
                                <span className="font-semibold">{activity.task}</span>
                              </p>
                              <p className="text-xs text-slate-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Task Distribution */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Task Distribution</h4>
                      <div className="space-y-4">
                        {[
                          { status: "Completed", count: 156, total: 211, color: "bg-green-500" },
                          { status: "In Progress", count: 34, total: 211, color: "bg-blue-500" },
                          { status: "Pending", count: 12, total: 211, color: "bg-yellow-500" },
                          { status: "Failed", count: 9, total: 211, color: "bg-red-500" }
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">{item.status}</span>
                              <span className="text-sm font-bold text-slate-900">{item.count}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${item.color} transition-all duration-500`}
                                style={{ width: `${(item.count / item.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="showcase" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">How It Works</h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to transform your workflow
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Setup Organization",
              description: "Create your workspace and invite team members. Configure roles and permissions in minutes."
            },
            {
              step: "2",
              title: "Assign & Track",
              description: "Managers create tasks, assign to team members, and monitor real-time progress seamlessly."
            },
            {
              step: "3",
              title: "Complete & Report",
              description: "Employees update status, mark completion, and provide detailed feedback on outcomes."
            }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <div className="text-sm font-bold text-violet-600 mb-2">Step {item.step}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
              {i < 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-300"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Powerful Features</h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need for complete team management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: "Task Management", 
              description: "Create, assign, and track tasks with real-time updates and detailed progress monitoring.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              )
            },
            { 
              title: "Team Control", 
              description: "Manage employees, roles, and permissions with secure authentication and access control.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            { 
              title: "Analytics", 
              description: "Comprehensive insights into performance, completion rates, and productivity metrics.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
            { 
              title: "Secure Access", 
              description: "Role-based permissions ensure data security across all organizational levels.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )
            },
            { 
              title: "Real-Time Sync", 
              description: "Instant updates and notifications keep everyone aligned and informed.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            { 
              title: "Responsive", 
              description: "Seamless experience across all devices and screen sizes.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About/CTA */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="relative bg-gradient-to-br from-violet-50 to-blue-50 rounded-3xl p-12 lg:p-16 border-2 border-slate-200">
          <div className="relative text-center max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-xl text-slate-700 mb-10 leading-relaxed">
              Join forward-thinking organizations using Nucleo to streamline operations, boost productivity, and achieve exceptional results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 text-base font-semibold text-slate-900 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-slate-200 hover:border-slate-300"
              onClick={()=> navigate("/demo")}>
                Schedule Demo
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-2">99.9%</div>
                <div className="text-sm font-medium text-slate-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-2">50K+</div>
                <div className="text-sm font-medium text-slate-600">Tasks Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-sm font-medium text-slate-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
    </div>
  );
};

export default LandingPage;