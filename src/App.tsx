import React, { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './App.styles';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import Window from './components/Window/Window';
import { Program } from './programs.tsx';

interface AppWindow {
  id: number;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
}

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [nextWindowId, setNextWindowId] = useState(0);
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(0);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(prev => !prev);
  };

  const openWindow = (program: Program) => {
    const newWindow: AppWindow = {
      id: nextWindowId,
      title: program.title,
      content: <program.component />,
      x: 100 + nextWindowId * 20,
      y: 100 + nextWindowId * 20,
      width: 500,
      height: 400,
      zIndex: highestZIndex + 1,
      state: 'normal',
    };
    setHighestZIndex(highestZIndex + 1);
    setOpenWindows(prev => [...prev, newWindow]);
    setNextWindowId(prev => prev + 1);
    setActiveWindowId(newWindow.id);
    setIsStartMenuOpen(false);
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

  return (
    <div {...stylex.props(styles.main)}>
      <Desktop />
      {openWindows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(win => (
          <Window
            key={win.id}
            {...win}
            isActive={win.id === activeWindowId}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDrag={updateWindowPosition.bind(null, win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onRestore={() => restoreWindow(win.id)}
          >
            {win.content}
          </Window>
        ))}
      <StartMenu isOpen={isStartMenuOpen} onProgramClick={openWindow} />
      <Taskbar
        onStartButtonClick={toggleStartMenu}
        windows={openWindows}
        activeWindowId={activeWindowId}
        onWindowFocus={focusWindow}
      />
    </div>
  );
}

export default App;
