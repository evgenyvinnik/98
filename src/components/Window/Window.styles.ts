import stylex from '@stylexjs/stylex';

const PADDING = 2;

export const styles = stylex.create({
  window: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--button-face)',
    padding: `${PADDING}px`,
    borderTop: '1px solid var(--button-light)',
    borderLeft: '1px solid var(--button-light)',
    borderRight: '1px solid var(--button-shadow)',
    borderBottom: '1px solid var(--button-shadow)',
    boxShadow: '1px 1px 0px var(--button-dk-shadow)',
  },
  maximized: {
    border: 'none',
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
    borderTop: '1px solid var(--button-shadow)',
    borderLeft: '1px solid var(--button-shadow)',
    borderRight: '1px solid var(--button-light)',
    borderBottom: '1px solid var(--button-light)',
    overflow: 'auto',
    padding: '2px',
  },
});
