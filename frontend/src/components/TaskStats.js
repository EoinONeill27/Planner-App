import React from 'react';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityCount = (priority) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const recurringTasks = tasks.filter(task => task.is_recurring).length;
  const oneTimeTasks = totalTasks - recurringTasks;

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-number">{totalTasks}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{completedTasks}</div>
        <div className="stat-label">Completed</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{pendingTasks}</div>
        <div className="stat-label">Pending</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{completionRate}%</div>
        <div className="stat-label">Completion Rate</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{getPriorityCount('High')}</div>
        <div className="stat-label">High Priority</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{getPriorityCount('Medium')}</div>
        <div className="stat-label">Medium Priority</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{recurringTasks}</div>
        <div className="stat-label">Recurring Tasks</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{oneTimeTasks}</div>
        <div className="stat-label">One-time Tasks</div>
      </div>
    </div>
  );
};

export default TaskStats; 