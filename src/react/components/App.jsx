import React, { useState, useEffect } from 'react';
import Desktop from './Desktop';
import Taskbar from './Taskbar';
import WindowSwitcher from './WindowSwitcher';
import { StartMenu } from './StartMenu';
import { WindowsProvider } from '../context/WindowsContext';
import { MessageBoxProvider } from './MessageBox';
import { FileDialogProvider } from '../context/FileDialogContext';
import { TaskList, createTaskBridge } from './Task';
import { createMessageBoxBridge } from './MessageBox';
import { createWindowSwitcherBridge } from './WindowSwitcher';
import { createStartMenuBridge } from './StartMenu';

/**
 * Main App component that serves as the entry point for the React version
 * of the Windows 98 simulation. This component will gradually replace
 * the existing jQuery-based implementation.
 */
const App = () => {
  const [initialized, setInitialized] = useState(false);
  const [windowSwitcherVisible, setWindowSwitcherVisible] = useState(false);

  useEffect(() => {
    // This effect will run once when the component mounts
    // We can use it to initialize any resources or load data
    console.log('React Windows 98 simulation initialized');
    
    // Create bridges between React and jQuery components
    createTaskBridge();
    createMessageBoxBridge();
    createWindowSwitcherBridge();
    createStartMenuBridge();
    
    // Register React functions with the global scope
    window.reactShowWindowSwitcher = (cycleBackwards) => {
      setWindowSwitcherVisible(true);
    };
    
    window.reactWindowSwitcherCancel = () => {
      setWindowSwitcherVisible(false);
    };
    
    setInitialized(true);
  }, []);

  // State for start menu visibility
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  
  // Toggle start menu visibility
  const toggleStartMenu = () => {
    setStartMenuVisible(!startMenuVisible);
  };
  
  // Close start menu
  const closeStartMenu = () => {
    setStartMenuVisible(false);
  };
  
  return (
    <WindowsProvider>
      <MessageBoxProvider>
        <FileDialogProvider>
          <div className="react-win98-app">
            <Desktop />
            <Taskbar onToggleStartMenu={toggleStartMenu} />
            {startMenuVisible && <StartMenu isOpen={startMenuVisible} onClose={closeStartMenu} />}
            {windowSwitcherVisible && <WindowSwitcher />}
          </div>
        </FileDialogProvider>
      </MessageBoxProvider>
    </WindowsProvider>
  );
};

export default App;
