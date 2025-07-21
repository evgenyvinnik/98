import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuBar: {
    display: 'flex',
    backgroundColor: 'var(--button-face)',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--button-shadow)',
    height: '21px',
    flexShrink: 0,
  },
});
