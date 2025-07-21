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
  zIndex: number;
}

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([]);
  const [nextWindowId, setNextWindowId] = useState(0);
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);

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
      zIndex: openWindows.length,
    };
    setOpenWindows(prev => [...prev, newWindow]);
    setNextWindowId(prev => prev + 1);
    setActiveWindowId(newWindow.id);
    setIsStartMenuOpen(false);
  };

  const closeWindow = (id: number) => {
    setOpenWindows(prev => prev.filter(win => win.id !== id));
  };

  const focusWindow = (id: number) => {
    setActiveWindowId(id);
    setOpenWindows(prev =>
      prev.map(win =>
        win.id === id
          ? { ...win, zIndex: prev.length - 1 }
          : { ...win, zIndex: win.zIndex > prev.find(w => w.id === id)!.zIndex ? win.zIndex - 1 : win.zIndex }
      )
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
            title={win.title}
            x={win.x}
            y={win.y}
            isActive={win.id === activeWindowId}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDrag={updateWindowPosition.bind(null, win.id)}
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
