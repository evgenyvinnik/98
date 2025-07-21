import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './StartMenu.styles.ts';
import { programs, Program } from '../../programs.tsx';
import { getIconUrl } from '../Desktop/icon-helpers';

interface StartMenuProps {
  isOpen: boolean;
  onProgramClick: (program: Program) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onProgramClick }) => {
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
