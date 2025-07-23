import React, { useState, useEffect } from 'react';
import { useFileDialog } from '../../context/FileDialogContext';
import useFilesystem from '../../hooks/useFilesystem';

/**
 * Notepad component that implements a simple text editor
 * This will gradually replace the iframe-based Notepad program
 */
const Notepad = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState(filePath ? filePath.split('/').pop() : 'Untitled');
  const [currentFilePath, setCurrentFilePath] = useState(filePath || null);
  const [isModified, setIsModified] = useState(false);
  
  const fileDialog = useFileDialog();
  const filesystem = useFilesystem();
  
  // Load file content if a file path is provided
  useEffect(() => {
    if (filePath && filesystem.isReady) {
      loadFile(filePath);
    }
  }, [filePath, filesystem.isReady]);
  
  // Load a file from the filesystem
  const loadFile = async (path) => {
    try {
      const data = await filesystem.readFile(path, { encoding: 'utf8' });
      setContent(data);
      setFileName(path.split('/').pop());
      setCurrentFilePath(path);
      setIsModified(false);
      console.log(`Loaded file: ${path}`);
    } catch (error) {
      console.error(`Error loading file ${path}:`, error);
    }
  };
  
  // Save file to the filesystem
  const saveFile = async (path) => {
    try {
      await filesystem.writeFile(path, content, { encoding: 'utf8' });
      setFileName(path.split('/').pop());
      setCurrentFilePath(path);
      setIsModified(false);
      console.log(`Saved file: ${path}`);
    } catch (error) {
      console.error(`Error saving file ${path}:`, error);
    }
  };
  
  // Handle Open menu action
  const handleOpen = async () => {
    try {
      // Show the open file dialog
      const path = await fileDialog.showOpenDialog({
        title: 'Open',
        initialPath: '/my-documents',
        fileTypes: ['.txt']
      });
      
      // Load the selected file
      if (path) {
        loadFile(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Open dialog canceled');
    }
  };
  
  // Handle Save menu action
  const handleSave = async () => {
    if (currentFilePath) {
      // Save to the current file path
      await saveFile(currentFilePath);
    } else {
      // Show the save file dialog
      await handleSaveAs();
    }
  };
  
  // Handle Save As menu action
  const handleSaveAs = async () => {
    try {
      // Show the save file dialog
      const path = await fileDialog.showSaveDialog({
        title: 'Save As',
        initialPath: '/my-documents',
        fileTypes: ['.txt']
      });
      
      // Save to the selected path
      if (path) {
        await saveFile(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Save dialog canceled');
    }
  };
  
  // Handle text changes
  const handleTextChange = (e) => {
    setContent(e.target.value);
    setIsModified(true);
  };
  
  return (
    <div className="notepad-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu Bar */}
      <div className="menu-bar" style={{ 
        display: 'flex', 
        backgroundColor: '#c0c0c0',
        borderBottom: '1px solid #808080',
        padding: '2px'
      }}>
        <div className="menu-item" style={{ 
          marginRight: '8px', 
          cursor: 'pointer',
          position: 'relative',
          padding: '2px 5px'
        }}>
          File
          <div className="menu-dropdown" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#c0c0c0',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            padding: '2px',
            width: '150px',
            display: 'none',
            zIndex: 1000
          }}>
            <div className="menu-item" onClick={handleOpen} style={{ padding: '2px 5px', cursor: 'pointer' }}>Open...</div>
            <div className="menu-item" onClick={handleSave} style={{ padding: '2px 5px', cursor: 'pointer' }}>Save</div>
            <div className="menu-item" onClick={handleSaveAs} style={{ padding: '2px 5px', cursor: 'pointer' }}>Save As...</div>
            <div style={{ height: '1px', backgroundColor: '#808080', margin: '2px 0' }}></div>
            <div className="menu-item" style={{ padding: '2px 5px', cursor: 'pointer' }}>Exit</div>
          </div>
        </div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Edit</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Format</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>View</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Help</div>
      </div>
      
      {/* Text Area */}
      <textarea
        style={{
          flex: 1,
          resize: 'none',
          padding: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          border: 'none',
          outline: 'none',
          backgroundColor: 'white'
        }}
        value={content}
        onChange={handleTextChange}
        spellCheck={false}
      />
      
      {/* Status Bar */}
      <div className="status-bar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        backgroundColor: '#c0c0c0',
        borderTop: '1px solid #808080',
        padding: '2px 4px',
        fontSize: '12px'
      }}>
        <div>{isModified ? 'Modified' : 'Saved'}</div>
        <div>{`${content.length} characters`}</div>
      </div>
    </div>
  );
};

export default Notepad;
