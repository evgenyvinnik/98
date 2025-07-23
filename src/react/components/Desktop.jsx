import React, { useState, useEffect } from 'react';
import { useWindows } from '../context/WindowsContext';
import Window from './Window';

/**
 * Desktop component that renders the desktop background and all windows
 * This will gradually replace the functionality in $desktop.js
 */
const Desktop = () => {
  const { windows, activeWindowId } = useWindows();
  const [background, setBackground] = useState('url(/images/clouds.jpg)');
  const [icons, setIcons] = useState([]);

  // Load desktop icons (this would eventually connect to the existing filesystem)
  useEffect(() => {
    // For now, we'll just define some placeholder icons
    // Later, this will integrate with the existing filesystem code
    setIcons([
      { id: 'my-computer', title: 'My Computer', icon: '/images/icons/my-computer-32x32.png' },
      { id: 'my-documents', title: 'My Documents', icon: '/images/icons/my-documents-32x32.png' },
      { id: 'network-neighborhood', title: 'Network Neighborhood', icon: '/images/icons/network-neighborhood-32x32.png' },
      { id: 'recycle-bin', title: 'Recycle Bin', icon: '/images/icons/recycle-bin-32x32.png' },
      { id: 'internet-explorer', title: 'Internet Explorer', icon: '/images/icons/internet-explorer-32x32.png' }
    ]);
  }, []);

  return (
    <div 
      className="desktop" 
      style={{ 
        backgroundImage: background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      {/* Desktop Icons */}
      <div className="desktop-icons">
        {icons.map(icon => (
          <div key={icon.id} className="desktop-icon">
            <img src={icon.icon} alt={icon.title} />
            <span>{icon.title}</span>
          </div>
        ))}
      </div>

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
