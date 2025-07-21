import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Taskbar.styles.ts';
import TaskbarButton from '../TaskbarButton/TaskbarButton';

interface AppWindow {
  id: number;
  title: string;
}

interface TaskbarProps {
  onStartButtonClick: () => void;
  windows: AppWindow[];
  activeWindowId: number | null;
  onWindowFocus: (id: number) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ onStartButtonClick, windows, activeWindowId, onWindowFocus }) => {
  return (
    <div {...stylex.props(styles.taskbar)}>
      <button {...stylex.props(styles.startButton)} onClick={onStartButtonClick}>
        <img src="/images/start.png" alt="Start" {...stylex.props(styles.startIcon)} />
        <b>Start</b>
      </button>
      <div {...stylex.props(styles.divider)} />
      <div {...stylex.props(styles.tasks)}>
        {windows.map(win => (
          <TaskbarButton
            key={win.id}
            title={win.title}
            isActive={win.id === activeWindowId}
            onClick={() => onWindowFocus(win.id)}
          />
        ))}
      </div>
      <div {...stylex.props(styles.divider)} />
      <div {...stylex.props(styles.tray)}>
        <div {...stylex.props(styles.time)}>{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default Taskbar;
