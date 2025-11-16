import React from 'react';

/**
 * Priority Badge Component
 * Displays task priority with appropriate color coding
 * 
 * @param {Object} props
 * @param {string} props.priority - Task priority (high, medium, low)
 */
const PriorityBadge = ({ priority }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700',
  };

  const normalizedPriority = priority?.toLowerCase() || 'medium';
  const colorClass = priorityColors[normalizedPriority] || 'bg-slate-100 text-slate-700';
  
  // Capitalize first letter for display
  const displayPriority = normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayPriority}
    </span>
  );
};

export default PriorityBadge;