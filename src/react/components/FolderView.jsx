import React, { useState, useEffect, useRef } from 'react';
import FolderViewItem from './FolderViewItem';
import useFilesystem from '../hooks/useFilesystem';

// Constants from the original FolderView.js
const VIEW_MODES = {
  THUMBNAILS: "THUMBNAILS",
  LARGE_ICONS: "LARGE_ICONS",
  SMALL_ICONS: "SMALL_ICONS",
  DETAILS: "DETAILS",
  LIST: "LIST",
  DESKTOP: "DESKTOP",
};

const SORT_MODES = {
  NAME: "NAME",
  TYPE: "TYPE",
  SIZE: "SIZE",
  DATE: "DATE",
};

const GRID_SIZE = {
  LARGE_ICONS: { x: 75, y: 75 },
  SMALL_ICONS: { x: 150, y: 17 },
  DESKTOP: { x: 75, y: 75 }
};

// File extension to icon mapping (simplified version)
const FILE_EXTENSION_ICONS = {
  txt: "notepad-file",
  md: "notepad-file",
  json: "notepad-file",
  js: "js-file",
  html: "html-file",
  css: "css-file",
  jpg: "image-file",
  jpeg: "image-file",
  png: "image-file",
  gif: "image-file",
  exe: "executable-file",
  lnk: "shortcut",
  url: "internet-shortcut",
};

/**
 * FolderView component that displays files and folders in a grid or list
 * This is a React version of the original FolderView.js file
 */
const FolderView = ({
  folderPath,
  asDesktop = false,
  onStatus,
  openFolder,
  openFileOrFolder
}) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [config, setConfig] = useState({
    viewMode: asDesktop ? VIEW_MODES.DESKTOP : VIEW_MODES.LARGE_ICONS,
    sortMode: SORT_MODES.NAME,
    viewAsWebPage: folderPath !== "/desktop/"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const containerRef = useRef(null);
  const filesystem = useFilesystem();
  
  // Load folder contents when component mounts or folder path changes
  useEffect(() => {
    if (filesystem.isReady) {
      loadFolderContents();
    }
  }, [folderPath, filesystem.isReady]);
  
  // Load folder configuration from localStorage
  useEffect(() => {
    try {
      const storageKey = `folder-config:${asDesktop ? "desktop" : folderPath}`;
      const configJson = localStorage.getItem(storageKey);
      const savedConfig = JSON.parse(configJson);
      
      if (savedConfig) {
        // Validate view mode
        if (!VIEW_MODES[savedConfig.viewMode]) {
          savedConfig.viewMode = asDesktop ? VIEW_MODES.DESKTOP : VIEW_MODES.LARGE_ICONS;
        }
        
        // Validate sort mode
        if (!SORT_MODES[savedConfig.sortMode]) {
          savedConfig.sortMode = SORT_MODES.NAME;
        }
        
        // Set default for viewAsWebPage if not present
        if (savedConfig.viewAsWebPage === undefined) {
          savedConfig.viewAsWebPage = folderPath !== "/desktop/";
        }
        
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error("Failed to read folder config:", error);
    }
  }, [folderPath, asDesktop]);
  
  // Save folder configuration to localStorage
  const saveConfig = (newConfig) => {
    try {
      const storageKey = `folder-config:${asDesktop ? "desktop" : folderPath}`;
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    } catch (error) {
      console.error("Can't write to localStorage:", error);
    }
  };
  
  // Configure folder view
  const configure = (configProps) => {
    const newConfig = { ...config, ...configProps };
    setConfig(newConfig);
    saveConfig(newConfig);
    arrangeIcons();
  };
  
  // Cycle through view modes
  const cycleViewMode = () => {
    const viewModes = [
      VIEW_MODES.LARGE_ICONS,
      VIEW_MODES.SMALL_ICONS,
      VIEW_MODES.LIST,
    ];
    
    const currentViewModeIndex = viewModes.indexOf(config.viewMode);
    const nextViewModeIndex = (currentViewModeIndex + 1) % viewModes.length;
    
    configure({ viewMode: viewModes[nextViewModeIndex] });
  };
  
  // Load folder contents
  const loadFolderContents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Read directory contents
      const fileNames = await filesystem.readdir(folderPath);
      
      // Process each file/folder
      const itemPromises = fileNames.map(async (name) => {
        try {
          const path = `${folderPath === '/' ? '' : folderPath}/${name}`;
          
          // Get file stats
          const stats = await new Promise((resolve, reject) => {
            window.fs.stat(path, (err, stats) => {
              if (err) reject(err);
              else resolve(stats);
            });
          });
          
          // Determine if it's a folder
          const isFolder = stats.isDirectory();
          
          // Determine if it's a shortcut
          const isShortcut = !isFolder && (
            name.toLowerCase().endsWith('.lnk') || 
            name.toLowerCase().endsWith('.url')
          );
          
          // Get file extension
          const extension = isFolder ? null : name.substring(name.lastIndexOf('.')).toLowerCase();
          
          // Determine icon
          let icon;
          if (isFolder) {
            icon = '/images/icons/folder-32x32.png';
          } else if (isShortcut) {
            icon = '/images/icons/shortcut-32x32.png';
          } else if (extension && FILE_EXTENSION_ICONS[extension.substring(1)]) {
            const iconName = FILE_EXTENSION_ICONS[extension.substring(1)];
            icon = `/images/icons/${iconName}-32x32.png`;
          } else {
            icon = '/images/icons/file-32x32.png';
          }
          
          return {
            name,
            path,
            isFolder,
            isShortcut,
            icon,
            size: stats.size,
            modified: new Date(stats.mtime),
            extension
          };
        } catch (error) {
          console.error(`Error processing item ${name}:`, error);
          return null;
        }
      });
      
      // Wait for all items to be processed
      const processedItems = (await Promise.all(itemPromises)).filter(item => item !== null);
      
      // Sort items
      const sortedItems = sortItems(processedItems);
      
      setItems(sortedItems);
      setIsLoading(false);
      
      if (onStatus) {
        onStatus({
          status: 'ready',
          itemCount: sortedItems.length
        });
      }
    } catch (error) {
      console.error('Error loading folder contents:', error);
      setError(`Error loading folder: ${error.message}`);
      setIsLoading(false);
      
      if (onStatus) {
        onStatus({
          status: 'error',
          error: error.message
        });
      }
    }
  };
  
  // Sort items based on sort mode
  const sortItems = (items) => {
    const { sortMode } = config;
    
    return [...items].sort((a, b) => {
      // Always put folders first
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      
      // Then sort by the specified mode
      switch (sortMode) {
        case SORT_MODES.NAME:
          return a.name.localeCompare(b.name);
        case SORT_MODES.TYPE:
          if (a.isFolder && b.isFolder) return a.name.localeCompare(b.name);
          if (a.extension === b.extension) return a.name.localeCompare(b.name);
          return (a.extension || '').localeCompare(b.extension || '');
        case SORT_MODES.SIZE:
          if (a.size === b.size) return a.name.localeCompare(b.name);
          return a.size - b.size;
        case SORT_MODES.DATE:
          if (a.modified.getTime() === b.modified.getTime()) return a.name.localeCompare(b.name);
          return a.modified.getTime() - b.modified.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
  };
  
  // Arrange icons in a grid
  const arrangeIcons = () => {
    // This is a simplified version of the original arrangeIcons function
    // In a real implementation, this would position the icons in a grid
    // based on the view mode and container size
  };
  
  // Handle item selection
  const handleItemSelect = (path) => {
    // Toggle selection
    if (selectedItems.includes(path)) {
      setSelectedItems(selectedItems.filter(item => item !== path));
    } else {
      setSelectedItems([...selectedItems, path]);
    }
  };
  
  // Handle item open
  const handleItemOpen = (path, isFolder) => {
    if (openFileOrFolder) {
      openFileOrFolder(path);
    } else {
      console.log(`Open ${isFolder ? 'folder' : 'file'}: ${path}`);
      
      if (isFolder && openFolder) {
        openFolder(path);
      } else {
        // Use the system execute file function if available
        if (window.systemExecuteFile) {
          window.systemExecuteFile(path);
        }
      }
    }
  };
  
  // Get container styles based on view mode
  const getContainerStyles = () => {
    const baseStyles = {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      outline: 'none',
      userSelect: 'none'
    };
    
    // Add styles for desktop view
    if (asDesktop) {
      return {
        ...baseStyles,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 75px)',
        gridAutoRows: '75px',
        gridGap: '0',
        alignContent: 'start'
      };
    }
    
    // Add styles based on view mode
    switch (config.viewMode) {
      case VIEW_MODES.LARGE_ICONS:
        return {
          ...baseStyles,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 75px)',
          gridAutoRows: '75px',
          gridGap: '0',
          alignContent: 'start'
        };
      case VIEW_MODES.SMALL_ICONS:
        return {
          ...baseStyles,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 150px)',
          gridAutoRows: '17px',
          gridGap: '0',
          alignContent: 'start'
        };
      case VIEW_MODES.LIST:
      case VIEW_MODES.DETAILS:
        return {
          ...baseStyles,
          display: 'flex',
          flexDirection: 'column'
        };
      default:
        return baseStyles;
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={`folder-view ${asDesktop ? 'desktop' : ''}`}
      style={getContainerStyles()}
      tabIndex={0}
      data-view-mode={config.viewMode}
    >
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : items.length === 0 ? (
        <div className="empty">This folder is empty.</div>
      ) : (
        items.map((item) => (
          <FolderViewItem
            key={item.path}
            title={item.name}
            icon={item.icon}
            path={item.path}
            isFolder={item.isFolder}
            isShortcut={item.isShortcut}
            selected={selectedItems.includes(item.path)}
            onSelect={handleItemSelect}
            onOpen={handleItemOpen}
            viewMode={config.viewMode}
          />
        ))
      )}
    </div>
  );
};

export default FolderView;
