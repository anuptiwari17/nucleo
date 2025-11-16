import React from 'react';

/**
 * Status Badge Component
 * Displays task status with appropriate color coding
 * 
 * @param {Object} props
 * @param {string} props.status - Task status (new, accepted, completed, failed)
 */
const StatusBadge = ({ status }) => {
  const statusColors = {
    new: 'bg-purple-100 text-purple-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
  };

  const normalizedStatus = status?.toLowerCase() || 'new';
  const colorClass = statusColors[normalizedStatus] || 'bg-slate-100 text-slate-700';
  
  // Capitalize first letter for display
  const displayStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;