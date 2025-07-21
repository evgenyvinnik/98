import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  window: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '400px',
    height: '300px',
    backgroundColor: 'silver',
    border: '2px outset #fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  titleBar: {
    backgroundColor: '#808080', // Inactive color
    color: '#c0c0c0',
    padding: '2px 4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    cursor: 'move',
  },
  activeTitleBar: {
    backgroundColor: '#000080', // Active color
    color: 'white',
  },
  title: {
    flexGrow: 1,
  },
  closeButton: {
    backgroundColor: 'silver',
    border: '2px outset #fff',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    padding: 0,
  },
  content: {
    flexGrow: 1,
    padding: '4px',
    backgroundColor: 'white',
    border: '2px inset #fff',
    margin: '2px',
  },
});
