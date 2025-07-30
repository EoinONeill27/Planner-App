import React from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onToggle, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getRecurrenceText = (task) => {
    if (!task.is_recurring) return '';
    
    const interval = task.recurrence_interval;
    const type = task.recurrence_type;
    
    if (type === 'daily') {
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
    } else if (type === 'weekly') {
      return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
    } else if (type === 'monthly') {
      return interval === 1 ? 'Monthly' : `Every ${interval} months`;
    }
    return '';
  };

  return (
    <div>
      {tasks.map(task => (
        <div 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''} ${task.is_recurring ? 'recurring-task' : ''}`}
        >
          <div className="task-header">
            <div>
              <div className="task-title">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  style={{ marginRight: '10px' }}
                />
                {task.title}
              </div>
              {task.description && (
                <p style={{ marginTop: '5px', color: '#666', fontSize: '14px' }}>
                  {task.description}
                </p>
              )}
            </div>
                         <div className="task-meta">
               <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                 {task.priority}
               </span>
               <span>{task.category}</span>
               {task.is_recurring && (
                 <span style={{ color: '#667eea', fontWeight: '500' }}>
                   🔄 {getRecurrenceText(task)}
                 </span>
               )}
               {task.due_date && (
                 <span>Due: {formatDate(task.due_date)}</span>
               )}
               {task.next_due && task.is_recurring && (
                 <span>Next: {formatDate(task.next_due)}</span>
               )}
             </div>
          </div>
          
          <div className="task-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 