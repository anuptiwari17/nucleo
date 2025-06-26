import React from 'react';

const Header = ({ userName = "Anup", userRole = "Employee", onLogout }) => {
  return (
    <>
      <div className="flex flex-col items-center mt-6 mb-4">
        <h1 className="text-4xl font-bold text-red-600 shadow-md border-b-2 border-red-300 pb-2">
          {userRole} Dashboard
        </h1>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-lg rounded-lg mx-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-medium">Hello 👋</h1>
            <p className="text-3xl text-gray-300 font-semibold">{userName}</p>
            <p className="text-sm text-gray-400">{userRole}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;