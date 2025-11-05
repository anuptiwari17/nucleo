import React, { useState } from 'react';

const AcceptTask = ({ tasks, onComplete, onFail }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [failureReason, setFailureReason] = useState('');

  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    };

    const getPriorityDot = (priority) => {
      switch (priority) {
        case 'High': return 'bg-red-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    const getDaysLeft = (dueDate) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysLeft = task.dueDate ? getDaysLeft(task.dueDate) : null;

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                IN PROGRESS
              </span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`}></div>
              <span>{task.priority}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-white text-lg mb-3 leading-tight">{task.title}</h3>
          
          <div className="space-y-2 text-sm text-white/80 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span><span className="font-medium">Assigned by:</span> {task.assignedBy}</span>
            </div>
            {task.acceptedDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="font-medium">Started:</span> {task.acceptedDate}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><span className="font-medium">Due:</span> {task.dueDate}</span>
                {daysLeft !== null && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    daysLeft < 0 ? 'bg-red-500/20 text-red-400' :
                    daysLeft <= 2 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                     daysLeft === 0 ? 'Due today' :
                     `${daysLeft} days left`}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onComplete(task.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTask(task)}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Mark Failed</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Active Tasks</h2>
            <p className="text-white/80 text-sm">{tasks.length} tasks in progress</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-white/80 text-lg">No active tasks</p>
            <p className="text-white/60 text-sm mt-1">Accept new tasks to get started</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Failure Reason Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl max-w-md w-full border border-white/20 shadow-xl shadow-purple-500/25">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Mark Task as Failed</h3>
                <button
                  onClick={() => {
                    setActiveTask(null);
                    setFailureReason('');
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">Reason for failure</label>
                <textarea
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  rows="3"
                  placeholder="Please provide a reason for marking this task as failed..."
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTask(null);
                    setFailureReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (failureReason.trim()) {
                      onFail(activeTask.id, failureReason.trim());
                      setActiveTask(null);
                      setFailureReason('');
                    } else {
                      alert('Please provide a reason for failure');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Confirm Failure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptTask;