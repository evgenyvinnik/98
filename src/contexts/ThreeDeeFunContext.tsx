import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { useWindowManager } from './WindowManagerContext';
import { useKonamiCode } from '../hooks/useKonamiCode';

interface ThreeDeeFunContextType {
  is3DEnabled: boolean;
  transforms: Map<number, string>;
}

const ThreeDeeFunContext = createContext<ThreeDeeFunContextType | undefined>(undefined);

export const useThreeDeeFun = () => {
  const context = useContext(ThreeDeeFunContext);
  if (!context) {
    throw new Error('useThreeDeeFun must be used within a ThreeDeeFunProvider');
  }
  return context;
};

interface ThreeDeeFunProviderProps {
  children: ReactNode;
}

export const ThreeDeeFunProvider: React.FC<ThreeDeeFunProviderProps> = ({ children }) => {
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [transforms, setTransforms] = useState(new Map<number, string>());
  const { openWindows } = useWindowManager();
  const animationFrameId = useRef<number | null>(null);

  const toggle3D = () => {
    setIs3DEnabled(prev => !prev);
  };

  useKonamiCode(toggle3D);

  useEffect(() => {
    if (is3DEnabled) {
      const animate = () => {
        const newTransforms = new Map<number, string>();
        const { innerWidth, innerHeight } = window;
        
        openWindows.forEach(win => {
          const transform = `perspective(4000px) rotateY(${-(win.x + (win.width - innerWidth) / 2) / innerWidth / 3}turn) rotateX(${(win.y + (win.height - innerHeight) / 2) / innerHeight / 3}turn)`;
          newTransforms.set(win.id, transform);
        });
        
        setTransforms(newTransforms);
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setTransforms(new Map());
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [is3DEnabled, openWindows]);

  const value = { is3DEnabled, transforms };

  return (
    <ThreeDeeFunContext.Provider value={value}>
      {children}
    </ThreeDeeFunContext.Provider>
  );
};
