import React from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  textarea: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderStyle: 'none',
    resize: 'none',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
});

const Notepad: React.FC = () => {
  return (
    <textarea {...stylex.props(styles.textarea)} />
  );
};

export default Notepad;
