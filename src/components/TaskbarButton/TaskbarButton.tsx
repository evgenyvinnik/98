import React from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  button: {
    height: '22px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderTopColor: 'var(--ButtonLight)',
    borderLeftColor: 'var(--ButtonLight)',
    borderRightColor: 'var(--ButtonHilight)',
    borderBottomColor: 'var(--ButtonHilight)',
    boxShadow: '1px 1px 0px black',
    backgroundColor: 'var(--ButtonFace)',
    padding: '0 6px',
    margin: '0 2px',
    minWidth: '100px',
    textAlign: 'left',
  },
  activeButton: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderTopColor: 'var(--ButtonShadow)',
    borderLeftColor: 'var(--ButtonShadow)',
    borderRightColor: 'var(--ButtonDkShadow)',
    borderBottomColor: 'var(--ButtonDkShadow)',
    boxShadow: 'none',
  },
});

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
