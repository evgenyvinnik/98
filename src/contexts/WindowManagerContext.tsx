import React, { createContext, useState, useContext, ReactNode } from 'react';
import { type MenuBarDef } from '../components/MenuBar/MenuBar';
export interface AppWindow {
  id: number;
  title: string;
  icon: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  isResizable?: boolean;
  isMaximizable?: boolean;
  isMinimizable?: boolean;
  menus?: MenuBarDef;
}

export type NewWindowOptions = Omit<AppWindow, 'id' | 'zIndex' | 'x' | 'y' | 'state' | 'icon'> & {
  icon: string;
  id?: number;
  x?: number;
  y?: number;
  isResizable?: boolean;
  isMaximizable?: boolean;
  isMinimizable?: boolean;
  menus?: MenuBarDef;
};

interface WindowManagerContextType {
  openWindows: AppWindow[];
  activeWindowId: number | null;
  openWindow: (options: NewWindowOptions) => void;
  closeWindow: (id: number) => void;
  focusWindow: (id: number) => void;
  minimizeWindow: (id: number) => void;
  maximizeWindow: (id: number) => void;
  restoreWindow: (id: number) => void;
  updateWindowPosition: (id: number, x: number, y: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};

interface WindowManagerProviderProps {
  children: ReactNode;
}

export const WindowManagerProvider: React.FC<WindowManagerProviderProps> = ({ children }) => {
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [nextWindowId, setNextWindowId] = useState(0);
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(0);

  const openWindow = (options: NewWindowOptions) => {
    const id = options.id ?? nextWindowId;
    const newWindow: AppWindow = {
      ...options,
      id,
      x: options.x ?? 100 + nextWindowId * 20,
      y: options.y ?? 100 + nextWindowId * 20,
      zIndex: highestZIndex + 1,
      state: 'normal',
    };
    setHighestZIndex(highestZIndex + 1);
    setOpenWindows(prev => [...prev, newWindow]);
    if (options.id === undefined) {
      setNextWindowId(prev => prev + 1);
    }
    setActiveWindowId(id);
  };

  const closeWindow = (id: number) => {
    setOpenWindows(prev => prev.filter(win => win.id !== id));
  };

  const focusWindow = (id: number) => {
    const window = openWindows.find(win => win.id === id);
    if (window && window.state === 'minimized') {
      setOpenWindows(prev =>
        prev.map(win => (win.id === id ? { ...win, state: 'normal', zIndex: highestZIndex + 1 } : win))
      );
    } else {
      setOpenWindows(prev =>
        prev.map(win => (win.id === id ? { ...win, zIndex: highestZIndex + 1 } : win))
      );
    }
    setActiveWindowId(id);
    setHighestZIndex(highestZIndex + 1);
  };

  const minimizeWindow = (id: number) => {
    setOpenWindows(prev =>
      prev.map(win => (win.id === id ? { ...win, state: 'minimized' } : win))
    );
  };

  const maximizeWindow = (id: number) => {
    setOpenWindows(prev =>
      prev.map(win => (win.id === id ? { ...win, state: 'maximized' } : win))
    );
  };

  const restoreWindow = (id: number) => {
    setOpenWindows(prev =>
      prev.map(win => (win.id === id ? { ...win, state: 'normal' } : win))
    );
  };

  const updateWindowPosition = (id: number, x: number, y: number) => {
    setOpenWindows(prev =>
      prev.map(win => (win.id === id ? { ...win, x, y } : win))
    );
  };

  const value = {
    openWindows,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};
