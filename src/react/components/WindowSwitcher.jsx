import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../context/WindowsContext';

/**
 * WindowSwitcher component that provides Alt+1 window switching functionality
 * This is a React version of the original window-switcher.js file
 */
const WindowSwitcher = () => {
  const { windows, activeWindowId, focusWindow } = useWindows();
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [noticeShown, setNoticeShown] = useState(false);
  const [altHeld, setAltHeld] = useState(false);
  
  const windowSwitcherRef = useRef(null);
  const focusLossCheckIntervalRef = useRef(null);
  const sortedWindowsRef = useRef([]);
  
  // Sort windows by z-index (similar to last-used order)
  useEffect(() => {
    if (windows.length > 0) {
      const sorted = [...windows].sort((a, b) => b.zIndex - a.zIndex);
      sortedWindowsRef.current = sorted;
      
      // Find the active window index
      const activeIdx = sorted.findIndex(window => window.id === activeWindowId);
      if (activeIdx !== -1) {
        setActiveIndex(activeIdx);
      }
    }
  }, [windows, activeWindowId]);
  
  // Handle keyboard events for window switching
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+F4 or Alt+4 to close window
      if (e.altKey && (e.key === '4' || e.key === 'F4')) {
        e.preventDefault();
        const closestWindow = e.target.closest('.os-window');
        if (closestWindow && closestWindow.$window) {
          closestWindow.$window.close();
        }
      }
      
      // Alt+1 or Alt+` or Alt+Tab to show window switcher
      if (e.altKey && (e.key === '1' || e.code === 'Backquote' || e.code === 'Tab')) {
        e.preventDefault();
        showWindowSwitcher(e.shiftKey);
      } else {
        hideWindowSwitcher();
      }
      
      // Track Alt key state
      if (e.key === 'Alt') {
        setAltHeld(true);
        clearInterval(focusLossCheckIntervalRef.current);
        focusLossCheckIntervalRef.current = setInterval(checkForFocusLoss, 200);
      }
    };
    
    const handleKeyUp = (e) => {
      // When Alt is released, select the current window
      if (!e.altKey) {
        setAltHeld(false);
        clearInterval(focusLossCheckIntervalRef.current);
        selectAndClose();
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', hideWindowSwitcher);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', hideWindowSwitcher);
      clearInterval(focusLossCheckIntervalRef.current);
    };
  }, []);
  
  // Show the window switcher
  const showWindowSwitcher = (cycleBackwards = false) => {
    if (isVisible) {
      cycleWindowSwitcher(cycleBackwards);
      return;
    }
    
    if (windows.length === 1) {
      activateWindow(windows[0]);
      if (!noticeShown) {
        // Show a message about Alt+1 shortcut
        if (window.clippy) {
          window.clippy.load('Clippy', (agent) => {
            agent.show();
            agent.speak("If there's only one window, Alt+1 will switch to it right away.");
          });
        }
      }
      return;
    }
    
    if (windows.length < 2) {
      return;
    }
    
    setIsVisible(true);
    cycleWindowSwitcher(cycleBackwards);
    
    if (!noticeShown) {
      setNoticeShown(true);
      // Show a message about window switching
      if (window.clippy) {
        window.clippy.load('Clippy', (agent) => {
          agent.show();
          agent.speak("There you go! Press 1 until you get to the window you want.");
        });
      }
    }
  };
  
  // Hide the window switcher
  const hideWindowSwitcher = () => {
    setIsVisible(false);
  };
  
  // Cycle through windows in the switcher
  const cycleWindowSwitcher = (cycleBackwards = false) => {
    const windowCount = sortedWindowsRef.current.length;
    if (windowCount === 0) return;
    
    const newIndex = ((activeIndex + (cycleBackwards ? -1 : 1)) + windowCount) % windowCount;
    setActiveIndex(newIndex);
  };
  
  // Select the current window and close the switcher
  const selectAndClose = () => {
    if (!isVisible) return;
    
    const selectedWindow = sortedWindowsRef.current[activeIndex];
    if (selectedWindow) {
      activateWindow(selectedWindow);
    }
    
    hideWindowSwitcher();
  };
  
  // Activate a window
  const activateWindow = (window) => {
    if (window.isMinimized) {
      // Unminimize the window
      window.isMinimized = false;
    }
    
    // Bring to front and focus
    focusWindow(window.id);
  };
  
  // Check for focus loss (to detect Alt+Tab)
  const checkForFocusLoss = () => {
    if (altHeld && !document.hasFocus()) {
      // Try to focus the document
      window.focus();
      
      if (document.hasFocus()) {
        return;
      }
      
      // Clear the interval and reset Alt state
      clearInterval(focusLossCheckIntervalRef.current);
      setAltHeld(false);
      
      if (windows.length < 2) {
        return;
      }
      
      if (!noticeShown) {
        setNoticeShown(true);
        // Show a message about Alt+1 vs Alt+Tab
        if (window.clippy) {
          window.clippy.load('Clippy', (agent) => {
            agent.show();
            const message = "It looks like you're trying to switch windows.\n\nUse Alt+1 instead of Alt+Tab within the 98.js desktop.\n\nAlso, use Alt+4 instead of Alt+F4 to close windows.";
            agent.speak(message, true);
            
            // Handle double click to animate Clippy
            const el = agent._el;
            if (el) {
              el.addEventListener('dblclick', () => {
                agent.stopCurrent();
                agent.animate();
              }, { once: true });
            }
          });
        }
      }
    }
  };
  
  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      ref={windowSwitcherRef}
      className="window-switcher outset-deep"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#c0c0c0',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        padding: '2px',
        zIndex: 10000
      }}
    >
      <ul 
        className="window-switcher-list"
        style={{
          display: 'flex',
          listStyle: 'none',
          padding: '5px',
          margin: 0
        }}
      >
        {sortedWindowsRef.current.map((window, index) => (
          <li 
            key={window.id}
            className={`window-switcher-item ${index === activeIndex ? 'active' : ''}`}
            style={{
              margin: '0 5px',
              padding: '5px',
              border: index === activeIndex ? '1px dotted #000' : 'none',
              backgroundColor: index === activeIndex ? '#eeeeee' : 'transparent'
            }}
          >
            <img 
              src={window.icon || '/images/icons/task-32x32.png'} 
              alt={window.title}
              width="32"
              height="32"
              style={{
                display: 'block'
              }}
            />
          </li>
        ))}
      </ul>
      <div 
        className="window-switcher-window-name inset-deep"
        style={{
          padding: '5px',
          backgroundColor: '#ffffff',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          textAlign: 'center',
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          fontSize: '12px'
        }}
      >
        {sortedWindowsRef.current[activeIndex]?.title || ''}
      </div>
    </div>
  );
};

/**
 * This function creates a bridge between the React WindowSwitcher component
 * and the original window-switcher.js functionality
 */
export function createWindowSwitcherBridge() {
  // Store references to original functions
  const originalShowWindowSwitcher = window.show_window_switcher;
  const originalCycleWindowSwitcher = window.cycle_window_switcher;
  const originalWindowSwitcherCloseAndSelect = window.window_switcher_close_and_select;
  const originalWindowSwitcherCancel = window.window_switcher_cancel;
  
  // Replace with functions that can use React
  window.show_window_switcher = (cycleBackwards) => {
    if (window.reactShowWindowSwitcher) {
      window.reactShowWindowSwitcher(cycleBackwards);
    } else if (originalShowWindowSwitcher) {
      originalShowWindowSwitcher(cycleBackwards);
    }
  };
  
  window.cycle_window_switcher = (cycleBackwards) => {
    if (window.reactCycleWindowSwitcher) {
      window.reactCycleWindowSwitcher(cycleBackwards);
    } else if (originalCycleWindowSwitcher) {
      originalCycleWindowSwitcher(cycleBackwards);
    }
  };
  
  window.window_switcher_close_and_select = () => {
    if (window.reactWindowSwitcherCloseAndSelect) {
      window.reactWindowSwitcherCloseAndSelect();
    } else if (originalWindowSwitcherCloseAndSelect) {
      originalWindowSwitcherCloseAndSelect();
    }
  };
  
  window.window_switcher_cancel = () => {
    if (window.reactWindowSwitcherCancel) {
      window.reactWindowSwitcherCancel();
    } else if (originalWindowSwitcherCancel) {
      originalWindowSwitcherCancel();
    }
  };
  
  console.log('Window Switcher system bridged for React integration');
}

export default WindowSwitcher;
