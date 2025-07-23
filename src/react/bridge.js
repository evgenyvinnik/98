/**
 * This file serves as a bridge between the existing jQuery-based code
 * and our new React components. It provides functions to initialize
 * React components within the existing application and to communicate
 * between the two systems.
 */

import { initReactApp } from './index';

/**
 * Initialize the React application within a container element
 * @param {string} containerId - ID of the container element
 * @returns {boolean} - Whether initialization was successful
 */
export function initializeReact(containerId = 'react-root') {
  // Check if the container exists, create it if not
  let container = document.getElementById(containerId);
  
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }
  
  // Initialize the React application
  return initReactApp(containerId);
}

/**
 * Create a React window from the existing jQuery window
 * This function will be called from the existing code
 * @param {Object} $win - jQuery window object
 * @param {Object} options - Window options
 * @returns {string} - ID of the created React window
 */
export function createReactWindowFromJQuery($win, options = {}) {
  // This function will be implemented as we progress with the migration
  console.log('Creating React window from jQuery', $win, options);
  return null;
}

/**
 * Create a jQuery window from a React window
 * This function will be called from React components
 * @param {Object} reactWindow - React window object
 * @param {Object} options - Window options
 * @returns {Object} - jQuery window object
 */
export function createJQueryWindowFromReact(reactWindow, options = {}) {
  // This function will be implemented as we progress with the migration
  console.log('Creating jQuery window from React', reactWindow, options);
  return null;
}

/**
 * Register the bridge functions with the global scope
 * This allows the existing code to call our React functions
 */
export function registerBridgeFunctions() {
  window.initializeReact = initializeReact;
  window.createReactWindowFromJQuery = createReactWindowFromJQuery;
  window.createJQueryWindowFromReact = createJQueryWindowFromReact;
}

// Register the bridge functions when this file is loaded
registerBridgeFunctions();
