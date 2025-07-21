import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  button: {
    height: '22px',
    border: '2px outset #fff',
    backgroundColor: 'silver',
    padding: '0 6px',
    margin: '0 2px',
    minWidth: '100px',
    textAlign: 'left',
  },
  activeButton: {
    borderStyle: 'inset',
    backgroundColor: '#e0e0e0',
  },
});
