import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuPopup: {
    position: 'absolute',
    backgroundColor: 'var(--button-face)',
    borderTop: '1px solid var(--button-light)',
    borderLeft: '1px solid var(--button-light)',
    borderRight: '1px solid var(--button-shadow)',
    borderBottom: '1px solid var(--button-shadow)',
    boxShadow: '1px 1px 0px var(--button-dk-shadow)',
    padding: '2px',
    minWidth: '150px',
    outline: 'none',
    zIndex: 1000, // Should be managed by a context
  },
});
