import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2px 20px',
    whiteSpace: 'nowrap',
    color: 'var(--menu-text)',
    cursor: 'default',
    userSelect: 'none',
    height: '21px',
    gap: '16px',
  },
  highlighted: {
    backgroundColor: 'var(--hilight)',
    color: 'var(--hilight-text)',
  },
  disabled: {
    color: 'var(--gray-text)',
    textShadow: '1px 1px 0px var(--button-hilight)',
  },
  divider: {
    borderTop: '1px solid var(--button-shadow)',
    borderBottom: '1px solid var(--button-light)',
    margin: '3px 2px',
    height: '2px',
  },
  hasSubmenu: {},
  submenuArrow: {
    width: 0,
    height: 0,
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '4px solid currentColor',
  },
});
