import React from 'react';

/**
 * Shared Header Component
 * Used across Admin, Manager, and Employee dashboards
 * 
 * @param {Object} props
 * @param {Function} props.onLogout - Logout handler
 * @param {Object} props.user - User object with name, role, etc.
 * @param {string} props.subtitle - Dashboard subtitle (e.g., "Admin Dashboard", "Employee Portal")
 * @param {string} props.organizationName - Optional organization name (for Admin)
 */
const Header = ({ onLogout, user, subtitle, organizationName }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo - Admin has gradient box, Manager/Employee have text logo */}
          {organizationName ? (
            // Admin Dashboard Logo (gradient box + org name)
            <>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span
                  className="text-white font-black text-2xl"
                  style={{
                    fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  N
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{organizationName}</h1>
                <p className="text-slate-600">{subtitle}</p>
              </div>
            </>
          ) : (
            // Manager/Employee Dashboard Logo (Nucleo text)
            <>
              <h1 className="text-4xl font-black tracking-tight">
                <span
                  className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900 }}
                >
                  Nucleo
                </span>
              </h1>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </>
          )}
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="font-semibold text-slate-900">
              {user?.full_name || user?.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.position || user?.role || user?.department}
            </p>
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
};

export default Header;