import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../contexts/WindowContext';
import TaskbarClock from './TaskbarClock';
import StartMenu from './StartMenu';

const Task = ({ window, selected, onClick }) => {
  const iconHTML = window.icon ? window.icon.outerHTML : '';

  return (
    <button 
      className={`task toggle ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span dangerouslySetInnerHTML={{ __html: iconHTML }} />
      <span className='title'>{window.title}</span>
    </button>
  );
};

const Taskbar = () => {
  const { windows, focusedWindow, focusWindow } = useWindows();
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const startButtonRef = useRef(null);
  const startMenuRef = useRef(null);

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };

  const closeStartMenu = () => {
    setStartMenuOpen(false);
  };

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (isStartMenuOpen) {
        // Check if the click is outside the start button and start menu
        if (startButtonRef.current && !startButtonRef.current.contains(event.target) &&
            startMenuRef.current && !startMenuRef.current.contains(event.target)) {
          closeStartMenu();
        }
      }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeStartMenu();
        }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStartMenuOpen]);

  const handleTaskClick = (window) => {
    if (window.id === focusedWindow) {
      window.win.minimize();
      window.win.blur();
    } else {
      window.win.unminimize();
      window.win.bringToFront();
      // focus is handled by the context
      focusWindow(window.id);
    }
  };

  return (
    <>
      <div className="taskbar" style={{ zIndex: 5000 }}>
        <button 
          ref={startButtonRef}
          className={`start-button toggle ${isStartMenuOpen ? 'selected' : ''}`}
          title="Click here to begin."
          onClick={toggleStartMenu}
        >
          <img src="images/start.png" alt="" /><b>Start</b>
        </button>
        <div className="taskbar-divider"></div>
                <div className="tasks">
          {windows.map(win => (
            <Task 
              key={win.id} 
              window={win} 
              selected={win.id === focusedWindow}
              onClick={() => handleTaskClick(win)} 
            />
          ))}
        </div>
        <div className="taskbar-divider"></div>
        <div className="tray inset-shallow">
          <div className="tray-icons">
            <img className="tray-icon" src="images/icons/task-scheduler-16x16.png" title="Task Scheduler is not ready." onClick={() => showMessageBox({iconID: 'info', message: 'Good day to you!'})} />
            <img className="tray-icon" src="images/icons/audio-okay-16x16.png" title="Volume" onClick={() => showMessageBox({iconID: 'info', message: 'Have a wonderful day!'})} />
          </div>
          <TaskbarClock />
        </div>
      </div>
      <div ref={startMenuRef}>
        <StartMenu isOpen={isStartMenuOpen} closeMenu={closeStartMenu} />
      </div>
    </>
  );
};

export default Taskbar;
