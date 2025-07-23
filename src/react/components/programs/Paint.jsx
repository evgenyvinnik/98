import React, { useState, useRef, useEffect } from 'react';
import useFilesystem from '../../hooks/useFilesystem';
import { useFileDialog } from '../../context/FileDialogContext';

/**
 * Paint component that implements a simple drawing application
 * This will gradually replace the iframe-based Paint program
 */
const Paint = ({ filePath }) => {
  const [fileName, setFileName] = useState(filePath ? filePath.split('/').pop() : 'untitled');
  const [currentFilePath, setCurrentFilePath] = useState(filePath || null);
  const [isModified, setIsModified] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(1);
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  
  const filesystem = useFilesystem();
  const fileDialog = useFileDialog();
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
    
    // Load file content if a file path is provided
    if (filePath && filesystem.isReady) {
      loadImage(filePath);
    }
  }, [filePath, filesystem.isReady]);
  
  // Update context when color or line width changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);
  
  // Load image from file
  const loadImage = async (path) => {
    try {
      const data = await filesystem.readFile(path, { encoding: 'binary' });
      const blob = new Blob([data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        setFileName(path.split('/').pop());
        setCurrentFilePath(path);
        setIsModified(false);
        console.log(`Loaded image: ${path}`);
      };
      img.src = url;
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };
  
  // Handle Open menu action
  const handleOpen = async () => {
    try {
      // Show the open file dialog
      const path = await fileDialog.showOpenDialog({
        title: 'Open Image',
        initialPath: '/my-pictures',
        fileTypes: ['.png', '.jpg', '.jpeg', '.gif']
      });
      
      // Load the selected file
      if (path) {
        loadImage(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Open dialog canceled');
    }
  };
  
  // Save image to file
  const saveImage = async (path) => {
    if (!filesystem.isReady) return;
    
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      
      // Convert base64 to binary
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Save the file
      await filesystem.writeFile(path, bytes, { encoding: 'binary' });
      setFileName(path.split('/').pop());
      setCurrentFilePath(path);
      setIsModified(false);
      console.log(`Saved image: ${path}`);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };
  
  // Handle Save menu action
  const handleSave = async () => {
    if (currentFilePath) {
      // Save to the current file path
      await saveImage(currentFilePath);
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
        title: 'Save Image As',
        initialPath: '/my-pictures',
        fileTypes: ['.png']
      });
      
      // Save to the selected path
      if (path) {
        await saveImage(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Save dialog canceled');
    }
  };
  
  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing.current = true;
    setIsModified(true);
  };
  
  // Draw
  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;
    
    const { offsetX, offsetY } = nativeEvent;
    
    switch (tool) {
      case 'pencil':
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        break;
      case 'line':
        // For line tool, we'll handle this in stopDrawing
        break;
      case 'rectangle':
        // For rectangle tool, we'll handle this in stopDrawing
        break;
      default:
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    }
  };
  
  // Stop drawing
  const stopDrawing = () => {
    isDrawing.current = false;
    contextRef.current.closePath();
  };
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setIsModified(true);
  };
  
  return (
    <div className="paint-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu Bar */}
      <div className="menu-bar" style={{ 
        display: 'flex', 
        backgroundColor: '#c0c0c0',
        borderBottom: '1px solid #808080',
        padding: '2px',
        marginBottom: '10px'
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
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>View</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Image</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Help</div>
      </div>
      
      {/* Toolbar */}
      <div className="toolbar" style={{ 
        display: 'flex', 
        backgroundColor: '#c0c0c0',
        borderBottom: '1px solid #808080',
        padding: '4px'
      }}>
        <button 
          onClick={() => setTool('pencil')} 
          style={{ 
            backgroundColor: tool === 'pencil' ? '#ddd' : '#c0c0c0',
            border: '1px solid #808080',
            margin: '0 2px',
            padding: '2px 4px'
          }}
        >
          Pencil
        </button>
        <button 
          onClick={() => setTool('line')} 
          style={{ 
            backgroundColor: tool === 'line' ? '#ddd' : '#c0c0c0',
            border: '1px solid #808080',
            margin: '0 2px',
            padding: '2px 4px'
          }}
        >
          Line
        </button>
        <button 
          onClick={() => setTool('rectangle')} 
          style={{ 
            backgroundColor: tool === 'rectangle' ? '#ddd' : '#c0c0c0',
            border: '1px solid #808080',
            margin: '0 2px',
            padding: '2px 4px'
          }}
        >
          Rectangle
        </button>
        <button 
          onClick={clearCanvas} 
          style={{ 
            backgroundColor: '#c0c0c0',
            border: '1px solid #808080',
            margin: '0 2px',
            padding: '2px 4px'
          }}
        >
          Clear
        </button>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          style={{ 
            margin: '0 2px',
            width: '24px',
            height: '24px'
          }}
        />
        <select 
          value={lineWidth} 
          onChange={(e) => setLineWidth(parseInt(e.target.value))} 
          style={{ 
            margin: '0 2px',
            padding: '2px 4px',
            border: '1px solid #808080'
          }}
        >
          <option value="1">1px</option>
          <option value="2">2px</option>
          <option value="3">3px</option>
          <option value="5">5px</option>
          <option value="10">10px</option>
        </select>
        <button 
          onClick={handleSave} 
          style={{ 
            backgroundColor: '#c0c0c0',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            margin: '0 2px',
            padding: '2px 4px'
          }}
        >
          Save
        </button>
      </div>
      
      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
          }}
        />
      </div>
      
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
        <div>{`Tool: ${tool}, Color: ${color}, Width: ${lineWidth}px`}</div>
      </div>
    </div>
  );
};

export default Paint;
