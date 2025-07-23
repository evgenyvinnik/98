import React, { useState, useEffect } from 'react';
import { useWindows } from '../context/WindowsContext';

/**
 * Taskbar component that renders the Windows 98 taskbar
 * This will gradually replace the functionality in the taskbar-related code
 */
const Taskbar = () => {
  const { windows, focusWindow, minimizeWindow } = useWindows();
  const [time, setTime] = useState('');
  const [showStartMenu, setShowStartMenu] = useState(false);

  // Update the clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      setTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskClick = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      if (window.id === windows.find(w => !w.isMinimized && w.zIndex === Math.max(...windows.map(w => w.zIndex)))?.id) {
        // If it's the top window, minimize it
        minimizeWindow(windowId);
      } else {
        // Otherwise, focus it and un-minimize it
        focusWindow(windowId);
      }
    }
  };

  const toggleStartMenu = () => {
    setShowStartMenu(prev => !prev);
  };

  return (
    <div 
      className="taskbar" 
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28px',
        backgroundColor: '#c0c0c0',
        borderTop: '1px solid #ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2px',
        zIndex: 5000
      }}
    >
      {/* Start Button */}
      <button 
        className="start-button toggle" 
        onClick={toggleStartMenu}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          height: '22px',
          marginRight: '6px',
          border: '1px solid #000',
          borderRadius: '0',
          backgroundColor: showStartMenu ? '#c0c0c0' : '#c0c0c0'
        }}
      >
        <img src="/images/start.png" alt="Start" style={{ marginRight: '4px' }} />
        <b>Start</b>
      </button>

      <div className="taskbar-divider" style={{ width: '1px', height: '22px', backgroundColor: '#888', margin: '0 2px' }}></div>

      {/* Task Buttons */}
      <div className="tasks" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {windows.map(window => (
          <button
            key={window.id}
            className={`task ${window.id === windows.find(w => !w.isMinimized && w.zIndex === Math.max(...windows.map(w => w.zIndex)))?.id ? 'active' : ''}`}
            onClick={() => handleTaskClick(window.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
              height: '22px',
              minWidth: '100px',
              maxWidth: '200px',
              marginRight: '2px',
              border: '1px solid #000',
              borderRadius: '0',
              backgroundColor: window.id === windows.find(w => !w.isMinimized && w.zIndex === Math.max(...windows.map(w => w.zIndex)))?.id ? '#ddd' : '#c0c0c0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {window.icon && <img src={window.icon} alt="" style={{ width: '16px', height: '16px', marginRight: '4px' }} />}
            <span>{window.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-divider" style={{ width: '1px', height: '22px', backgroundColor: '#888', margin: '0 2px' }}></div>

      {/* System Tray */}
      <div className="tray inset-shallow" style={{ display: 'flex', alignItems: 'center', padding: '0 4px', height: '22px', border: '1px solid #888', backgroundColor: '#c0c0c0' }}>
        <div className="tray-icons" style={{ display: 'flex', marginRight: '4px' }}>
          <img className="tray-icon" src="/images/icons/task-scheduler-16x16.png" alt="Task Scheduler" title="Task Scheduler is not ready." style={{ width: '16px', height: '16px', margin: '0 2px' }} />
          <img className="tray-icon" src="/images/icons/audio-okay-16x16.png" alt="Volume" title="Volume" style={{ width: '16px', height: '16px', margin: '0 2px' }} />
        </div>
        <div className="taskbar-time">{time}</div>
      </div>

      {/* Start Menu (conditionally rendered) */}
      {showStartMenu && (
        <div 
          className="start-menu outset-deep" 
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '0',
            width: '200px',
            backgroundColor: '#c0c0c0',
            border: '1px solid #000',
            zIndex: 5001
          }}
        >
          <div className="start-menu-titlebar" style={{ height: '20px', backgroundColor: '#000080', color: 'white', padding: '2px 4px' }}>
            Windows 98
          </div>
          <div className="start-menu-content" style={{ padding: '4px' }}>
            <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
              <img src="/images/icons/notepad-16x16.png" alt="Notepad" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>Notepad</span>
            </div>
            <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
              <img src="/images/icons/paint-16x16.png" alt="Paint" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>Paint</span>
            </div>
            <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
              <img src="/images/icons/minesweeper-16x16.png" alt="Minesweeper" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>Minesweeper</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskbar;
