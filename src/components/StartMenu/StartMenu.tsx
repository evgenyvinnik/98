import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { type Program } from '../../programs.tsx';
import { getIconUrl } from '../Desktop/icon-helpers';

const styles = stylex.create({
  startMenu: {
    position: 'absolute',
    bottom: '28px', // Height of the taskbar
    left: 0,
    width: '200px',
    height: '300px',
    backgroundColor: 'var(--ButtonFace)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderTopColor: 'var(--ButtonLight)',
    borderLeftColor: 'var(--ButtonLight)',
    borderRightColor: 'var(--ButtonHilight)',
    borderBottomColor: 'var(--ButtonHilight)',
    boxShadow: '1px 1px 0px 1px black',
    display: 'flex',
    zIndex: 5001,
  },
  sidebar: {
    width: '25px',
    height: '100%',
    backgroundColor: 'var(--ActiveTitle)',
    display: 'flex',
    alignItems: 'flex-end',
  },
  sidebarText: {
    color: 'var(--ActiveTitleText)',
    fontWeight: 'bold',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '20px',
    padding: '10px 0',
  },
  programsList: {
    flexGrow: 1,
    padding: '4px',
    listStyle: 'none',
    margin: 0,
  },
  programItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#000080',
      color: 'white',
    },
  },
  programIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
  },
});

interface StartMenuProps {
  isOpen: boolean;
  programs: Program[];
  onProgramClick: (program: Program) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, programs, onProgramClick }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div {...stylex.props(styles.startMenu)}>
      <div {...stylex.props(styles.sidebar)}>
        <span {...stylex.props(styles.sidebarText)}>Windows 98</span>
      </div>
      <ul {...stylex.props(styles.programsList)}>
        {programs.map(program => (
          <li key={program.title} {...stylex.props(styles.programItem)} onClick={() => onProgramClick(program)}>
            <img src={getIconUrl(program.iconID, { isDirectory: () => false }, 16)} alt={program.title} {...stylex.props(styles.programIcon)} />
            <span>{program.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StartMenu;
