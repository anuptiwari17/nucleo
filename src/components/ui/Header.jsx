import React, { useState, useEffect } from 'react';

const Header = ({ onLogout, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipientEmail, setChatRecipientEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');

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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const displayName = user?.full_name || user?.name || 'User';
  const displayRole = user?.role || 'Employee';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatRecipientEmail.trim() || !chatMessage.trim()) {
      alert('Please fill in both recipient email and message');
      return;
    }

    // TODO: Implement actual message sending functionality
    alert(`Message functionality will be implemented soon!\n\nTo: ${chatRecipientEmail}\nMessage: ${chatMessage}`);
    
    // Reset form
    setChatRecipientEmail('');
    setChatMessage('');
    setShowChatModal(false);
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setChatRecipientEmail('');
    setChatMessage('');
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left Section - Brand & Role */}
            <div className="flex items-center space-x-6">
              {/* Brand Logo */}
              <div className="group">
                <h1 className="text-3xl font-black text-white tracking-wide relative transition-all duration-300 group-hover:scale-105">
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

              {/* Role Badge */}
              <div className="hidden md:flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  {displayRole} Dashboard
                </span>
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Time & Date Widget */}
              <div className="hidden lg:flex flex-col items-end bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-2 text-white font-semibold">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg tabular-nums">{formatTime(currentTime)}</span>
                </div>
                <span className="text-xs text-white/60 mt-1">{formatDate(currentTime)}</span>
              </div>

              {/* Chat/Messages Button */}
              <button 
                onClick={() => setShowChatModal(true)}
                className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 group hover:scale-105"
                title="Messages"
              >
                <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.418-8 8-8s8 3.582 8 8z" />
                </svg>
                {/* New message indicator (placeholder) */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                {/* Enhanced Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                
                {/* User Details */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white leading-tight">{displayName}</p>
                  <p className="text-xs text-white/60">{user?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={onLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Role Badge */}
          <div className="md:hidden mt-3 flex justify-center">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {displayRole} Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl max-w-md w-full border border-white/20 shadow-2xl shadow-purple-500/25">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Send Message</h3>
                  <p className="text-sm text-white/60 mt-1">Send a message to a team member</p>
                </div>
                <button
                  onClick={closeChatModal}
                  className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat Interface */}
              <div className="space-y-4 mb-6">
                {/* No messages placeholder */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.418-8 8-8s8 3.582 8 8z" />
                  </svg>
                  <p className="text-white/50 text-sm">No messages yet</p>
                  <p className="text-white/30 text-xs mt-1">Start a conversation below</p>
                </div>
              </div>

              {/* Message Form */}
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={chatRecipientEmail}
                    onChange={(e) => setChatRecipientEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                    placeholder="colleague@company.com"
                    required
                  />
                  <p className="text-xs text-white/50 mt-1">Enter email of someone from your organization</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 resize-none"
                    rows="4"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeChatModal}
                    className="flex-1 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </button>
                </div>
              </form>

              {/* Future Features Notice */}
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-xs text-blue-300 text-center">
                  💡 Real-time messaging features coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;