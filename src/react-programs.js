/**
 * React Program Integration
 * 
 * This file provides functions to integrate React-based programs
 * with the existing jQuery-based window system. It allows for
 * gradual migration of programs to React while maintaining
 * compatibility with the existing application.
 */

// Store references to original program functions
const originalPrograms = {};

/**
 * Create a React-based window for a program
 * @param {string} programName - Name of the program
 * @param {Object} options - Window options
 * @returns {Object} - Window object compatible with the existing system
 */
function createReactProgramWindow(programName, options = {}) {
  // Check if the program is registered as a React program
  if (!window.reactPrograms || !window.reactPrograms[programName]) {
    console.warn(`Program ${programName} is not registered as a React program`);
    return null;
  }
  
  // Get the React component for the program
  const ReactComponent = window.reactPrograms[programName];
  
  // Create a window object that's compatible with the existing system
  const win = {
    isReactWindow: true,
    title: options.title || programName,
    icon: options.icon,
    position: options.position || { x: 50, y: 50 },
    size: options.size || { width: 400, height: 300 },
    isMinimized: false,
    isMaximized: false,
    
    // Methods that mimic the jQuery window API
    minimize: function() {
      this.isMinimized = true;
      // Trigger event for Task system
      if (this.onMinimize) this.onMinimize();
    },
    
    unminimize: function() {
      this.isMinimized = false;
      // Trigger event for Task system
      if (this.onUnminimize) this.onUnminimize();
    },
    
    focus: function() {
      // Trigger event for Task system
      if (this.onFocus) this.onFocus();
    },
    
    blur: function() {
      // Trigger event for Task system
      if (this.onBlur) this.onBlur();
    },
    
    close: function() {
      // Trigger event for Task system
      if (this.onClosed) this.onClosed();
    },
    
    bringToFront: function() {
      // This will be handled by the React window system
    },
    
    getTitle: function() {
      return this.title;
    },
    
    getIconAtSize: function(size) {
      // Return an icon element compatible with the Task system
      if (!this.icon) return null;
      return $(`<img src="${this.icon}" width="${size}" height="${size}" />`);
    },
    
    // Event registration methods
    on: function(event, callback) {
      this[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    },
    
    onFocus: null,
    onBlur: null,
    onClosed: null,
    onMinimize: null,
    onUnminimize: null
  };
  
  // Create a React window using the WindowsContext
  if (window.createReactWindow) {
    const reactWindowId = window.createReactWindow({
      title: win.title,
      icon: win.icon,
      component: ReactComponent,
      props: options.props || {},
      position: win.position,
      size: win.size
    });
    
    // Store the React window ID for future reference
    win.reactWindowId = reactWindowId;
  } else {
    console.warn('React window system not initialized');
  }
  
  return win;
}

/**
 * Patch a program function to use React if available
 * @param {string} programName - Name of the program
 * @param {Function} originalFn - Original program function
 * @returns {Function} - Patched program function
 */
function patchProgramFunction(programName, originalFn) {
  // Store the original function
  originalPrograms[programName] = originalFn;
  
  // Return a new function that checks if a React version is available
  return function(...args) {
    // Check if this program has a React version
    if (window.reactPrograms && window.reactPrograms[programName]) {
      console.log(`Using React version of ${programName}`);
      
      // Create options for the React window
      const options = {
        props: { filePath: args[0] } // Pass the file path as a prop
      };
      
      // Create a React window
      const win = createReactProgramWindow(programName, options);
      
      // If React window creation failed, fall back to the original function
      if (!win) {
        console.log(`Falling back to original ${programName}`);
        return originalFn.apply(this, args);
      }
      
      // Create a Task for the window
      return new window.Task(win);
    }
    
    // If no React version is available, use the original function
    return originalFn.apply(this, args);
  };
}

/**
 * Patch the programs.js file to use React components when available
 * This function should be called after the original programs.js is loaded
 */
export function patchPrograms() {
  // Check if the window object is available
  if (typeof window === 'undefined') return;
  
  // Patch Notepad
  if (window.Notepad) {
    console.log('Patching Notepad to use React when available');
    window.Notepad = patchProgramFunction('Notepad', window.Notepad);
  }
  
  // Patch Paint (when ready)
  // if (window.Paint) {
  //   console.log('Patching Paint to use React when available');
  //   window.Paint = patchProgramFunction('Paint', window.Paint);
  // }
  
  // Add more programs as they are migrated to React
}

// Expose the original programs
export function getOriginalProgram(programName) {
  return originalPrograms[programName];
}

// Initialize when the document is ready
function initWhenReady() {
  if (document.readyState === 'complete') {
    patchPrograms();
  } else {
    window.addEventListener('load', patchPrograms);
  }
}

// Start initialization
initWhenReady();
