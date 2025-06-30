import React from 'react';

const FailedTask = ({ tasks }) => {
  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority?.toLowerCase()) {
        case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    };

    const getPriorityDot = (priority) => {
      switch (priority?.toLowerCase()) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    const getWorkingTime = (startDate, endDate) => {
      if (!startDate || !endDate) return null;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const workingTime = getWorkingTime(task.acceptedDate, task.failedDate);

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-xs font-medium text-yellow-400 bg-red-500/20 px-2 py-1 rounded-full">
                FAILED
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
            {task.failedDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="font-medium">Failed on:</span> {formatDate(task.failedDate)}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><span className="font-medium">Original Due:</span> {formatDate(task.dueDate)}</span>
              </div>
            )}
            {workingTime && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="font-medium">Worked for:</span> {workingTime} {workingTime === 1 ? 'day' : 'days'}</span>
              </div>
            )}
          </div>

      
<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
  <div className="flex items-start space-x-2 text-red-400">
    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <span className="font-medium text-sm block mb-1">Failure Reason:</span>
      <p className="text-sm text-red-300">
        {/* Check both possible properties where reason might be stored */}
        {task.reason_failed || 'No reason provided'}
      </p>
    </div>
  </div>
</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Failed Tasks</h2>
            <p className="text-white/80 text-sm">{tasks.length} tasks failed</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white/80 text-lg">No failed tasks</p>
            <p className="text-white/60 text-sm mt-1">Great job! Keep up the good work</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FailedTask;