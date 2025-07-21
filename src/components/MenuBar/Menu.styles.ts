import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    border: '1px solid transparent',
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
    borderTop: '1px solid var(--button-shadow)',
    borderLeft: '1px solid var(--button-shadow)',
    borderRight: '1px solid var(--button-light)',
    borderBottom: '1px solid var(--button-light)',
  },
});
