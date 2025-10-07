import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const TimeTracker = ({ task, onClose }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState(task.time_entries || []);
  const [newEntry, setNewEntry] = useState({
    duration: 0,
    description: ''
  });

  useEffect(() => {
    let interval = null;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000 / 60); // minutes
        setElapsedTime(elapsed);
      }, 1000);
    } else if (!isTracking) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setNewEntry(prev => ({
      ...prev,
      duration: elapsedTime
    }));
  };

  const addTimeEntry = async () => {
    if (newEntry.duration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/${task.id}/time`, {
        duration: newEntry.duration,
        description: newEntry.description
      });
      
      setTimeEntries([...timeEntries, response.data]);
      setNewEntry({ duration: 0, description: '' });
    } catch (error) {
      console.error('Error adding time entry:', error);
      alert('Failed to add time entry');
    }
  };

  const deleteTimeEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this time entry?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${task.id}/time/${entryId}`);
      setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting time entry:', error);
      alert('Failed to delete time entry');
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalActualTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Time Tracking - {task.title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ padding: '20px' }}>
          {/* Time Estimation vs Actual */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Time Summary</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <strong>Estimated:</strong> {formatTime(task.estimated_duration || 0)}
              </div>
              <div>
                <strong>Actual:</strong> {formatTime(totalActualTime)}
              </div>
              <div style={{ 
                color: totalActualTime > (task.estimated_duration || 0) ? '#d32f2f' : '#388e3c',
                fontWeight: 'bold'
              }}>
                {totalActualTime > (task.estimated_duration || 0) ? 'Over' : 'Under'} by{' '}
                {formatTime(Math.abs(totalActualTime - (task.estimated_duration || 0)))}
              </div>
            </div>
          </div>

          {/* Timer */}
          <div style={{ 
            background: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
              {formatTime(elapsedTime)}
            </div>
            <div>
              {!isTracking ? (
                <button className="btn btn-primary" onClick={startTracking}>
                  Start Timer
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopTracking}>
                  Stop Timer
                </button>
              )}
            </div>
          </div>

          {/* Add Manual Entry */}
          <div style={{ marginBottom: '20px' }}>
            <h4>Add Time Entry</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newEntry.duration || ''}
                onChange={(e) => setNewEntry(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 0 
                }))}
                className="form-control"
                style={{ width: '150px' }}
                min="1"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                className="form-control"
                style={{ flex: 1 }}
              />
              <button 
                className="btn btn-primary" 
                onClick={addTimeEntry}
                disabled={newEntry.duration <= 0}
              >
                Add Entry
              </button>
            </div>
          </div>

          {/* Time Entries List */}
          <div>
            <h4>Time Entries</h4>
            {timeEntries.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                No time entries yet
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {timeEntries.map(entry => (
                  <div key={entry.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    background: '#fff'
                  }}>
                    <div>
                      <strong>{formatTime(entry.duration)}</strong>
                      {entry.description && (
                        <span style={{ marginLeft: '10px', color: '#666' }}>
                          - {entry.description}
                        </span>
                      )}
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => deleteTimeEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
