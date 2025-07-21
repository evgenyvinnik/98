import stylex from '@stylexjs/stylex';

export const styles = stylex.create({
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2px',
    height: '18px',
    background: 'linear-gradient(to right, var(--inactive-title), var(--gradient-inactive-title))',
    color: 'var(--inactive-title-text)',
    fontWeight: 'bold',
    userSelect: 'none',
  },
  active: {
    background: 'linear-gradient(to right, var(--active-title), var(--gradient-active-title))',
    color: 'var(--title-text)',
  },
  title: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: '2px',
  },
  controls: {
    display: 'flex',
  },
});

const buttonSprite =
  'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAKCAYAAADo3z3CAAAAoUlEQVRIS9VVWw7AIAib9z/0FpZgCOFRgpluf9MClhYdV++7gfDhYLxYDw+UyiHd5F8S5lr6zNa6Xpv/KwhHOahQpLB1+CwfycgYrwmE0WK8MTsIR1aOGsR+NYkkYzN5/pGwVA9xA/diq8LeHCKuQxQ+aoYt2yJWtpSNZth0edRpGVC5eGQcSg4hXLml3fdpBeHs8evWyPKX9ruXVqnYCeAHA8IyC9K2kmkAAAAASUVORK5CYII=)';

export const titleBarButton = stylex.create({
  button: {
    width: '16px',
    height: '14px',
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
    backgroundColor: 'var(--button-face)',
    backgroundRepeat: 'no-repeat',
    ':active': {
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
  },
  minimize: {
    backgroundPosition: '0 0',
    backgroundImage: buttonSprite,
  },
  maximize: {
    backgroundPosition: '-16px 0',
    backgroundImage: buttonSprite,
  },
  restore: {
    backgroundPosition: '-32px 0',
    backgroundImage: buttonSprite,
  },
  close: {
    backgroundPosition: '-48px 0',
    backgroundImage: buttonSprite,
    marginLeft: '2px',
  },
});
