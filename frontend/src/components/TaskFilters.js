import React from 'react';

const TaskFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="all">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="all">All</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="recurring-filter">Type:</label>
        <select
          id="recurring-filter"
          value={filters.recurring || 'all'}
          onChange={(e) => handleFilterChange('recurring', e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="all">All Tasks</option>
          <option value="recurring">Recurring Only</option>
          <option value="one-time">One-time Only</option>
        </select>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => setFilters({
          status: 'all',
          priority: 'all',
          category: 'all',
          recurring: 'all'
        })}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default TaskFilters; 