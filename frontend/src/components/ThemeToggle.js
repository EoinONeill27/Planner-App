import React from 'react';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className={`btn ${isDarkMode ? 'btn-secondary' : 'btn-secondary'}`}
      onClick={onToggle}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1001',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
