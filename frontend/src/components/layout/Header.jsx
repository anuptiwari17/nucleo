import React, { useState, useEffect } from 'react';

const Header = ({ onLogout, user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipientEmail, setChatRecipientEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const displayName = user?.full_name || user?.name || 'User';
  const displayRole = (user?.role || 'Employee').replace('_', ' ');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatRecipientEmail.trim() || !chatMessage.trim()) {
      alert('Please fill in both fields');
      return;
    }
    alert(`Message sent!\nTo: ${chatRecipientEmail}\nMessage: ${chatMessage}`);
    setChatRecipientEmail('');
    setChatMessage('');
    setShowChatModal(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">

            {/* Left: Logo + Role */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black tracking-tight">
                  <span
                    className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
                    style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}
                  >
                    Nucleo
                  </span>
                </h1>
              </div>

              <div className="hidden md:flex items-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {displayRole} Portal
                </span>
              </div>
            </div>

            {/* Right: Time + Actions */}
            <div className="flex items-center gap-6">

              {/* Clock */}
              <div className="hidden lg:block text-right">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="tabular-nums text-lg">{formatTime(currentTime)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{formatDate(currentTime)}</p>
              </div>

              {/* Messages Button */}
              <button
                onClick={() => setShowChatModal(true)}
                className="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                title="Messages"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.418-8 8-8s8 3.582 8 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Role Badge */}
          <div className="md:hidden mt-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {displayRole} Portal
            </span>
          </div>
        </div>
      </header>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Send Message</h3>
                <p className="text-slate-600 mt-1">Reach out to a team member</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={chatRecipientEmail}
                  onChange={(e) => setChatRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="colleague@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  rows="5"
                  placeholder="Type your message..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <p className="text-sm text-violet-800 text-center font-medium">
                Real-time chat coming soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;