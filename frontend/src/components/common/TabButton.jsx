import React from 'react';

/**
 * Tab Button Component
 * Used for tab navigation across dashboards
 * 
 * @param {Object} props
 * @param {string} props.label - Tab label text
 * @param {number} props.count - Optional count badge
 * @param {boolean} props.isActive - Whether tab is currently active
 * @param {Function} props.onClick - Click handler
 * @param {string} props.icon - Optional icon/emoji for the tab
 */
const TabButton = ({ label, count, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
        isActive
          ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            isActive ? 'bg-white/30' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;