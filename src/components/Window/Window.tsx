import React, { useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Window.styles';
import TitleBar from './TitleBar';
import { useThreeDeeFun } from '../../contexts/ThreeDeeFunContext';
import { useVisualizerOverlay } from '../../contexts/VisualizerContext';

interface WindowProps {
  id: number;
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
  onDrag: (dx: number, dy: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  x,
  y,
  width,
  height,
  zIndex,
  state,
  isActive,
  onClose,
  onFocus,
  onDrag,
  onMinimize,
  onMaximize,
  onRestore,
}) => {
  const dragStartPos = useRef({ x: 0, y: 0 });
  const { is3DEnabled, transforms } = useThreeDeeFun();
  const visualizerRef = useVisualizerOverlay(true); // Always enabled for now

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.title-bar-button')) {
      return;
    }
    onFocus();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    onDrag(dx, dy);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (state === 'minimized') {
    return null;
  }

  const windowStyles: React.CSSProperties = {
    left: state === 'maximized' ? 0 : x,
    top: state === 'maximized' ? 0 : y,
    width: state === 'maximized' ? '100vw' : width,
    height: state === 'maximized' ? 'calc(100vh - 28px)' : height,
    zIndex,
    transform: is3DEnabled ? transforms.get(id) : 'none',
    transition: is3DEnabled ? 'transform 0.1s' : 'none',
  };

  return (
    <div
      ref={visualizerRef}
      {...stylex.props(
        styles.window,
        state === 'maximized' && styles.maximized,
        isActive && styles.focused
      )}
      style={windowStyles}
      onMouseDown={onFocus}
    >
      <TitleBar
        title={title}
        isActive={isActive}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onRestore={onRestore}
        onMouseDown={handleMouseDown}
        isMaximizable={state !== 'maximized'}
        isRestorable={state === 'maximized'}
      />
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
};

export default Window;
