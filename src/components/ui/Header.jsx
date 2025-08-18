import React, { useState, useEffect } from 'react';

const Header = ({ userName = "Anup", userRole = "Employee", onLogout, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.full_name || userName;
  const displayRole = user?.role || userRole;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Section - User Info */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Avatar with Status Indicator */}
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-gray-900 rounded-full animate-pulse"></div>
            </div>
            
            {/* User Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium text-white/90">
                  {getGreeting()} 
                  <span className="ml-1">👋</span>
                </h1>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {displayName}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {displayRole}
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - Dashboard Title (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-1">
              {displayRole} Dashboard
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
          </div>
          
          {/* Right Section - Time & Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Time & Date Widget */}
            <div className="hidden md:flex flex-col items-end bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg tabular-nums">{formatTime(currentTime)}</span>
              </div>
              <span className="text-xs text-white/60 mt-1">{formatDate(currentTime)}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group">
              <svg className="w-5 h-5 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z M15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v2" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                3
              </span>
            </button>

            {/* User Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium">{displayName}</p>
                    <p className="text-white/60 text-sm">{user?.email || 'employee@company.com'}</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Button (Backup) */}
            <button 
              onClick={onLogout}
              className="hidden sm:flex bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 px-4 py-2.5 rounded-xl text-sm font-medium items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Dashboard Title */}
        <div className="lg:hidden mt-4 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            {displayRole} Dashboard
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mt-1"></div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default Header;