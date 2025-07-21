import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './DesktopIcon.styles.ts';

interface DesktopIconProps {
  name: string;
  iconUrl: string;
  x: number;
  y: number;
  onDoubleClick: () => void;
  onDrag: (name: string, x: number, y: number) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, iconUrl, x, y, onDoubleClick, onDrag }) => {
  const dragStartPos = React.useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX - x, y: e.clientY - y };

    const handleMouseMove = (e: MouseEvent) => {
      onDrag(name, e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div
      {...stylex.props(styles.container)}
      style={{ left: x, top: y }}
      onDoubleClick={onDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <img src={iconUrl} alt={name} {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.name)}>{name}</span>
    </div>
  );
};

export default DesktopIcon;
