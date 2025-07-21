import React from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    backgroundColor: 'var(--ButtonFace)',
    color: 'var(--ButtonText)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  icon: {
    width: '32px',
    height: '32px',
    marginRight: '16px',
    flexShrink: 0,
  },
  message: {
    fontFamily: 'MS Sans Serif, Arial, sans-serif',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  buttons: {
    textAlign: 'center',
    paddingTop: '12px',
  },
  button: {
    minWidth: '75px',
    height: '23px',
    margin: '0 4px',
  },
});

export interface ButtonProps {
  label: string;
  value: string;
  default?: boolean;
}

export interface MessageBoxProps {
  message: string;
  buttons: ButtonProps[];
  iconID: 'info' | 'warning' | 'error' | 'nuke';
  onClose: (value: string) => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, buttons, iconID, onClose }) => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.content)}>
        <img src={`/images/icons/${iconID}-32x32-8bpp.png`} alt={iconID} {...stylex.props(styles.icon)} />
        <p {...stylex.props(styles.message)}>{message}</p>
      </div>
      <div {...stylex.props(styles.buttons)}>
        {buttons.map(button => (
          <button
            key={button.value}
            {...stylex.props(styles.button)}
            onClick={() => onClose(button.value)}
            autoFocus={button.default}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
