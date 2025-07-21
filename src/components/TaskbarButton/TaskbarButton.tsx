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
    borderStyle: 'inset',
    boxShadow: 'none',
    padding: '1px 5px',
  },
  icon: {
    width: '16px',
    height: '16px',
    marginRight: '4px',
  },
});

interface TaskbarButtonProps {
  title:string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const TaskbarButton: React.FC<TaskbarButtonProps> = ({ title, icon, isActive, onClick }) => {
  return (
    <button {...stylex.props(styles.button, isActive && styles.activeButton)} onClick={onClick}>
            <img src={icon} alt={title} {...stylex.props(styles.icon)} />
      {title}
    </button>
  );
};

export default TaskbarButton;
