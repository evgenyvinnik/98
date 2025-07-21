import React from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles, titleBarButton } from './TitleBar.styles';

interface TitleBarProps {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isMaximizable: boolean;
  isRestorable: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onMouseDown,
  isMaximizable,
  isRestorable,
}) => {
  return (
    <div
      {...stylex.props(styles.titleBar, isActive && styles.active)}
      onMouseDown={onMouseDown}
      onDoubleClick={isMaximizable ? onMaximize : onRestore}
    >
      <div {...stylex.props(styles.title)}>{title}</div>
      <div {...stylex.props(styles.controls)}>
        <button {...stylex.props(titleBarButton.button, titleBarButton.minimize)} onClick={onMinimize} aria-label="Minimize" />
        {isMaximizable && (
          <button {...stylex.props(titleBarButton.button, titleBarButton.maximize)} onClick={onMaximize} aria-label="Maximize" />
        )}
        {isRestorable && (
           <button {...stylex.props(titleBarButton.button, titleBarButton.restore)} onClick={onRestore} aria-label="Restore" />
        )}
        <button {...stylex.props(titleBarButton.button, titleBarButton.close)} onClick={onClose} aria-label="Close" />
      </div>
    </div>
  );
};

export default TitleBar;
