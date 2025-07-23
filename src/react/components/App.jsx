import React, { useState, useEffect } from 'react';
import Desktop from './Desktop';
import Taskbar from './Taskbar';
import { WindowsProvider } from '../context/WindowsContext';

/**
 * Main App component that serves as the entry point for the React version
 * of the Windows 98 simulation. This component will gradually replace
 * the existing jQuery-based implementation.
 */
const App = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // This effect will run once when the component mounts
    // We can use it to initialize any resources or load data
    console.log('React Windows 98 simulation initialized');
    setInitialized(true);
  }, []);

  return (
    <WindowsProvider>
      <div className="react-win98-app">
        <Desktop />
        <Taskbar />
      </div>
    </WindowsProvider>
  );
};

export default App;
