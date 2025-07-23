import React from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import { MessageBoxProvider } from './contexts/MessageBoxContext';
import MessageBoxContainer from './components/MessageBoxContainer';
import { WindowProvider } from './contexts/WindowContext';
import WindowSwitcher from './components/WindowSwitcher';
import { VisualizerProvider } from './contexts/VisualizerContext';
import VisualizerOverlay from './components/VisualizerOverlay';
import { ThreeDeeProvider } from './contexts/ThreeDeeContext';
import ThreeDeeEffect from './components/ThreeDeeEffect';

function App() {
  return (
    <ThreeDeeProvider>
      <VisualizerProvider>
        <WindowProvider>
          <MessageBoxProvider>
            <Desktop />
            <Taskbar />
            <MessageBoxContainer />
            <WindowSwitcher />
            <VisualizerOverlay />
            <ThreeDeeEffect />
            <svg style={{ position: 'absolute', pointerEvents: 'none', bottom: '100%' }}>
        <defs>
          <filter id="disabled-inset-filter" x="0" y="0" width="1px" height="1px">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -1000 -1000 -1000 1 0
              "
              result="black-parts-isolated"
            />
            <feFlood result="shadow-color" floodColor="var(--ButtonShadow)"/>
            <feFlood result="hilight-color" floodColor="var(--ButtonHilight)"/>
            <feOffset in="black-parts-isolated" dx="1" dy="1" result="offset"/>
            <feComposite in="hilight-color" in2="offset" operator="in" result="hilight-colored-offset"/>
            <feComposite in="shadow-color" in2="black-parts-isolated" operator="in" result="shadow-colored"/>
            <feMerge>
              <feMergeNode in="hilight-colored-offset"/>
              <feMergeNode in="shadow-colored"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
          </MessageBoxProvider>
        </WindowProvider>
      </VisualizerProvider>
    </ThreeDeeProvider>
  );
}

export default App;
