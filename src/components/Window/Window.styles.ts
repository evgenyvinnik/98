import stylex from '@stylexjs/stylex';

const PADDING = 2;

export const styles = stylex.create({
  window: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--button-face)',
    padding: `${PADDING}px`,
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
  },
  maximized: {
    borderWidth: 0,
    boxShadow: 'none',
    padding: 0,
  },
  focused: {
    // This will be used to style the TitleBar component
  },
  content: {
    flex: 1,
    backgroundColor: 'var(--window)',
    color: 'var(--window-text)',
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
    overflow: 'auto',
    padding: '2px',
  },
});
