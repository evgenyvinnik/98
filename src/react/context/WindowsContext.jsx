import React, { createContext, useState, useContext, useCallback } from 'react';

// Create the context
const WindowsContext = createContext();

/**
 * Provider component for managing window state
 * This will replace the functionality in Task.js
 */
export const WindowsProvider = ({ children }) => {
  // State for all windows in the system
  const [windows, setWindows] = useState([]);
  // Track the active (focused) window
  const [activeWindowId, setActiveWindowId] = useState(null);
  // Counter for generating unique window IDs
  const [nextWindowId, setNextWindowId] = useState(1);

  /**
   * Create a new window
   */
  const createWindow = useCallback((config) => {
    const id = `window-${nextWindowId}`;
    setNextWindowId(prev => prev + 1);

    const newWindow = {
      id,
      title: config.title || 'Untitled',
      icon: config.icon,
      component: config.component,
      props: config.props || {},
      position: config.position || { x: 50, y: 50 },
      size: config.size || { width: 400, height: 300 },
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1
    };

    setWindows(prev => [...prev, newWindow]);
    focusWindow(id);
    return id;
  }, [nextWindowId, windows.length]);

  /**
   * Focus a window (bring to front)
   */
  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    setWindows(prev => {
      // Find the highest z-index
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      
      // Update z-indices for all windows
      return prev.map(window => {
        if (window.id === id) {
          return { ...window, zIndex: maxZ + 1 };
        }
        return window;
      });
    });
  }, []);

  /**
   * Minimize a window
   */
  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(window => {
      if (window.id === id) {
        return { ...window, isMinimized: true };
      }
      return window;
    }));
    
    // If the minimized window was active, clear the active window
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  /**
   * Maximize or restore a window
   */
  const toggleMaximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(window => {
      if (window.id === id) {
        return { ...window, isMaximized: !window.isMaximized };
      }
      return window;
    }));
  }, []);

  /**
   * Close a window
   */
  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(window => window.id !== id));
    
    // If the closed window was active, clear the active window
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  /**
   * Update window position
   */
  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => prev.map(window => {
      if (window.id === id) {
        return { ...window, position };
      }
      return window;
    }));
  }, []);

  /**
   * Update window size
   */
  const updateWindowSize = useCallback((id, size) => {
    setWindows(prev => prev.map(window => {
      if (window.id === id) {
        return { ...window, size };
      }
      return window;
    }));
  }, []);

  // Context value
  const value = {
    windows,
    activeWindowId,
    createWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    closeWindow,
    updateWindowPosition,
    updateWindowSize
  };

  return (
    <WindowsContext.Provider value={value}>
      {children}
    </WindowsContext.Provider>
  );
};

// Custom hook for using the windows context
export const useWindows = () => {
  const context = useContext(WindowsContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowsProvider');
  }
  return context;
};

export default WindowsContext;
