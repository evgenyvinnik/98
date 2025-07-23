import React, { useState, useEffect } from 'react';
import useFilesystem from '../hooks/useFilesystem';

/**
 * FileDialog component that implements Open and Save dialogs
 * This will replace the existing file dialog functionality
 */
const FileDialog = ({
  mode = 'open', // 'open' or 'save'
  title = mode === 'open' ? 'Open' : 'Save As',
  initialPath = '/',
  fileTypes = [], // Array of file extensions, e.g. ['.txt', '.doc']
  onSelect,
  onCancel
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedFile, setSelectedFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [error, setError] = useState(null);
  
  const filesystem = useFilesystem();
  
  // Load files and directories when path changes
  useEffect(() => {
    if (filesystem.isReady) {
      loadDirectoryContents(currentPath);
    }
  }, [currentPath, filesystem.isReady]);
  
  // Load directory contents
  const loadDirectoryContents = async (path) => {
    try {
      const items = await filesystem.readdir(path);
      
      // Process items to separate files and directories
      const filePromises = items.map(async (item) => {
        try {
          const itemPath = `${path === '/' ? '' : path}/${item}`;
          const stats = await new Promise((resolve, reject) => {
            window.fs.stat(itemPath, (err, stats) => {
              if (err) reject(err);
              else resolve(stats);
            });
          });
          
          return {
            name: item,
            path: itemPath,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            modified: new Date(stats.mtime)
          };
        } catch (err) {
          console.error(`Error processing item ${item}:`, err);
          return null;
        }
      });
      
      const processedItems = (await Promise.all(filePromises)).filter(item => item !== null);
      
      // Separate files and directories
      const dirs = processedItems.filter(item => item.isDirectory);
      let filteredFiles = processedItems.filter(item => !item.isDirectory);
      
      // Filter files by file types if specified
      if (fileTypes.length > 0) {
        filteredFiles = filteredFiles.filter(file => {
          const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
          return fileTypes.includes(extension);
        });
      }
      
      // Sort directories and files alphabetically
      dirs.sort((a, b) => a.name.localeCompare(b.name));
      filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
      
      setDirectories(dirs);
      setFiles(filteredFiles);
      setError(null);
    } catch (err) {
      console.error('Error loading directory contents:', err);
      setDirectories([]);
      setFiles([]);
      setError(`Error loading directory: ${err.message}`);
    }
  };
  
  // Navigate to parent directory
  const navigateUp = () => {
    if (currentPath === '/') return;
    
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    setCurrentPath(parentPath || '/');
    setSelectedFile('');
  };
  
  // Navigate to a subdirectory
  const navigateToDirectory = (directory) => {
    setCurrentPath(directory.path);
    setSelectedFile('');
  };
  
  // Select a file
  const selectFile = (file) => {
    setSelectedFile(file.path);
    setFileName(file.name);
  };
  
  // Double-click a file to select and confirm
  const handleFileDoubleClick = (file) => {
    if (mode === 'open') {
      setSelectedFile(file.path);
      handleConfirm();
    }
  };
  
  // Handle file name input change
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };
  
  // Handle confirm button click
  const handleConfirm = () => {
    if (mode === 'open') {
      if (!selectedFile) {
        setError('Please select a file.');
        return;
      }
      
      onSelect(selectedFile);
    } else { // save mode
      if (!fileName) {
        setError('Please enter a file name.');
        return;
      }
      
      // Add default extension if none provided
      let finalFileName = fileName;
      if (fileTypes.length > 0 && !fileTypes.some(ext => fileName.toLowerCase().endsWith(ext))) {
        finalFileName += fileTypes[0];
      }
      
      const filePath = `${currentPath === '/' ? '' : currentPath}/${finalFileName}`;
      onSelect(filePath);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    onCancel();
  };
  
  // Format file size
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div className="file-dialog" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: '#c0c0c0',
      fontFamily: 'MS Sans Serif, Arial, sans-serif',
      fontSize: '12px'
    }}>
      {/* Path Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        borderBottom: '1px solid #808080'
      }}>
        <div style={{ marginRight: '5px' }}>Look in:</div>
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '2px 5px'
        }}>
          {currentPath}
        </div>
        <button 
          onClick={navigateUp}
          disabled={currentPath === '/'}
          style={{
            marginLeft: '5px',
            padding: '2px 5px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          Up
        </button>
      </div>
      
      {/* File List */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        margin: '5px',
        overflow: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#c0c0c0' }}>
              <th style={{ textAlign: 'left', padding: '2px 5px' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '2px 5px' }}>Size</th>
              <th style={{ textAlign: 'left', padding: '2px 5px' }}>Modified</th>
            </tr>
          </thead>
          <tbody>
            {directories.map((dir) => (
              <tr 
                key={dir.path}
                onDoubleClick={() => navigateToDirectory(dir)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                <td style={{ padding: '2px 5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/images/icons/folder-16x16.png" 
                      alt="Folder" 
                      style={{ width: '16px', height: '16px', marginRight: '5px' }} 
                    />
                    {dir.name}
                  </div>
                </td>
                <td style={{ textAlign: 'right', padding: '2px 5px' }}>&lt;DIR&gt;</td>
                <td style={{ padding: '2px 5px' }}>{formatDate(dir.modified)}</td>
              </tr>
            ))}
            {files.map((file) => (
              <tr 
                key={file.path}
                onClick={() => selectFile(file)}
                onDoubleClick={() => handleFileDoubleClick(file)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedFile === file.path ? '#000080' : 'transparent',
                  color: selectedFile === file.path ? 'white' : 'black'
                }}
              >
                <td style={{ padding: '2px 5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/images/icons/file-16x16.png" 
                      alt="File" 
                      style={{ width: '16px', height: '16px', marginRight: '5px' }} 
                    />
                    {file.name}
                  </div>
                </td>
                <td style={{ textAlign: 'right', padding: '2px 5px' }}>{formatFileSize(file.size)}</td>
                <td style={{ padding: '2px 5px' }}>{formatDate(file.modified)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* File Name Input (for save dialog) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px'
      }}>
        <div style={{ marginRight: '5px' }}>File name:</div>
        <input 
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
          style={{
            flex: 1,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '2px 5px'
          }}
        />
      </div>
      
      {/* File Type Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px'
      }}>
        <div style={{ marginRight: '5px' }}>Files of type:</div>
        <select style={{
          flex: 1,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '2px 5px'
        }}>
          {fileTypes.length > 0 ? (
            <option value="all">{fileTypes.join(', ')}</option>
          ) : (
            <option value="all">All Files (*.*)</option>
          )}
        </select>
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{
          color: 'red',
          padding: '5px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {/* Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px',
        borderTop: '1px solid #808080'
      }}>
        <button 
          onClick={handleConfirm}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            minWidth: '80px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          {mode === 'open' ? 'Open' : 'Save'}
        </button>
        <button 
          onClick={handleCancel}
          style={{
            padding: '5px 10px',
            minWidth: '80px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            backgroundColor: '#c0c0c0'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * OpenFileDialog component for opening files
 */
export const OpenFileDialog = (props) => (
  <FileDialog mode="open" {...props} />
);

/**
 * SaveFileDialog component for saving files
 */
export const SaveFileDialog = (props) => (
  <FileDialog mode="save" {...props} />
);

export default FileDialog;
