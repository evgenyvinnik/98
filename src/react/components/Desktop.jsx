import React, { useState, useEffect, useRef } from 'react';
import { useWindows } from '../context/WindowsContext';
import Window from './Window';
import FolderView from './FolderView';
import useFilesystem from '../hooks/useFilesystem';

/**
 * Desktop component that renders the desktop background and all windows
 * This will gradually replace the functionality in $desktop.js
 */
const Desktop = () => {
  const { windows, activeWindowId } = useWindows();
  const [background, setBackground] = useState('url(/images/clouds.jpg)');
  const [backgroundRepeat, setBackgroundRepeat] = useState('no-repeat');
  const [backgroundPosition, setBackgroundPosition] = useState('center');
  const [backgroundSize, setBackgroundSize] = useState('cover');
  const [icons, setIcons] = useState([]);
  const [themeCSSProperties, setThemeCSSProperties] = useState(null);
  
  const desktopRef = useRef(null);
  const filesystem = useFilesystem();

  // The desktop folder path is defined in filesystem-setup.js
  const desktopFolderPath = '/desktop/';
  
  // Handle opening files or folders from the desktop
  const handleOpenFileOrFolder = (path) => {
    console.log(`Opening file or folder: ${path}`);
    
    // Use the system execute file function if available
    if (window.systemExecuteFile) {
      window.systemExecuteFile(path);
    }
  };
  
  // Load wallpaper and theme from localStorage
  useEffect(() => {
    try {
      const wallpaperDataUrl = localStorage.getItem('wallpaper-data-url');
      const wallpaperRepeat = localStorage.getItem('wallpaper-repeat');
      const themeFileContent = localStorage.getItem('desktop-theme');
      
      if (wallpaperDataUrl) {
        fetch(wallpaperDataUrl)
          .then(r => r.blob())
          .then(file => {
            setDesktopWallpaper(file, wallpaperRepeat, false);
          });
      }
      
      if (themeFileContent) {
        loadThemeFromText(themeFileContent);
      }
    } catch (error) {
      console.error('Error loading wallpaper or theme from localStorage:', error);
    }
  }, []);
  
  // Prevent page scrolling
  useEffect(() => {
    const preventScroll = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('scroll', preventScroll);
    window.addEventListener('focusin', preventScroll);
    
    return () => {
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('focusin', preventScroll);
    };
  }, []);

  // Set desktop wallpaper
  const setDesktopWallpaper = (file, repeat, saveToLocalStorage) => {
    const blobUrl = URL.createObjectURL(file);
    setBackground(`url(${blobUrl})`);
    setBackgroundRepeat(repeat);
    setBackgroundPosition('center');
    setBackgroundSize('auto');
    
    if (saveToLocalStorage) {
      const fr = new FileReader();
      fr.onload = () => {
        localStorage.setItem('wallpaper-data-url', fr.result);
        localStorage.setItem('wallpaper-repeat', repeat);
      };
      fr.onerror = () => {
        console.error('Error reading file (for setting wallpaper)', file);
      };
      fr.readAsDataURL(file);
    }
  };
  
  // Load theme from file
  const loadThemeFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      loadThemeFromText(reader.result);
    };
    reader.readAsText(file);
  };
  
  // Apply theme CSS properties
  const applyTheme = (cssProperties) => {
    // In a real implementation, this would apply the CSS properties to the document
    setThemeCSSProperties(cssProperties);
    console.log('Applying theme:', cssProperties);
  };
  
  // Load theme from text content
  const loadThemeFromText = (fileText) => {
    // In a real implementation, this would parse the theme file
    const cssProperties = {}; // parseThemeFileString(fileText);
    applyTheme(cssProperties);
  };
  
  // Handle file drop for themes
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
      if (file.name.match(/\.theme(pack)?$/i)) {
        loadThemeFile(file);
      }
    }
  };
  
  // Prevent default drag behaviors
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  return (
    <div 
      ref={desktopRef}
      className="desktop" 
      style={{ 
        backgroundImage: background,
        backgroundSize: backgroundSize,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: backgroundRepeat,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        touchAction: 'none' // Prevent touch scrolling
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Desktop Icons using FolderView */}
      <FolderView 
        folderPath={desktopFolderPath}
        asDesktop={true}
        openFileOrFolder={handleOpenFileOrFolder}
      />

      {/* Windows */}
      {windows.map(window => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            isMaximized={window.isMaximized}
            isActive={window.id === activeWindowId}
          >
            {window.component && React.createElement(window.component, window.props)}
          </Window>
        )
      ))}
    </div>
  );
};

export default Desktop;
