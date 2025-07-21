import React, { useState, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Window.styles';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onDrag: (x: number, y: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
}

const Window: React.FC<WindowProps> = ({ title, children, x, y, width, height, zIndex, state, isActive, onClose, onFocus, onDrag, onMinimize, onMaximize, onRestore }) => {
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

    if (state === 'minimized') {
    return null;
  }

  const windowStyles = {
    left: state === 'maximized' ? 0 : x,
    top: state === 'maximized' ? 0 : y,
    width: state === 'maximized' ? '100%' : width,
    height: state === 'maximized' ? 'calc(100% - 28px)' : height,
    zIndex,
  };

  return (
    <div {...stylex.props(styles.window)} style={windowStyles} onMouseDown={onFocus}>
      <div {...stylex.props(styles.titleBar, isActive && styles.activeTitleBar)} onMouseDown={handleMouseDown}>
        <span {...stylex.props(styles.title)}>{title}</span>
        <div {...stylex.props(styles.titleBarButtons)}>
          <button {...stylex.props(styles.titleBarButton)} onClick={onMinimize}>_</button>
          {state === 'maximized' ? (
            <button {...stylex.props(styles.titleBarButton)} onClick={onRestore}>❐</button>
          ) : (
            <button {...stylex.props(styles.titleBarButton)} onClick={onMaximize}>▢</button>
          )}
          <button {...stylex.props(styles.closeButton)} onClick={onClose}>X</button>
        </div>
      </div>
      <div {...stylex.props(styles.content)}>
        {children}
      </div>
    </div>
  );
};

export default Window;
