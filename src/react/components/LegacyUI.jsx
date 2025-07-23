import React, { useEffect, useRef } from 'react';

/**
 * LegacyUI component that preserves the functionality of the original HTML structure
 * This component includes the desktop, taskbar, and start menu elements from the original implementation
 */
const LegacyUI = () => {
  const desktopRef = useRef(null);
  const taskbarRef = useRef(null);
  const startMenuRef = useRef(null);
  const tasksRef = useRef(null);
  const taskbarTimeRef = useRef(null);
  
  // Initialize legacy UI elements when component mounts
  useEffect(() => {
    // Expose refs to window for jQuery code to access
    window.reactDesktopElement = desktopRef.current;
    window.reactTaskbarElement = taskbarRef.current;
    window.reactStartMenuElement = startMenuRef.current;
    window.reactTasksElement = tasksRef.current;
    window.reactTaskbarTimeElement = taskbarTimeRef.current;
    
    // Initialize any legacy functionality that depends on these elements
    if (window.initLegacyUI) {
      window.initLegacyUI();
    }
    
    return () => {
      // Clean up when component unmounts
      delete window.reactDesktopElement;
      delete window.reactTaskbarElement;
      delete window.reactStartMenuElement;
      delete window.reactTasksElement;
      delete window.reactTaskbarTimeElement;
    };
  }, []);
  
  return (
    <>
      {/* Legacy desktop container */}
      <div 
        ref={desktopRef}
        className="desktop" 
        style={{
          backgroundImage: 'url(images/clouds.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Legacy taskbar */}
      <div 
        ref={taskbarRef}
        className="taskbar" 
        style={{ zIndex: 5000 }}
      >
        <button className="start-button toggle" title="Click here to begin.">
          <img src="images/start.png" alt="Start" />
          <b>Start</b>
        </button>
        <div className="taskbar-divider" />
        {/* TODO: pinned apps and resizing handles */}
        <div ref={tasksRef} className="tasks" />
        <div className="taskbar-divider" />
        <div className="tray inset-shallow">
          <div className="tray-icons">
            <img 
              className="tray-icon" 
              src="images/icons/task-scheduler-16x16.png" 
              title="Task Scheduler is not ready." 
              onClick={() => window.showMessageBox({iconID: 'info', message: 'Good day to you!'})}
              alt="Task Scheduler"
            />
            <img 
              className="tray-icon" 
              src="images/icons/audio-okay-16x16.png" 
              title="Volume" 
              onClick={() => window.showMessageBox({iconID: 'info', message: 'Have a wonderful day!'})}
              alt="Volume"
            />
          </div>
          <div 
            ref={taskbarTimeRef}
            className="taskbar-time" 
            onDoubleClick={() => window.showMessageBox({iconID: 'info', message: 'Time to get an old clock!'})}
          />
        </div>
      </div>
      
      {/* Legacy start menu */}
      <div 
        ref={startMenuRef}
        className="start-menu outset-deep" 
        hidden 
        style={{ display: 'none', zIndex: 5001 }}
      >
        <div className="start-menu-titlebar" />
        <div className="start-menu-content">
          <h1 style={{ fontFamily: 'cursive', fontSize: '2em' }}>'S tart</h1>
          <h2 style={{ 
            fontFamily: 'cursive', 
            fontSize: '1em', 
            color: 'gray', 
            margin: 0, 
            marginLeft: '300px', 
            whiteSpace: 'nowrap' 
          }}>
            's a strawberry tart
          </h2>
          <img src="https://i.postimg.cc/dtxsJq0d/CK1IhDr.gif" alt="Strawberry tart" />
        </div>
      </div>
    </>
  );
};

export default LegacyUI;
