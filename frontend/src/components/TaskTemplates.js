import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const TaskTemplates = ({ onTemplateSelect, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTaskFromTemplate = async (templateId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/templates/${templateId}/create`);
      onTemplateSelect(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating task from template:', error);
      alert('Failed to create task from template');
    }
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Task Templates</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading templates...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Task Templates</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No templates available
            </div>
          ) : (
            templates.map(template => (
              <div key={template.id} className="template-item" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{template.name}</h4>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      {template.description}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#888' }}>
                      <span>📁 {template.category}</span>
                      <span>⚡ {template.priority}</span>
                      <span>⏱️ {template.estimated_duration} min</span>
                      {template.is_recurring && <span>🔄 Recurring</span>}
                    </div>
                    {template.tags && template.tags.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        {template.tags.map((tag, index) => (
                          <span key={index} style={{
                            background: '#e3f2fd',
                            color: '#1976d2',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            marginRight: '4px'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => createTaskFromTemplate(template.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplates;
