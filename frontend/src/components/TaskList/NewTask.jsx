import React, { useState } from 'react';

const NewTask = ({ tasks, onAccept }) => {
  const [accepting, setAccepting] = useState(null); // Track which task is being accepted

  const handleAcceptTask = async (taskId) => {
    try {
      setAccepting(taskId);
      await onAccept(taskId); // Call the parent's accept function
    } catch (error) {
      console.error('Error accepting task:', error);
    } finally {
      setAccepting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDaysLeft = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">New Tasks</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white/80 text-lg">No new tasks available</p>
          <p className="text-white/60 text-sm mt-2">Check back later for new assignments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">New Tasks</h2>
        <span className="bg-blue-500/20 text-blue-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const daysLeft = getDaysLeft(task.due_date || task.dueDate);
          
          return (
            <div 
              key={task.id} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-white/80 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due: {formatDate(task.due_date || task.dueDate)}</span>
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
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Assigned by: {task.assigned_by_name || task.assignedBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Normal'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleAcceptTask(task.id)}
                  disabled={accepting === task.id}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  {accepting === task.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Accept Task
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewTask;