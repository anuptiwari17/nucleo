import React from 'react';

/**
 * Loading Spinner Component
 * Displays a centered loading spinner with optional message
 * 
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {string} props.size - Size: 'sm', 'md', 'lg' (default: 'md')
 */
const LoadingSpinner = ({ message, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-4 border-violet-600 border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {message && (
        <p className="mt-4 text-slate-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;