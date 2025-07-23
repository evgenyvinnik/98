import React, { useState, useEffect, useCallback } from 'react';
import { useWindows } from '../contexts/WindowContext';

const WindowSwitcher = () => {
  const { windows, focusWindow } = useWindows();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedWindows = [...windows].sort((a, b) => b.zIndex - a.zIndex);

  const handleKeyDown = useCallback((e) => {
    if (e.altKey && (e.key === '1' || e.code === 'Backquote' || e.code === 'Tab')) {
      e.preventDefault();
      if (!isOpen) {
        setSelectedIndex(0);
        setIsOpen(true);
      } else {
        setSelectedIndex(prev => (prev + (e.shiftKey ? -1 : 1) + sortedWindows.length) % sortedWindows.length);
      }
    }
  }, [isOpen, sortedWindows.length]);

  const handleKeyUp = useCallback((e) => {
    if (!e.altKey && isOpen) {
      if (sortedWindows[selectedIndex]) {
        const selectedWindow = sortedWindows[selectedIndex];
        focusWindow(selectedWindow.id);
        selectedWindow.win.unminimize();
        selectedWindow.win.bringToFront();
      }
      setIsOpen(false);
    }
  }, [isOpen, selectedIndex, sortedWindows, focusWindow]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (!isOpen || sortedWindows.length < 2) {
    return null;
  }

  const selectedWindow = sortedWindows[selectedIndex];
  const iconHTML = (win) => (win.win.getIconAtSize(32) ?? window.$('<img>').attr({ src: "/images/icons/task-32x32.png", width: 32, height: 32, alt: win.title }))[0].outerHTML;

  return (
    <div className='window-switcher outset-deep'>
      <ul className='window-switcher-list'>
        {sortedWindows.map((win, index) => (
          <li key={win.id} className={`window-switcher-item ${index === selectedIndex ? 'active' : ''}`}>
            <span dangerouslySetInnerHTML={{ __html: iconHTML(win) }} />
          </li>
        ))}
      </ul>
      <div className='window-switcher-window-name inset-deep'>
        {selectedWindow?.title}
      </div>
    </div>
  );
};

export default WindowSwitcher;
