import React, { createContext, useState, useContext, useCallback } from 'react';

const VisualizerContext = createContext();

export const useVisualizer = () => useContext(VisualizerContext);

export const VisualizerProvider = ({ children }) => {
  const [visualizerState, setVisualizerState] = useState({
    isActive: false,
    canvas: null,
    options: { mirror: true, tile: false, stretch: false },
  });

  const startVisualizer = useCallback((canvas, options) => {
    setVisualizerState({ isActive: true, canvas, options });
  }, []);

  const stopVisualizer = useCallback(() => {
    setVisualizerState(prev => ({ ...prev, isActive: false }));
  }, []);

  const setVisualizerOptions = useCallback((options) => {
    setVisualizerState(prev => ({ ...prev, options: { ...prev.options, ...options } }));
  }, []);

  useState(() => {
    window.visualizer = {
      start: startVisualizer,
      stop: stopVisualizer,
      setOptions: setVisualizerOptions,
    };
    return () => { delete window.visualizer; };
  }, [startVisualizer, stopVisualizer, setVisualizerOptions]);

  const value = { ...visualizerState, startVisualizer, stopVisualizer, setVisualizerOptions };

  return (
    <VisualizerContext.Provider value={value}>
      {children}
    </VisualizerContext.Provider>
  );
};
