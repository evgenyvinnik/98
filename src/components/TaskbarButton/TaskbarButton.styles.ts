import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  button: {
    height: '22px',
    border: '1px solid var(--ButtonHilight)',
    borderLeftColor: 'var(--ButtonLight)',
    borderTopColor: 'var(--ButtonLight)',
    boxShadow: '1px 1px 0px black',
    backgroundColor: 'var(--ButtonFace)',
    padding: '0 6px',
    margin: '0 2px',
    minWidth: '100px',
    textAlign: 'left',
  },
  activeButton: {
    border: '1px solid var(--ButtonDkShadow)',
    borderLeftColor: 'var(--ButtonShadow)',
    borderTopColor: 'var(--ButtonShadow)',
    boxShadow: 'none',
  },
});
