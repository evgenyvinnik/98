import React, { useState, useEffect, useRef } from 'react';

/**
 * StartMenu component that implements the Windows 98 Start Menu
 * This is a React version of the original $start-menu.js file
 */
const StartMenu = ({ isOpen, onClose }) => {
  const startMenuRef = useRef(null);
  
  // Handle clicks outside the start menu to close it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        startMenuRef.current && 
        !startMenuRef.current.contains(event.target) && 
        !event.target.closest('.start-button')
      ) {
        onClose();
      }
    };
    
    // Handle Escape key to close the menu
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // If the menu is not open, don't render anything
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      ref={startMenuRef}
      className="start-menu outset-deep" 
      style={{
        position: 'absolute',
        bottom: '28px',
        left: '0',
        width: '200px',
        backgroundColor: '#c0c0c0',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#000',
        zIndex: 5001,
        display: isOpen ? 'block' : 'none'
      }}
    >
      <div 
        className="start-menu-titlebar" 
        style={{ 
          height: '20px', 
          backgroundColor: '#000080', 
          color: 'white', 
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Windows 98</span>
      </div>
      <div 
        className="start-menu-content" 
        style={{ 
          padding: '4px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Programs Menu */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/programs-16x16.png" alt="Programs" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Programs</span>
          <span style={{ marginLeft: 'auto' }}>▶</span>
        </div>
        
        {/* Documents Menu */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/documents-16x16.png" alt="Documents" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Documents</span>
          <span style={{ marginLeft: 'auto' }}>▶</span>
        </div>
        
        {/* Settings Menu */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/settings-16x16.png" alt="Settings" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Settings</span>
          <span style={{ marginLeft: 'auto' }}>▶</span>
        </div>
        
        {/* Find Menu */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/find-16x16.png" alt="Find" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Find</span>
          <span style={{ marginLeft: 'auto' }}>▶</span>
        </div>
        
        {/* Help Menu Item */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/help-16x16.png" alt="Help" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Help</span>
        </div>
        
        {/* Run Menu Item */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/run-16x16.png" alt="Run" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Run...</span>
        </div>
        
        <div style={{ borderTop: '1px solid #808080', margin: '4px 0' }}></div>
        
        {/* Shut Down Menu Item */}
        <div className="start-menu-item" style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/icons/shutdown-16x16.png" alt="Shut Down" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
};

/**
 * StartButton component that toggles the Start Menu
 */
const StartButton = ({ isStartMenuOpen, onToggleStartMenu }) => {
  return (
    <button 
      className={`start-button toggle ${isStartMenuOpen ? 'selected' : ''}`}
      onClick={onToggleStartMenu}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        height: '22px',
        marginRight: '6px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: '0',
        backgroundColor: isStartMenuOpen ? '#ddd' : '#c0c0c0',
        cursor: 'pointer'
      }}
    >
      <img src="/images/start.png" alt="Start" style={{ marginRight: '4px', width: '16px', height: '16px' }} />
      <b>Start</b>
    </button>
  );
};

/**
 * This function creates a bridge between the React StartMenu component
 * and the original $start-menu.js functionality
 */
export function createStartMenuBridge() {
  // Store the original functions
  const originalOpenStartMenu = window.open_start_menu;
  const originalCloseStartMenu = window.close_start_menu;
  const originalToggleStartMenu = window.toggle_start_menu;
  
  // Replace with functions that can use React
  window.open_start_menu = () => {
    if (window.reactOpenStartMenu) {
      window.reactOpenStartMenu();
    } else if (originalOpenStartMenu) {
      originalOpenStartMenu();
    }
  };
  
  window.close_start_menu = () => {
    if (window.reactCloseStartMenu) {
      window.reactCloseStartMenu();
    } else if (originalCloseStartMenu) {
      originalCloseStartMenu();
    }
  };
  
  window.toggle_start_menu = () => {
    if (window.reactToggleStartMenu) {
      window.reactToggleStartMenu();
    } else if (originalToggleStartMenu) {
      originalToggleStartMenu();
    }
  };
  
  console.log('Start Menu system bridged for React integration');
}

export { StartButton, StartMenu };
export default StartMenu;
