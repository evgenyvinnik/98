import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../context/WindowsContext';

/**
 * MessageBox component that displays a dialog box
 * This is a React version of the original msgbox.js file
 */
const MessageBox = ({ 
  title = "Alert",
  message,
  messageHTML,
  buttons = [{ label: "OK", value: "ok", default: true }],
  iconID = "warning", // "error", "warning", "info", or "nuke" for deleting files/folders
  onClose,
  onButtonClick
}) => {
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(-1);
  const buttonRefs = useRef([]);
  
  // Set up button refs
  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, buttons.length);
    
    // Focus the default button
    const defaultButtonIndex = buttons.findIndex(button => button.default);
    if (defaultButtonIndex !== -1) {
      setFocusedButtonIndex(defaultButtonIndex);
      setTimeout(() => {
        buttonRefs.current[defaultButtonIndex]?.focus();
      }, 0);
    }
    
    // Play the chord sound
    try {
      const chordAudio = new Audio("/audio/CHORD.WAV");
      chordAudio.play();
    } catch (error) {
      console.log(`Failed to play chord sound: ${error}`);
    }
  }, [buttons]);
  
  // Handle button click
  const handleButtonClick = (button, index) => {
    if (button.action) {
      button.action();
    }
    
    if (onButtonClick) {
      onButtonClick(button.value);
    }
    
    if (onClose) {
      onClose("button", button.value);
    }
  };
  
  // Handle button focus
  const handleButtonFocus = (index) => {
    setFocusedButtonIndex(index);
  };
  
  // Handle button blur
  const handleButtonBlur = () => {
    setFocusedButtonIndex(-1);
  };
  
  return (
    <div className="message-box" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%'
    }}>
      {/* Message content */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        padding: '16px'
      }}>
        {/* Icon */}
        <img 
          width="32" 
          height="32" 
          src={`/images/icons/${iconID}-32x32-8bpp.png`}
          alt={iconID}
          style={{
            margin: '16px',
            display: 'block'
          }}
        />
        
        {/* Message text */}
        <div style={{
          textAlign: 'left',
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          fontSize: '14px',
          marginTop: '22px',
          flex: 1,
          minWidth: 0,
          whiteSpace: 'normal'
        }}>
          {messageHTML ? (
            <div dangerouslySetInnerHTML={{ __html: messageHTML }} />
          ) : message ? (
            <div style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {message}
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Buttons */}
      <div style={{
        textAlign: 'center',
        padding: '0 16px 16px'
      }}>
        {buttons.map((button, index) => (
          <button
            key={index}
            ref={el => buttonRefs.current[index] = el}
            className={button.default || focusedButtonIndex === index ? 'default' : ''}
            onClick={() => handleButtonClick(button, index)}
            onFocus={() => handleButtonFocus(index)}
            onBlur={handleButtonBlur}
            style={{
              minWidth: 75,
              height: 23,
              margin: '16px 2px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#808080',
              backgroundColor: '#c0c0c0',
              padding: '0 12px',
              cursor: 'pointer'
            }}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * MessageBoxProvider component that manages message box state
 * and provides methods to show message boxes
 */
const MessageBoxContext = React.createContext();

export const MessageBoxProvider = ({ children }) => {
  const { createWindow, closeWindow } = useWindows();
  const [messageBoxes, setMessageBoxes] = useState([]);
  
  // Show a message box
  const showMessageBox = ({
    title = "Alert",
    message,
    messageHTML,
    buttons = [{ label: "OK", value: "ok", default: true }],
    iconID = "warning",
    windowOptions = {}
  }) => {
    return new Promise((resolve, reject) => {
      // Create a unique ID for this message box
      const id = `msgbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Handle close
      const handleClose = (reason, value) => {
        closeWindow(id);
        resolve(value || reason);
        
        // Remove this message box from state
        setMessageBoxes(prev => prev.filter(mb => mb.id !== id));
      };
      
      // Handle button click
      const handleButtonClick = (value) => {
        handleClose("button", value);
      };
      
      // Create the message box component
      const messageBoxComponent = () => (
        <MessageBox
          title={title}
          message={message}
          messageHTML={messageHTML}
          buttons={buttons}
          iconID={iconID}
          onClose={handleClose}
          onButtonClick={handleButtonClick}
        />
      );
      
      // Create a window for the message box
      createWindow({
        id,
        title,
        component: messageBoxComponent,
        position: { x: 'center', y: 'center' },
        size: { width: 400, height: 200 },
        resizable: false,
        maximizable: false,
        minimizable: false
      });
      
      // Add this message box to state
      setMessageBoxes(prev => [...prev, { id, resolve, reject }]);
    });
  };
  
  // Show an alert
  const alert = (message) => {
    return showMessageBox({ message });
  };
  
  // Show a confirm dialog
  const confirm = (message) => {
    return showMessageBox({
      message,
      buttons: [
        { label: "OK", value: true, default: true },
        { label: "Cancel", value: false }
      ]
    });
  };
  
  // Show a prompt dialog
  const prompt = (message, defaultValue = "") => {
    // For prompt, we need to create a custom message box with an input field
    // This is a simplified implementation
    return showMessageBox({
      message: `${message}\n\n(Input field would be here in a full implementation)`,
      buttons: [
        { label: "OK", value: defaultValue, default: true },
        { label: "Cancel", value: null }
      ]
    });
  };
  
  // Context value
  const contextValue = {
    showMessageBox,
    alert,
    confirm,
    prompt,
    messageBoxes
  };
  
  return (
    <MessageBoxContext.Provider value={contextValue}>
      {children}
    </MessageBoxContext.Provider>
  );
};

// Custom hook for using the message box context
export const useMessageBox = () => {
  const context = React.useContext(MessageBoxContext);
  if (!context) {
    throw new Error('useMessageBox must be used within a MessageBoxProvider');
  }
  return context;
};

/**
 * This function creates a bridge between the React MessageBox component
 * and the original msgbox.js functionality
 */
export function createMessageBoxBridge() {
  // Store the original showMessageBox function
  const originalShowMessageBox = window.showMessageBox;
  
  // Replace the showMessageBox function with a new one that can use React
  window.showMessageBox = (options) => {
    // Check if React message box system is available
    if (window.reactShowMessageBox) {
      return window.reactShowMessageBox(options);
    }
    
    // Fall back to the original function
    return originalShowMessageBox(options);
  };
  
  // Store the original alert function
  const originalAlert = window.alert;
  
  // Replace the alert function with a new one that can use React
  window.alert = (message) => {
    // Check if React message box system is available
    if (window.reactAlert) {
      return window.reactAlert(message);
    }
    
    // Fall back to the original function
    return originalAlert(message);
  };
  
  console.log('MessageBox system bridged for React integration');
}

export default MessageBox;
