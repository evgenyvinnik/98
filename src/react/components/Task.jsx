import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../context/WindowsContext';

/**
 * Task component that represents a window in the taskbar
 * This is a React version of the original Task.js file
 */
const Task = ({ windowId, title, icon, isActive, onTaskClick }) => {
  // Handle task button click
  const handleClick = () => {
    if (onTaskClick) {
      onTaskClick(windowId);
    }
  };

  return (
    <button 
      className={`task toggle ${isActive ? 'selected' : ''}`}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        height: '22px',
        minWidth: '100px',
        maxWidth: '200px',
        marginRight: '2px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: '0',
        backgroundColor: isActive ? '#ddd' : '#c0c0c0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {icon && (
        <img 
          src={icon} 
          alt="" 
          style={{ 
            width: '16px', 
            height: '16px', 
            marginRight: '4px' 
          }} 
        />
      )}
      <span className="title">{title}</span>
    </button>
  );
};

/**
 * TaskList component that manages all tasks in the taskbar
 */
const TaskList = () => {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindows();
  
  // Handle task click
  const handleTaskClick = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    
    if (window) {
      if (window.id === activeWindowId && !window.isMinimized) {
        // If it's the active window, minimize it
        minimizeWindow(windowId);
      } else {
        // Otherwise, focus it
        focusWindow(windowId);
      }
    }
  };
  
  return (
    <div 
      className="tasks" 
      style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden' 
      }}
    >
      {windows.map(window => (
        <Task
          key={window.id}
          windowId={window.id}
          title={window.title}
          icon={window.icon}
          isActive={window.id === activeWindowId && !window.isMinimized}
          onTaskClick={handleTaskClick}
        />
      ))}
    </div>
  );
};

export { Task, TaskList };

/**
 * This function creates a bridge between the React TaskList component
 * and the original Task.js functionality
 */
export function createTaskBridge() {
  // Store the original Task constructor
  const originalTask = window.Task;
  
  // Replace the Task constructor with a new one that can handle React windows
  window.Task = function(win) {
    // Check if this is a React window
    if (win && win.isReactWindow) {
      console.log('Creating Task for React window:', win.title);
      
      // Create a minimal Task-like object for React windows
      const task = {
        $window: win,
        updateTitle: () => {
          // Title updates are handled by React
        },
        updateIcon: () => {
          // Icon updates are handled by React
        }
      };
      
      // Add to all_tasks
      originalTask.all_tasks.push(task);
      
      return task;
    } else {
      // Use the original Task constructor for non-React windows
      return new originalTask(win);
    }
  };
  
  // Copy static properties
  window.Task.all_tasks = originalTask.all_tasks;
  
  console.log('Task system bridged for React integration');
}

export default TaskList;
