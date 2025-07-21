import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './TaskbarButton.styles';

interface TaskbarButtonProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const TaskbarButton: React.FC<TaskbarButtonProps> = ({ title, isActive, onClick }) => {
  return (
    <button {...stylex.props(styles.button, isActive && styles.activeButton)} onClick={onClick}>
      {title}
    </button>
  );
};

export default TaskbarButton;
