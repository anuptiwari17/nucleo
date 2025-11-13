import React, { useState } from 'react';

const AcceptTask = ({ tasks, onComplete, onFail }) => {
  const [showFailModal, setShowFailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [failureReason, setFailureReason] = useState('');

  const openFailModal = (task) => {
    setSelectedTask(task);
    setFailureReason('');
    setShowFailModal(true);
  };

  const confirmFail = () => {
    if (!failureReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    onFail(selectedTask.id, failureReason.trim());
    setShowFailModal(false);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Active Tasks</h3>
        <p className="text-slate-600">Accept a task to start working!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Active Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">IN PROGRESS</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              task.priority === 'High' ? 'bg-red-100 text-red-700' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            } border`}>
              {task.priority || 'Normal'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assigned by: {task.assignedBy || task.assigned_by_name}
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onComplete(task.id)}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Complete Task
            </button>
            <button
              onClick={() => openFailModal(task)}
              className="px-5 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
            >
              Mark Failed
            </button>
          </div>
        </div>
      ))}

      {/* Fail Modal */}
      {showFailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Mark Task as Failed</h3>
            <p className="text-slate-600 mb-4">Task: <strong>{selectedTask?.title}</strong></p>
            <textarea
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows="4"
              placeholder="Please explain why this task cannot be completed..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFailModal(false)}
                className="flex-1 px-5 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmFail}
                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Confirm Failure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptTask;