import React, { useState, useRef, useEffect } from 'react';
import useFilesystem from '../../hooks/useFilesystem';

/**
 * Paint component that implements a simple drawing application
 * This will gradually replace the iframe-based Paint program
 */
const Paint = ({ filePath }) => {
  const [fileName, setFileName] = useState(filePath ? filePath.split('/').pop() : 'untitled');
  const [isModified, setIsModified] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(1);
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  
  const filesystem = useFilesystem();
  
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
        setIsModified(false);
      };
      img.src = url;
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };
  
  // Save image to file
  const saveImage = async () => {
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
      await filesystem.writeFile(filePath || `/my-pictures/${fileName}.png`, bytes, { encoding: 'binary' });
      setIsModified(false);
    } catch (error) {
      console.error('Error saving image:', error);
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
        padding: '2px'
      }}>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>File</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Edit</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>View</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Image</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer' }}>Help</div>
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
          onClick={saveImage} 
          style={{ 
            backgroundColor: '#c0c0c0',
            border: '1px solid #808080',
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
