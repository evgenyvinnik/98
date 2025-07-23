import React, { createContext, useState, useContext, useCallback } from 'react';
import { programs, fileAssociations } from '../program-data.js';

const WindowContext = createContext();

export const useWindows = () => useContext(WindowContext);

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);

  const addWindow = useCallback((win) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newWindow = {
      id,
      win,
      title: win.getTitle(),
      icon: win.getIconAtSize(16),
      zIndex: windows.length + 1,
    };
    setWindows(prev => [...prev, newWindow]);
    setFocusedWindow(id);
    return id;
  }, [windows.length]);

  const removeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindow === id) {
      setFocusedWindow(null);
    }
  }, [focusedWindow]);

  const focusWindow = useCallback((id) => {
    setFocusedWindow(id);
    setWindows(prev => {
      const focusedZIndex = prev.find(w => w.id === id)?.zIndex;
      if (focusedZIndex === undefined) return prev; // Window not found

      // Give the focused window the highest z-index
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, zIndex: prev.length };
        }
        // Decrement z-index of windows that were on top of the focused one
        if (w.zIndex > focusedZIndex) {
          return { ...w, zIndex: w.zIndex - 1 };
        }
        return w;
      });
    });
  }, []);

  const updateWindow = useCallback((id, newProps) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...newProps } : w));
  }, []);

  const launchProgram = useCallback((programId) => {
    const program = programs.find(p => p.id === programId);
    if (program) {
        program.launch();
    } else {
        console.error(`Program with id ${programId} not found.`);
    }
  }, []);

  const launchProgramByFilePath = useCallback((filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    const programId = fileAssociations[extension];
    const program = programs.find(p => p.id === programId);

    if (program) {
      program.launch(filePath);
    } else {
      window.showMessageBox({
        title: 'Open With',
        message: `No program is associated with the file extension .${extension}`,
      });
    }
  }, []);

  useState(() => {
    window.windows = {
      add: addWindow,
      remove: removeWindow,
      focus: focusWindow,
      update: updateWindow,
      launch: launchProgram,
      launchByPath: launchProgramByFilePath,
    };
    return () => { delete window.windows; };
  }, [addWindow, removeWindow, focusWindow, updateWindow, launchProgram, launchProgramByFilePath]);

  const value = { windows, focusedWindow, addWindow, removeWindow, focusWindow, updateWindow, launchProgram, launchProgramByFilePath };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
};
