import React from 'react';

const FailedTask = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Failed Tasks</h3>
        <p className="text-slate-600">Great focus! Keep it up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Failed Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">FAILED</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              task.priority === 'High' ? 'bg-red-100 text-red-700' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            } border`}>
              {task.priority}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-3">{task.title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
            <div>Assigned by: {task.assignedBy}</div>
            <div>Failed on: {task.failedDate ? new Date(task.failedDate).toLocaleDateString() : '—'}</div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium mb-1">Reason for failure:</p>
            <p className="text-red-700 text-sm">{task.reason_failed || task.reason || 'No reason provided'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FailedTask;