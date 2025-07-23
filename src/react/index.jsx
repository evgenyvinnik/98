import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// This function will initialize the React application
// It can be called from the existing codebase when ready
export function initReactApp(containerId) {
  const container = document.getElementById(containerId);
  
  // Only initialize if the container exists
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
    return true;
  }
  
  return false;
}

// Expose the init function to the global scope
// This allows the existing JS code to call it
window.initReactApp = initReactApp;
