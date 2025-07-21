import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './DesktopIcon.styles';

interface DesktopIconProps {
  name: string;
  iconUrl: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, iconUrl, onDoubleClick }) => {
  return (
    <div {...stylex.props(styles.container)} onDoubleClick={onDoubleClick}>
      <img src={iconUrl} alt={name} {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.name)}>{name}</span>
    </div>
  );
};

export default DesktopIcon;
