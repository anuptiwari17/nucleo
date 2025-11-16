import React from 'react';

/**
 * Stats Card Component
 * Displays metrics with icon, title, value, and optional chart/subtitle
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {React.ReactNode} props.icon - SVG icon element
 * @param {string} props.color - Tailwind color class (e.g., "text-violet-600")
 * @param {string} props.bgColor - Background color for icon (e.g., "bg-violet-600")
 * @param {string|React.ReactNode} props.subtitle - Optional subtitle text or component
 * @param {React.ReactNode} props.chart - Optional chart component
 */
const StatsCard = ({ title, value, icon, color, bgColor, subtitle, chart }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color || 'text-slate-900'}`}>
            {value}
          </p>
          {subtitle && (
            <div className="text-xs text-slate-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`w-14 h-14 ${
              bgColor || color?.replace('text-', 'bg-').replace('600', '100') || 'bg-slate-100'
            } rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
      </div>
      {chart && <div className="h-28">{chart}</div>}
    </div>
  );
};

export default StatsCard;