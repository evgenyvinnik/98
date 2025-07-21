import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  startMenu: {
    position: 'absolute',
    bottom: '28px', // Height of the taskbar
    left: '0px',
    width: '180px',
    height: '300px',
    backgroundColor: 'silver',
    border: '2px outset #fff',
    display: 'flex',
    zIndex: 5001,
  },
  sidebar: {
    width: '25px',
    height: '100%',
    backgroundColor: '#000080',
    display: 'flex',
    alignItems: 'flex-end',
  },
  sidebarText: {
    color: 'white',
    fontWeight: 'bold',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    paddingBottom: '10px',
    fontSize: '18px',
  },
  programsList: {
    flexGrow: 1,
    padding: '4px',
    listStyle: 'none',
    margin: 0,
  },
  programItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#000080',
      color: 'white',
    },
  },
  programIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
  },
});
