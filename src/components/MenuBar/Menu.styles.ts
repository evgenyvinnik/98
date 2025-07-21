import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
        borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    background: 'none',
    color: 'var(--menu-text)',
    padding: '2px 6px',
    outline: 'none',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'var(--hilight)',
      color: 'var(--hilight-text)',
    },
  },
  menuButtonOpen: {
    backgroundColor: 'var(--hilight)',
    color: 'var(--hilight-text)',
        borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'var(--button-shadow)',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--button-shadow)',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: 'var(--button-light)',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--button-light)',
  },
});
