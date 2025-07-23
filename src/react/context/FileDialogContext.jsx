import React, { createContext, useState, useContext } from 'react';
import FileDialog, { OpenFileDialog, SaveFileDialog } from '../components/FileDialog';
import { useWindows } from './WindowsContext';

/**
 * FileDialogContext provides a way to show file dialogs from anywhere in the application
 */
const FileDialogContext = createContext();

/**
 * FileDialogProvider component that manages file dialogs
 */
export const FileDialogProvider = ({ children }) => {
  const [openDialogConfig, setOpenDialogConfig] = useState(null);
  const [saveDialogConfig, setSaveDialogConfig] = useState(null);
  
  const { createWindow, closeWindow } = useWindows();
  
  /**
   * Show an Open File dialog
   * @param {Object} config - Dialog configuration
   * @returns {Promise<string>} - Selected file path
   */
  const showOpenDialog = (config = {}) => {
    return new Promise((resolve, reject) => {
      // Create a unique ID for this dialog
      const dialogId = `open-dialog-${Date.now()}`;
      
      // Configure the dialog
      const dialogConfig = {
        ...config,
        onSelect: (filePath) => {
          resolve(filePath);
          closeWindow(dialogId);
        },
        onCancel: () => {
          reject(new Error('Dialog canceled'));
          closeWindow(dialogId);
        }
      };
      
      // Create a window for the dialog
      createWindow({
        id: dialogId,
        title: config.title || 'Open',
        component: () => <OpenFileDialog {...dialogConfig} />,
        position: { x: 'center', y: 'center' },
        size: { width: 500, height: 400 },
        resizable: true,
        maximizable: false,
        minimizable: false
      });
    });
  };
  
  /**
   * Show a Save File dialog
   * @param {Object} config - Dialog configuration
   * @returns {Promise<string>} - Selected file path
   */
  const showSaveDialog = (config = {}) => {
    return new Promise((resolve, reject) => {
      // Create a unique ID for this dialog
      const dialogId = `save-dialog-${Date.now()}`;
      
      // Configure the dialog
      const dialogConfig = {
        ...config,
        onSelect: (filePath) => {
          resolve(filePath);
          closeWindow(dialogId);
        },
        onCancel: () => {
          reject(new Error('Dialog canceled'));
          closeWindow(dialogId);
        }
      };
      
      // Create a window for the dialog
      createWindow({
        id: dialogId,
        title: config.title || 'Save As',
        component: () => <SaveFileDialog {...dialogConfig} />,
        position: { x: 'center', y: 'center' },
        size: { width: 500, height: 400 },
        resizable: true,
        maximizable: false,
        minimizable: false
      });
    });
  };
  
  // Context value
  const value = {
    showOpenDialog,
    showSaveDialog
  };
  
  return (
    <FileDialogContext.Provider value={value}>
      {children}
    </FileDialogContext.Provider>
  );
};

/**
 * Custom hook for using file dialogs
 * @returns {Object} - File dialog methods
 */
export const useFileDialog = () => {
  const context = useContext(FileDialogContext);
  if (!context) {
    throw new Error('useFileDialog must be used within a FileDialogProvider');
  }
  return context;
};

export default FileDialogContext;
