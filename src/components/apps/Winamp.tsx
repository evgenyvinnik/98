import React, { useEffect, useRef } from 'react';
import Webamp from 'webamp';
import { useVisualizer } from '../../contexts/VisualizerContext';

const WinampApp: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { setVisualizerSource } = useVisualizer();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const webamp = new Webamp({
      initialTracks: [
        {
          metaData: {
            artist: 'DJ Mike Llama',
            title: 'Llama Whippin\' Intro',
          },
          url: '/audio/llama-whippin-intro.mp3',
        },
      ],
    });

    webamp.renderWhenReady(ref.current).then(() => {
      const visualizerNode = (webamp as any)._visualizer; // Accessing private field
      if (visualizerNode && visualizerNode._canvas) {
        setVisualizerSource({
          canvas: visualizerNode._canvas,
          options: { mirror: true, stretch: true },
        });
      }
    });

    return () => {
      setVisualizerSource(null);
      webamp.close();
    };
  }, [setVisualizerSource]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

export default WinampApp;
