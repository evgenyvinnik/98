import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuPopup: {
    position: 'absolute',
    backgroundColor: 'var(--button-face)',
        borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'var(--button-light)',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--button-light)',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'var(--button-shadow)',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--button-shadow)',
    boxShadow: '1px 1px 0px var(--button-dk-shadow)',
    padding: '2px',
    minWidth: '150px',
    outline: 'none',
    zIndex: 1000, // Should be managed by a context
  },
});
