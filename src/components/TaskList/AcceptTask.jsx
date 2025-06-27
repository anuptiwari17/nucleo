
const AcceptTask = ({ tasks, onComplete, onFail }) => {
  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High': return 'bg-red-50 border-red-200 text-red-800';
        case 'Medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'Low': return 'bg-green-50 border-green-200 text-green-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
      <div className="bg-white rounded-lg shadow-md border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                IN PROGRESS
              </span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`}></div>
              <span>{task.priority}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-800 text-lg mb-3 leading-tight">{task.title}</h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span><span className="font-medium">Assigned by:</span> {task.assignedBy}</span>
            </div>
            {task.acceptedDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="font-medium">Started:</span> {task.acceptedDate}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><span className="font-medium">Due:</span> {task.dueDate}</span>
                {daysLeft !== null && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    daysLeft < 0 ? 'bg-red-100 text-red-800' :
                    daysLeft <= 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
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
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete</span>
              </div>
            </button>
            <button
              onClick={() => {
                const reason = prompt("Enter reason for failure:");
                if (reason && reason.trim()) onFail(task.id, reason.trim());
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Active Tasks</h2>
            <p className="text-orange-100 text-sm">{tasks.length} tasks in progress</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No active tasks</p>
            <p className="text-gray-400 text-sm mt-1">Accept new tasks to get started</p>
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

export default AcceptTask;