import React, { useState, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './App.styles';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import Window from './components/Window/Window';
import WindowSwitcher from './components/WindowSwitcher/WindowSwitcher';
import { WindowManagerProvider, useWindowManager } from './contexts/WindowManagerContext';
import { MessageBoxProvider } from './contexts/MessageBoxContext';
import { ThreeDeeFunProvider } from './contexts/ThreeDeeFunContext';
import { VisualizerProvider } from './contexts/VisualizerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FileSystemProvider } from './contexts/FileSystemContext';
import { programs, type Program } from './programs.tsx';

const AppContent: React.FC = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { openWindows, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, updateWindowPosition } = useWindowManager();
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);
  const [switcherIndex, setSwitcherIndex] = useState(0);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(prev => !prev);
  };

  const handleProgramClick = (program: Program) => {
    openWindow({
      title: program.title,
            icon: program.icon,
      content: React.createElement(program.component),
      width: 500,
      height: 400,
    });
    setIsStartMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === '1' || e.code === 'Backquote' || e.code === 'Tab')) {
        e.preventDefault();
        if (!isSwitcherVisible) {
          const sortedWindows = [...openWindows].sort((a, b) => b.zIndex - a.zIndex);
          const activeIndex = sortedWindows.findIndex(win => win.id === activeWindowId);
          setSwitcherIndex(activeIndex !== -1 ? activeIndex : 0);
        }
        setIsSwitcherVisible(true);
        setSwitcherIndex(prevIndex => (prevIndex + (e.shiftKey ? -1 : 1) + openWindows.length) % openWindows.length);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        if (isSwitcherVisible) {
          const sortedWindows = [...openWindows].sort((a, b) => b.zIndex - a.zIndex);
          const selectedWindow = sortedWindows[switcherIndex];
          if (selectedWindow) {
            focusWindow(selectedWindow.id);
          }
          setIsSwitcherVisible(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSwitcherVisible, openWindows, activeWindowId, switcherIndex, focusWindow]);

  return (
    <div {...stylex.props(styles.main)}>
      <Desktop />
      {openWindows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(win => (
          <Window
                        key={win.id}
            {...win}
            menus={win.menus}
            isActive={win.id === activeWindowId}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDrag={(x, y) => updateWindowPosition(win.id, x, y)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onRestore={() => restoreWindow(win.id)}
          >
            {win.content}
          </Window>
        ))}
      <StartMenu isOpen={isStartMenuOpen} programs={programs} onProgramClick={handleProgramClick} />
                  <Taskbar
        onStartButtonClick={toggleStartMenu}
        windows={openWindows}
        activeWindowId={activeWindowId}
        onWindowFocus={focusWindow}
        onWindowMinimize={minimizeWindow}
      />
      {isSwitcherVisible && (
        <WindowSwitcher
          windows={[...openWindows].sort((a, b) => b.zIndex - a.zIndex)}
          selectedIndex={switcherIndex}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
            <ThemeProvider>
      <FileSystemProvider>
        <WindowManagerProvider>
          <MessageBoxProvider>
            <ThreeDeeFunProvider>
              <VisualizerProvider>
                <AppContent />
              </VisualizerProvider>
            </ThreeDeeFunProvider>
          </MessageBoxProvider>
        </WindowManagerProvider>
      </FileSystemProvider>
    </ThemeProvider>
  );
};

export default App;
