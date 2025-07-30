import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    recurring: 'all'
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks([...tasks, response.data]);
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/toggle`);
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      setError(null);
    } catch (err) {
      setError('Failed to toggle task. Please try again.');
      console.error('Error toggling task:', err);
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && 
        ((filters.status === 'completed' && !task.completed) || 
         (filters.status === 'pending' && task.completed))) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }
    if (filters.recurring !== 'all') {
      if (filters.recurring === 'recurring' && !task.is_recurring) {
        return false;
      }
      if (filters.recurring === 'one-time' && task.is_recurring) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          📋 Task Planner
        </h1>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <TaskStats tasks={tasks} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <TaskFilters filters={filters} setFilters={setFilters} />
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>

        <TaskList 
          tasks={filteredTasks}
          onToggle={toggleTask}
          onEdit={setEditingTask}
          onDelete={deleteTask}
        />

        {showAddModal && (
          <TaskForm 
            onSubmit={createTask}
            onClose={() => setShowAddModal(false)}
            title="Add New Task"
          />
        )}

        {editingTask && (
          <TaskForm 
            task={editingTask}
            onSubmit={(taskData) => updateTask(editingTask.id, taskData)}
            onClose={() => setEditingTask(null)}
            title="Edit Task"
          />
        )}
      </div>
    </div>
  );
}

export default App; 