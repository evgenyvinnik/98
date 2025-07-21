import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '28px',
    backgroundColor: 'silver',
    borderTop: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2px',
    zIndex: 5000,
  },
  startButton: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    padding: '2px 6px',
    border: '2px outset #fff',
    marginRight: '4px',
  },
  startIcon: {
    width: '16px',
    height: '16px',
    marginRight: '4px',
  },
  divider: {
    height: '100%',
    width: '2px',
    borderLeft: '1px solid #808080',
    borderRight: '1px solid #fff',
    margin: '0 4px',
  },
  tasks: {
    flexGrow: 1,
  },
  tray: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    border: '2px inset #fff',
    padding: '0 4px',
  },
  time: {
    fontSize: '12px',
  },
});
