import React, { useState, useEffect } from 'react';

/**
 * TaskbarTime component that displays the current time in the taskbar
 * This is a React version of the original $taskbar-time.js file
 */
const TaskbarTime = () => {
  const [time, setTime] = useState('');
  const [fullDate, setFullDate] = useState('');
  
  // Update the time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format the time (hour:minute)
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      // Format the full date for the tooltip
      setFullDate(now.toLocaleString([], { 
        weekday: 'long', 
        month: 'long', 
        day: '2-digit', 
        minute: '2-digit', 
        hour: '2-digit' 
      }));
    };
    
    // Update immediately
    updateTime();
    
    // Set up interval to update every second
    const intervalId = setInterval(updateTime, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div 
      className="taskbar-time" 
      title={fullDate}
      style={{
        padding: '0 4px',
        fontSize: '12px',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        cursor: 'default'
      }}
    >
      {time}
    </div>
  );
};

/**
 * This function creates a bridge between the React TaskbarTime component
 * and the original $taskbar-time.js functionality
 */
export function createTaskbarTimeBridge() {
  // The original $taskbar-time.js functionality is very simple and self-contained
  // We don't need to do much bridging here, but we'll provide this function
  // for consistency with our other bridge functions
  
  console.log('Taskbar Time system bridged for React integration');
}

export default TaskbarTime;
