import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuBar: {
    display: 'flex',
    backgroundColor: 'var(--button-face)',
    borderBottom: '1px solid var(--button-shadow)',
    height: '21px',
    flexShrink: 0,
  },
});
