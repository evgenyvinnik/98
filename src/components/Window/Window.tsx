import React, { useState, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Window.styles';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  x: number;
  y: number;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onDrag: (x: number, y: number) => void;
}

const Window: React.FC<WindowProps> = ({ title, children, x, y, isActive, onClose, onFocus, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - x, y: e.clientY - y };

    const handleMouseMove = (e: MouseEvent) => {
      onDrag(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div {...stylex.props(styles.window)} style={{ left: x, top: y }} onMouseDown={onFocus}>
      <div {...stylex.props(styles.titleBar, isActive && styles.activeTitleBar)} onMouseDown={handleMouseDown}>
        <span {...stylex.props(styles.title)}>{title}</span>
        <button {...stylex.props(styles.closeButton)} onClick={onClose}>X</button>
      </div>
      <div {...stylex.props(styles.content)}>
        {children}
      </div>
    </div>
  );
};

export default Window;
