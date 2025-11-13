import React from 'react';

const CompleteTask = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Completed Tasks</h3>
        <p className="text-slate-600">Complete your first task to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Completed Tasks</h2>

      {tasks.map((task) => {
        const completedOnTime = task.completedDate && task.dueDate
          ? new Date(task.completedDate) <= new Date(task.dueDate)
          : true;

        return (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">COMPLETED</span>
                {completedOnTime && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">On Time</span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              } border`}>
                {task.priority}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-3">{task.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>Assigned by: {task.assignedBy}</div>
              <div>Completed: {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : '—'}</div>
              <div>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
            </div>

            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-800 font-medium">Task completed successfully!</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompleteTask;