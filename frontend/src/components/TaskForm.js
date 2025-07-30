import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onClose, title }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    due_date: '',
    is_recurring: false,
    recurrence_type: 'none',
    recurrence_interval: 1
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'General',
        priority: task.priority || 'Medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        is_recurring: task.is_recurring || false,
        recurrence_type: task.recurrence_type || 'none',
        recurrence_interval: task.recurrence_interval || 1
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              className="form-control"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  is_recurring: e.target.checked,
                  recurrence_type: e.target.checked ? 'daily' : 'none'
                }))}
                style={{ marginRight: '8px' }}
              />
              Recurring Task
            </label>
          </div>

          {formData.is_recurring && (
            <>
              <div className="form-group">
                <label htmlFor="recurrence_type">Repeat Every</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="number"
                    name="recurrence_interval"
                    className="form-control"
                    style={{ width: '80px' }}
                    value={formData.recurrence_interval}
                    onChange={handleChange}
                    min="1"
                    max="30"
                  />
                  <select
                    name="recurrence_type"
                    className="form-control"
                    value={formData.recurrence_type}
                    onChange={handleChange}
                  >
                    <option value="daily">Day(s)</option>
                    <option value="weekly">Week(s)</option>
                    <option value="monthly">Month(s)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 