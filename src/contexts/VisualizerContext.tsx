import React, { createContext, useState, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';

// --- Helper Functions ---
function getOffset(element: HTMLElement, fromElement: HTMLElement) {
  let el: HTMLElement | null = element;
  let offsetLeft = 0;
  let offsetTop = 0;

  do {
    offsetLeft += el.offsetLeft;
    offsetTop += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  } while (el && el !== fromElement);

  return { offsetLeft, offsetTop };
}

// --- Types ---
interface RenderOptions {
  mirror?: boolean;
  tile?: boolean;
  stretch?: boolean;
}

interface VisualizerSource {
  canvas: HTMLCanvasElement;
  options: RenderOptions;
}

interface VisualizerContextType {
  setVisualizerSource: (source: VisualizerSource | null) => void;
  addOverlayTarget: (id: string, element: HTMLElement) => void;
  removeOverlayTarget: (id: string) => void;
}

// --- Context ---
const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

// --- Provider ---
export const VisualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [source, setSource] = useState<VisualizerSource | null>(null);
  const [targets, setTargets] = useState(new Map<string, HTMLElement>());
  const overlayCanvases = useRef(new Map<string, HTMLCanvasElement>());
  const wrappyCanvas = useRef(document.createElement('canvas'));

  const addOverlayTarget = useCallback((id: string, element: HTMLElement) => {
    setTargets(prev => new Map(prev).set(id, element));
  }, []);

  const removeOverlayTarget = useCallback((id: string) => {
    setTargets(prev => {
      const newTargets = new Map(prev);
      newTargets.delete(id);
      return newTargets;
    });
    const canvas = overlayCanvases.current.get(id);
    if (canvas) {
      canvas.remove();
      overlayCanvases.current.delete(id);
    }
  }, []);

  const renderVisuals = useCallback(() => {
    if (!source) return;

    const { canvas: visualizerCanvas, options } = source;
    const { width, height } = visualizerCanvas;
    const wrappyCtx = wrappyCanvas.current.getContext('2d');
    if (!wrappyCtx) return;

    // Prepare the wrappy canvas with effects (mirror, tile, etc.)
    // (This logic is simplified from the original for clarity)
    wrappyCanvas.current.width = width;
    wrappyCanvas.current.height = height;
    wrappyCtx.drawImage(visualizerCanvas, 0, 0, width, height);

    // Render overlays for each target
    targets.forEach((windowEl, id) => {
      let canvas = overlayCanvases.current.get(id);
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.mixBlendMode = 'color-dodge';
        windowEl.appendChild(canvas);
        overlayCanvases.current.set(id, canvas);
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = window.devicePixelRatio || 1;
      canvas.width = windowEl.clientWidth * scale;
      canvas.height = windowEl.clientHeight * scale;
      canvas.style.width = `${windowEl.clientWidth}px`;
      canvas.style.height = `${windowEl.clientHeight}px`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const childElements = Array.from(windowEl.querySelectorAll('*')) as HTMLElement[];
      childElements.forEach(el => {
        const { offsetLeft, offsetTop } = getOffset(el, windowEl);
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(offsetLeft, offsetTop);
        ctx.drawImage(wrappyCanvas.current, 0, 0, el.clientWidth, el.clientHeight);
        ctx.restore();
      });
    });
  }, [source, targets]);

  useEffect(() => {
    // The monkey patch to hook into an external renderer
    (window as any).monkey_patch_render = (obj: any) => {
      if (obj && obj.render) {
        obj.render();
      }
      renderVisuals();
    };

    return () => {
      (window as any).monkey_patch_render = (obj: any) => obj && obj.render();
    };
  }, [renderVisuals]);

  const value = { setVisualizerSource: setSource, addOverlayTarget, removeOverlayTarget };

  return <VisualizerContext.Provider value={value}>{children}</VisualizerContext.Provider>;
};

// --- Hooks ---
export const useVisualizer = () => {
  const context = useContext(VisualizerContext);
  if (context === undefined) {
    throw new Error('useVisualizer must be used within a VisualizerProvider');
  }
  return context;
};

export const useVisualizerOverlay = (isEnabled: boolean) => {
  const { addOverlayTarget, removeOverlayTarget } = useVisualizer();
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`vis-overlay-${Math.random()}`);

  useEffect(() => {
    const element = ref.current;
    if (element && isEnabled) {
      addOverlayTarget(id.current, element);
      return () => removeOverlayTarget(id.current);
    }
  }, [isEnabled, addOverlayTarget, removeOverlayTarget]);

  return ref;
};
