/**
 * React Initialization Script
 * 
 * This script is responsible for initializing the React application
 * and integrating it with the existing jQuery-based application.
 * It provides functions to gradually migrate components to React
 * while maintaining compatibility with the existing code.
 */

import { initReactApp } from './index';

/**
 * Initialize the React application
 * This function should be called when the DOM is ready
 */
function initializeReactApplication() {
  console.log('Initializing React application...');
  
  // Create the React root container if it doesn't exist
  let reactRoot = document.getElementById('react-root');
  if (!reactRoot) {
    reactRoot = document.createElement('div');
    reactRoot.id = 'react-root';
    document.body.appendChild(reactRoot);
  }
  
  // Initialize the React application
  initReactApp('react-root');
  
  console.log('React application initialized');
}

/**
 * Register a program with the React application
 * This allows the existing code to create windows using React
 * @param {string} programName - Name of the program
 * @param {Function} component - React component for the program
 */
export function registerReactProgram(programName, component) {
  if (!window.reactPrograms) {
    window.reactPrograms = {};
  }
  
  window.reactPrograms[programName] = component;
  console.log(`Registered React program: ${programName}`);
}

/**
 * Create a bridge between the existing Task system and React windows
 * This function patches the Task constructor to work with React windows
 */
function patchTaskSystem() {
  // Store the original Task constructor
  const originalTask = window.Task;
  
  // Replace the Task constructor with a new one that can handle React windows
  window.Task = function(win) {
    // Check if this is a React window
    if (win && win.isReactWindow) {
      // Handle React window
      console.log('Creating Task for React window:', win.title);
      
      // Create a minimal jQuery-compatible interface for the React window
      const $task = $("<button class='task toggle'/>").appendTo($(".tasks"));
      const $title = $("<span class='title'/>").text(win.title);
      
      if (win.icon) {
        const $icon = $("<img/>").attr('src', win.icon);
        $task.append($icon);
      }
      
      $task.append($title);
      
      // Handle task click
      $task.on("click", function() {
        if ($task.hasClass("selected")) {
          win.minimize();
        } else {
          win.unminimize();
          win.focus();
        }
      });
      
      // Create a Task-like object
      const task = {
        $window: win,
        $task: $task,
        updateTitle: () => {
          $title.text(win.title);
        },
        updateIcon: () => {
          // Update icon if needed
        }
      };
      
      // Add to all_tasks
      originalTask.all_tasks.push(task);
      
      return task;
    } else {
      // Use the original Task constructor for non-React windows
      return originalTask.apply(this, arguments);
    }
  };
  
  // Copy static properties
  window.Task.all_tasks = originalTask.all_tasks;
  
  console.log('Task system patched for React integration');
}

/**
 * Initialize the React integration when the DOM is ready
 */
function initWhenReady() {
  if (document.readyState === 'complete') {
    initializeReactApplication();
    patchTaskSystem();
  } else {
    window.addEventListener('load', () => {
      initializeReactApplication();
      patchTaskSystem();
    });
  }
}

// Start initialization
initWhenReady();

// Export functions for external use
export { initializeReactApplication, patchTaskSystem };
