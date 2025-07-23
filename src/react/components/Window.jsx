import React, { useState, useRef, useEffect } from 'react';
import { useWindows } from '../context/WindowsContext';

/**
 * Window component that renders a draggable, resizable window
 * This will gradually replace the functionality in $Window.js
 */
const Window = ({ 
  id, 
  title, 
  icon, 
  children, 
  position, 
  size, 
  zIndex, 
  isMaximized, 
  isActive 
}) => {
  const { 
    focusWindow, 
    minimizeWindow, 
    toggleMaximizeWindow, 
    closeWindow, 
    updateWindowPosition, 
    updateWindowSize 
  } = useWindows();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState(size);
  const [initialPosition, setInitialPosition] = useState(position);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  
  const windowRef = useRef(null);
  
  // Calculate window styles based on props
  const getWindowStyles = () => {
    if (isMaximized) {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '28px', // Leave space for taskbar
        width: 'auto',
        height: 'auto',
        zIndex: zIndex
      };
    }
    
    return {
      position: 'absolute',
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      zIndex: zIndex
    };
  };
  
  // Handle window click to focus
  const handleWindowClick = (e) => {
    if (!isActive) {
      focusWindow(id);
    }
  };
  
  // Handle title bar mouse down for dragging
  const handleTitleBarMouseDown = (e) => {
    if (isMaximized) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    focusWindow(id);
  };
  
  // Handle resize handle mouse down
  const handleResizeMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialSize({ ...size });
    setInitialPosition({ ...position });
    setResizeStart({ x: e.clientX, y: e.clientY });
    
    focusWindow(id);
  };
  
  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        updateWindowPosition(id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newX = initialPosition.x;
        let newY = initialPosition.y;
        
        // Handle different resize directions
        if (resizeDirection.includes('e')) {
          newWidth = initialSize.width + deltaX;
        }
        if (resizeDirection.includes('s')) {
          newHeight = initialSize.height + deltaY;
        }
        if (resizeDirection.includes('w')) {
          newWidth = initialSize.width - deltaX;
          newX = initialPosition.x + deltaX;
        }
        if (resizeDirection.includes('n')) {
          newHeight = initialSize.height - deltaY;
          newY = initialPosition.y + deltaY;
        }
        
        // Enforce minimum size
        const minWidth = 200;
        const minHeight = 100;
        
        if (newWidth < minWidth) {
          if (resizeDirection.includes('w')) {
            newX = initialPosition.x + initialSize.width - minWidth;
          }
          newWidth = minWidth;
        }
        
        if (newHeight < minHeight) {
          if (resizeDirection.includes('n')) {
            newY = initialPosition.y + initialSize.height - minHeight;
          }
          newHeight = minHeight;
        }
        
        updateWindowSize(id, { width: newWidth, height: newHeight });
        updateWindowPosition(id, { x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    id, 
    isDragging, 
    isResizing, 
    dragOffset, 
    resizeDirection, 
    initialSize, 
    initialPosition, 
    resizeStart, 
    updateWindowPosition, 
    updateWindowSize
  ]);
  
  return (
    <div
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''}`}
      style={{
        ...getWindowStyles(),
        backgroundColor: '#c0c0c0',
        border: '1px solid #000',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        className="title-bar"
        style={{
          backgroundColor: isActive ? '#000080' : '#808080',
          color: 'white',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isMaximized ? 'default' : 'move'
        }}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center' }}>
          {icon && <img src={icon} alt="" style={{ width: '16px', height: '16px', marginRight: '4px' }} />}
          <span>{title}</span>
        </div>
        <div className="title-bar-controls" style={{ display: 'flex' }}>
          <button
            className="minimize-button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            style={{
              width: '16px',
              height: '14px',
              marginLeft: '2px',
              backgroundColor: '#c0c0c0',
              border: '1px solid #000',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '10px', lineHeight: 1, color: 'black' }}>_</span>
          </button>
          <button
            className="maximize-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(id);
            }}
            style={{
              width: '16px',
              height: '14px',
              marginLeft: '2px',
              backgroundColor: '#c0c0c0',
              border: '1px solid #000',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMaximized ? (
              <span style={{ fontSize: '10px', lineHeight: 1, color: 'black' }}>❐</span>
            ) : (
              <span style={{ fontSize: '10px', lineHeight: 1, color: 'black' }}>□</span>
            )}
          </button>
          <button
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            style={{
              width: '16px',
              height: '14px',
              marginLeft: '2px',
              backgroundColor: '#c0c0c0',
              border: '1px solid #000',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '10px', lineHeight: 1, color: 'black' }}>✕</span>
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div
        className="window-content"
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'white',
          padding: '4px'
        }}
      >
        {children}
      </div>
      
      {/* Resize Handles (only when not maximized) */}
      {!isMaximized && (
        <>
          <div
            className="resize-handle resize-n"
            style={{ position: 'absolute', top: 0, left: '4px', right: '4px', height: '4px', cursor: 'n-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="resize-handle resize-e"
            style={{ position: 'absolute', top: '4px', right: 0, bottom: '4px', width: '4px', cursor: 'e-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div
            className="resize-handle resize-s"
            style={{ position: 'absolute', bottom: 0, left: '4px', right: '4px', height: '4px', cursor: 's-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="resize-handle resize-w"
            style={{ position: 'absolute', top: '4px', left: 0, bottom: '4px', width: '4px', cursor: 'w-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="resize-handle resize-nw"
            style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '4px', cursor: 'nw-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="resize-handle resize-ne"
            style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', cursor: 'ne-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="resize-handle resize-se"
            style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '4px', cursor: 'se-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div
            className="resize-handle resize-sw"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '4px', height: '4px', cursor: 'sw-resize' }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
        </>
      )}
    </div>
  );
};

export default Window;
