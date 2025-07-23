import React, { useState, useRef, useEffect } from 'react';

/**
 * FolderViewItem component that represents a file or folder icon
 * This is a React version of the original FolderViewItem.js file
 */
const FolderViewItem = ({
  title,
  icon,
  path,
  isFolder,
  isShortcut,
  selected,
  onSelect,
  onOpen,
  viewMode
}) => {
  const [isSelected, setIsSelected] = useState(selected || false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const containerRef = useRef(null);
  
  // Update selected state when selected prop changes
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);
  
  // Handle pointer down for click and double-click
  const handlePointerDown = (event) => {
    // Ignore if ctrl, meta, shift, or alt is pressed
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    const doubleClickMs = 500;
    
    if (timeSinceLastClick < doubleClickMs) {
      // Double click - open the file or folder
      if (onOpen) {
        onOpen(path, isFolder);
      }
    } else {
      // Single click - select the item
      if (onSelect) {
        onSelect(path);
      }
    }
    
    setLastClickTime(now);
  };
  
  // Handle key down for keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Enter key - open the file or folder
      if (onOpen) {
        onOpen(path, isFolder);
      }
    }
  };
  
  // Determine icon size based on view mode
  const getIconSize = () => {
    switch (viewMode) {
      case 'LARGE_ICONS':
      case 'DESKTOP':
        return 32;
      case 'SMALL_ICONS':
      case 'DETAILS':
      case 'LIST':
        return 16;
      default:
        return 32;
    }
  };
  
  // Get styles based on view mode
  const getContainerStyles = () => {
    const baseStyles = {
      display: 'flex',
      flexDirection: viewMode === 'DETAILS' || viewMode === 'LIST' || viewMode === 'SMALL_ICONS' ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px',
      margin: '2px',
      cursor: 'pointer',
      userSelect: 'none',
      position: 'relative',
      touchAction: 'none',
      outline: 'none'
    };
    
    // Add styles based on view mode
    switch (viewMode) {
      case 'DESKTOP':
        return {
          ...baseStyles,
          width: '75px',
          height: '75px',
          textAlign: 'center'
        };
      case 'LARGE_ICONS':
        return {
          ...baseStyles,
          width: '75px',
          height: '75px',
          textAlign: 'center'
        };
      case 'SMALL_ICONS':
        return {
          ...baseStyles,
          width: '150px',
          height: '17px',
          textAlign: 'left'
        };
      case 'DETAILS':
      case 'LIST':
        return {
          ...baseStyles,
          width: '100%',
          height: '17px',
          textAlign: 'left'
        };
      default:
        return baseStyles;
    }
  };
  
  // Get icon wrapper styles
  const getIconWrapperStyles = () => {
    return {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: viewMode === 'DETAILS' || viewMode === 'LIST' || viewMode === 'SMALL_ICONS' ? 0 : '4px'
    };
  };
  
  // Get title styles
  const getTitleStyles = () => {
    const baseStyles = {
      color: 'white',
      textShadow: '1px 1px 0 black',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '1px 2px'
    };
    
    // Add styles based on view mode
    switch (viewMode) {
      case 'DESKTOP':
      case 'LARGE_ICONS':
        return {
          ...baseStyles,
          width: '100%',
          textAlign: 'center',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxHeight: '32px',
          fontSize: '12px'
        };
      case 'SMALL_ICONS':
      case 'DETAILS':
      case 'LIST':
        return {
          ...baseStyles,
          whiteSpace: 'nowrap',
          marginLeft: '4px',
          fontSize: '12px'
        };
      default:
        return baseStyles;
    }
  };
  
  // Get selection effect styles
  const getSelectionEffectStyles = () => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isSelected ? 'rgba(0, 0, 128, 0.5)' : 'transparent',
      pointerEvents: 'none'
    };
  };
  
  return (
    <div
      ref={containerRef}
      className={`folder-view-item ${isSelected ? 'selected' : ''}`}
      style={getContainerStyles()}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      draggable={true}
      data-path={path}
      data-is-folder={isFolder}
      data-is-shortcut={isShortcut}
    >
      <div className="icon-wrapper" style={getIconWrapperStyles()}>
        <img 
          src={icon} 
          alt={title} 
          width={getIconSize()} 
          height={getIconSize()} 
        />
        <div className="selection-effect" style={getSelectionEffectStyles()} />
      </div>
      <div className="title" style={getTitleStyles()}>
        {title}
      </div>
    </div>
  );
};

export default FolderViewItem;
