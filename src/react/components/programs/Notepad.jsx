import React, { useState, useEffect } from 'react';

/**
 * Notepad component that implements a simple text editor
 * This will gradually replace the iframe-based Notepad program
 */
const Notepad = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState(filePath ? filePath.split('/').pop() : 'Untitled');
  const [isModified, setIsModified] = useState(false);
  
  // Load file content if a file path is provided
  useEffect(() => {
    if (filePath) {
      // In a real implementation, this would use the BrowserFS API
      // For now, we'll just simulate loading a file
      console.log(`Loading file: ${filePath}`);
      
      // Simulate loading file content
      setTimeout(() => {
        setContent(`This is the content of ${fileName}`);
        setIsModified(false);
      }, 100);
    }
  }, [filePath, fileName]);
  
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
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>File</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Edit</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Format</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>View</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Help</div>
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
