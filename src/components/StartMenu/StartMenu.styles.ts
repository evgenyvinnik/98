import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  startMenu: {
    position: 'absolute',
    bottom: '28px', // Height of the taskbar
    left: 0,
    width: '200px',
    height: '300px',
    backgroundColor: 'var(--ButtonFace)',
    border: '1px solid var(--ButtonHilight)',
    borderLeftColor: 'var(--ButtonLight)',
    borderTopColor: 'var(--ButtonLight)',
    boxShadow: '1px 1px 0px 1px black',
    display: 'flex',
    zIndex: 5001,
  },
  sidebar: {
    width: '25px',
    height: '100%',
    backgroundColor: 'var(--ActiveTitle)',
    display: 'flex',
    alignItems: 'flex-end',
  },
  sidebarText: {
    color: 'var(--ActiveTitleText)',
    fontWeight: 'bold',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '20px',
    padding: '10px 0',
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
