import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { AppWindow } from '../../contexts/WindowManagerContext';
import { getIconUrl } from '../Desktop/icon-helpers';

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  switcher: {
    backgroundColor: 'var(--ButtonFace)',
    borderWidth: '2px',
    borderStyle: 'outset',
    borderColor: 'var(--ButtonHilight)',
    padding: '16px',
    minWidth: '300px',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '16px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  activeItem: {
    backgroundColor: 'var(--ActiveTitle)',
    color: 'var(--ActiveTitleText)',
  },
  icon: {
    width: '32px',
    height: '32px',
  },
  title: {
    marginTop: '8px',
    textAlign: 'center',
  },
});

interface WindowSwitcherProps {
  windows: AppWindow[];
  selectedIndex: number;
}

const WindowSwitcher: React.FC<WindowSwitcherProps> = ({ windows, selectedIndex }) => {
  const selectedWindow = windows[selectedIndex];

  return (
    <div {...stylex.props(styles.overlay)}>
      <div {...stylex.props(styles.switcher)}>
        <ul {...stylex.props(styles.list)}>
          {windows.map((win, index) => (
            <li key={win.id} {...stylex.props(styles.item, index === selectedIndex && styles.activeItem)}>
              <img
                src={getIconUrl(win.icon, { isDirectory: () => false }, 32)}
                alt={win.title}
                {...stylex.props(styles.icon)}
              />
            </li>
          ))}
        </ul>
        {selectedWindow && (
          <div {...stylex.props(styles.title)}>{selectedWindow.title}</div>
        )}
      </div>
    </div>
  );
};

export default WindowSwitcher;
