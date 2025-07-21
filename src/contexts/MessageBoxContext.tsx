import React, { createContext, useContext, ReactNode } from 'react';
import { useWindowManager } from './WindowManagerContext';
import MessageBox, { ButtonProps } from '../components/MessageBox/MessageBox';

interface ShowMessageBoxOptions {
  title: string;
  message: string;
  buttons?: ButtonProps[];
  iconID?: 'info' | 'warning' | 'error' | 'nuke';
}

interface MessageBoxContextType {
  showMessageBox: (options: ShowMessageBoxOptions) => Promise<string>;
}

const MessageBoxContext = createContext<MessageBoxContextType | undefined>(undefined);

export const useMessageBox = () => {
  const context = useContext(MessageBoxContext);
  if (!context) {
    throw new Error('useMessageBox must be used within a MessageBoxProvider');
  }
  return context;
};

interface MessageBoxProviderProps {
  children: ReactNode;
}

export const MessageBoxProvider: React.FC<MessageBoxProviderProps> = ({ children }) => {
  const { openWindow, closeWindow } = useWindowManager();

  const showMessageBox = (options: ShowMessageBoxOptions): Promise<string> => {
    return new Promise(resolve => {
      const windowId = Date.now(); // Simple unique ID

      const handleClose = (value: string) => {
        closeWindow(windowId);
        resolve(value);
      };

      const messageBoxContent = (
        <MessageBox
          message={options.message}
          buttons={options.buttons || [{ label: 'OK', value: 'ok', default: true }]}
          iconID={options.iconID || 'info'}
          onClose={handleClose}
        />
      );

                  openWindow({
        id: windowId,
        title: options.title,
        content: messageBoxContent,
        width: 400,
        height: 150,
        isResizable: false,
        isMaximizable: false,
        isMinimizable: false,
      });
    });
  };

  return (
    <MessageBoxContext.Provider value={{ showMessageBox }}>
      {children}
    </MessageBoxContext.Provider>
  );
};
