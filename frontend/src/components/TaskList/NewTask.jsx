import React, { useState } from 'react';

const NewTask = ({ tasks, onAccept }) => {
  const [acceptingId, setAcceptingId] = useState(null);

  const handleAccept = async (taskId) => {
    setAcceptingId(taskId);
    try {
      await onAccept(taskId);
    } finally {
      setAcceptingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No New Tasks</h3>
        <p className="text-slate-600">You'll be notified when new tasks are assigned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">New Tasks</h2>
        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
          {tasks.length} pending
        </span>
      </div>

      {tasks.map((task) => {
        const daysLeft = getDaysLeft(task.due_date || task.dueDate);
        const isUrgent = daysLeft !== null && daysLeft <= 2;

        return (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-slate-600 text-sm mb-4">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Due: {formatDate(task.due_date || task.dueDate)}</span>
                    {daysLeft !== null && (
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                        daysLeft < 0 ? 'bg-red-100 text-red-700' :
                        daysLeft === 0 ? 'bg-orange-100 text-orange-700' :
                        isUrgent ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{task.assigned_by_name || task.assignedBy}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityStyle(task.priority)}`}>
                {task.priority || 'Normal'}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleAccept(task.id)}
                disabled={acceptingId === task.id}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {acceptingId === task.id ? (
                  <>Accepting...</>
                ) : (
                  <>
                    Accept Task
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewTask;