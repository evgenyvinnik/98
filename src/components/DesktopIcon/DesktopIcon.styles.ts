import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '75px',
    padding: '4px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 128, 0.1)',
    },
  },
  icon: {
    width: '32px',
    height: '32px',
  },
  name: {
    color: 'white',
    textShadow: '1px 1px 2px black',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '5px',
  },
});
