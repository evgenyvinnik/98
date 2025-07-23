import React, { useState, useEffect, useRef } from 'react';
import useFilesystem from '../../hooks/useFilesystem';
import { useFileDialog } from '../../context/FileDialogContext';

/**
 * SoundRecorder component that implements a simple audio recording application
 * This will replace the iframe-based Sound Recorder program
 */
const SoundRecorder = ({ filePath }) => {
  const [fileName, setFileName] = useState(filePath ? filePath.split('/').pop() : 'Sound');
  const [currentFilePath, setCurrentFilePath] = useState(filePath || null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [isModified, setIsModified] = useState(false);
  
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  
  const filesystem = useFilesystem();
  const fileDialog = useFileDialog();
  
  // Initialize when component mounts
  useEffect(() => {
    // Load file if path is provided
    if (filePath && filesystem.isReady) {
      loadAudioFile(filePath);
    }
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [filePath, filesystem.isReady]);
  
  // Load audio file
  const loadAudioFile = async (path) => {
    try {
      const data = await filesystem.readFile(path, { encoding: 'binary' });
      const blob = new Blob([data], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setAudioData(url);
      setFileName(path.split('/').pop());
      setCurrentFilePath(path);
      setIsModified(false);
      
      // Load audio metadata
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      console.log(`Loaded audio file: ${path}`);
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  };
  
  // Handle Open menu action
  const handleOpen = async () => {
    try {
      // Show the open file dialog
      const path = await fileDialog.showOpenDialog({
        title: 'Open Sound',
        initialPath: '/my-documents',
        fileTypes: ['.wav']
      });
      
      // Load the selected file
      if (path) {
        loadAudioFile(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Open dialog canceled');
    }
  };
  
  // Save audio file
  const saveAudioFile = async (path) => {
    if (!audioData || !filesystem.isReady) return;
    
    try {
      // Fetch the audio data
      const response = await fetch(audioData);
      const blob = await response.blob();
      
      // Convert blob to binary data
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Save the file
      await filesystem.writeFile(path, bytes, { encoding: 'binary' });
      setFileName(path.split('/').pop());
      setCurrentFilePath(path);
      setIsModified(false);
      
      console.log(`Saved audio file: ${path}`);
    } catch (error) {
      console.error('Error saving audio file:', error);
    }
  };
  
  // Handle Save menu action
  const handleSave = async () => {
    if (currentFilePath) {
      // Save to the current file path
      await saveAudioFile(currentFilePath);
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
        title: 'Save Sound As',
        initialPath: '/my-documents',
        fileTypes: ['.wav']
      });
      
      // Save to the selected path
      if (path) {
        await saveAudioFile(path);
      }
    } catch (error) {
      // User canceled the dialog
      console.log('Save dialog canceled');
    }
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        setAudioData(url);
        setIsModified(true);
        
        // Load audio metadata
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setCurrentTime(0);
      
      // Start timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setCurrentTime((Date.now() - startTime) / 1000);
      }, 100);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Play audio
  const playAudio = () => {
    if (!audioRef.current || !audioData) return;
    
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    setIsPlaying(true);
    
    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentTime(audioRef.current.currentTime);
    }, 100);
  };
  
  // Pause audio
  const pauseAudio = () => {
    if (!audioRef.current || !isPlaying) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Stop audio
  const stopAudio = () => {
    if (!audioRef.current || !isPlaying) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Format time as mm:ss.d
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const tenths = Math.floor((time % 1) * 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  };
  
  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  return (
    <div className="sound-recorder-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      padding: '10px',
      backgroundColor: '#c0c0c0',
      fontFamily: 'MS Sans Serif, Arial, sans-serif'
    }}>
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
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Effects</div>
        <div className="menu-item" style={{ marginRight: '8px', cursor: 'pointer', padding: '2px 5px' }}>Help</div>
      </div>
      
      {/* Waveform Display */}
      <div className="waveform-display" style={{
        height: '100px',
        backgroundColor: 'white',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        marginBottom: '10px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Simple waveform visualization */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#000000'
        }} />
        
        {audioData && (
          <div style={{
            position: 'absolute',
            top: '25%',
            height: '50%',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '80%',
              height: '100%',
              background: 'linear-gradient(to bottom, transparent 40%, #008000 50%, transparent 60%)',
              clipPath: isRecording ? 'none' : 'polygon(0% 50%, 5% 45%, 10% 40%, 15% 35%, 20% 40%, 25% 45%, 30% 50%, 35% 55%, 40% 60%, 45% 55%, 50% 50%, 55% 45%, 60% 40%, 65% 45%, 70% 50%, 75% 55%, 80% 60%, 85% 55%, 90% 50%, 95% 45%, 100% 50%)'
            }} />
          </div>
        )}
        
        {/* Position indicator */}
        {audioData && (
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(currentTime / (duration || 1)) * 100}%`,
            width: '1px',
            backgroundColor: 'red'
          }} />
        )}
      </div>
      
      {/* Controls */}
      <div className="controls" style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div className="transport-controls" style={{
          display: 'flex'
        }}>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isPlaying}
            style={{
              width: '40px',
              height: '24px',
              marginRight: '5px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              backgroundColor: '#c0c0c0',
              color: isPlaying ? '#808080' : 'black'
            }}
          >
            {isRecording ? 'Stop' : 'Record'}
          </button>
          
          <button 
            onClick={isPlaying ? pauseAudio : playAudio}
            disabled={isRecording || !audioData}
            style={{
              width: '40px',
              height: '24px',
              marginRight: '5px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              backgroundColor: '#c0c0c0',
              color: isRecording || !audioData ? '#808080' : 'black'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button 
            onClick={stopAudio}
            disabled={!isPlaying}
            style={{
              width: '40px',
              height: '24px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              backgroundColor: '#c0c0c0',
              color: !isPlaying ? '#808080' : 'black'
            }}
          >
            Stop
          </button>
        </div>
        
        <div className="file-controls" style={{
          display: 'flex'
        }}>
          <button 
            onClick={handleSave}
            disabled={!audioData || !isModified}
            style={{
              width: '40px',
              height: '24px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              backgroundColor: '#c0c0c0',
              color: !audioData || !isModified ? '#808080' : 'black'
            }}
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Position Display */}
      <div className="position-display" style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div className="position" style={{
          backgroundColor: 'white',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '2px 5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          width: '80px',
          textAlign: 'center'
        }}>
          {formatTime(currentTime)}
        </div>
        
        <div className="length" style={{
          backgroundColor: 'white',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          padding: '2px 5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          width: '80px',
          textAlign: 'center'
        }}>
          {formatTime(duration)}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="status-bar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        backgroundColor: '#c0c0c0',
        borderTop: '1px solid #808080',
        marginTop: '10px',
        padding: '2px 4px',
        fontSize: '12px'
      }}>
        <div>{isModified ? 'Modified' : 'Saved'}</div>
        <div>{fileName}</div>
      </div>
      
      {/* Hidden Audio Element */}
      {audioData && (
        <audio 
          ref={audioRef}
          src={audioData}
          onEnded={handleAudioEnded}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default SoundRecorder;
