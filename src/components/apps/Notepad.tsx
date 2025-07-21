import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Notepad.styles';

const Notepad: React.FC = () => {
  return (
    <textarea {...stylex.props(styles.textarea)} />
  );
};

export default Notepad;
