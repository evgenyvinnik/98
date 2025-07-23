import React, { useEffect, useRef } from 'react';
import { useVisualizer } from '../contexts/VisualizerContext';

const VisualizerOverlay = () => {
  const { isActive, canvas: sourceCanvas, options } = useVisualizer();
  const overlayCanvasRef = useRef(null);
  const wrappyCanvas = useRef(document.createElement('canvas')).current;
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!isActive || !sourceCanvas) {
        // Cleanup if we were active before
        if (window.monkey_patch_render.is_patched) {
            window.monkey_patch_render = (obj) => obj.render();
        }
        return;
    }

    const originalRender = window.monkey_patch_render;
    window.monkey_patch_render = (obj) => {
        originalRender(obj);
        renderFrame();
    };
    window.monkey_patch_render.is_patched = true;

    const renderFrame = () => {
        const overlayCanvas = overlayCanvasRef.current;
        if (!overlayCanvas || !sourceCanvas) return;

        const wrappyCtx = wrappyCanvas.getContext('2d');
        const { width, height } = sourceCanvas;

        // Apply transformations to the intermediate canvas
        if (options.mirror) {
            wrappyCanvas.width = width * 2;
            wrappyCanvas.height = height * 2;
            wrappyCtx.save();
            const drawMirrored = () => {
                wrappyCtx.drawImage(sourceCanvas, 0, 0, width, height, 0, 0, width, height);
                wrappyCtx.translate(width, 0); wrappyCtx.scale(-1, 1); wrappyCtx.translate(-width, 0);
                wrappyCtx.drawImage(sourceCanvas, 0, 0, width, height, 0, 0, width, height);
            };
            drawMirrored();
            wrappyCtx.translate(0, height); wrappyCtx.scale(1, -1); wrappyCtx.translate(0, -height);
            drawMirrored();
            wrappyCtx.restore();
        } else if (options.tile) {
            wrappyCanvas.width = width * 2;
            wrappyCanvas.height = height * 2;
            for (let xi = 0; xi < 2; xi++) {
                for (let yi = 0; yi < 2; yi++) {
                    wrappyCtx.drawImage(sourceCanvas, 0, 0, width, height, width * xi, height * yi, width, height);
                }
            }
        } else {
            wrappyCanvas.width = width;
            wrappyCanvas.height = height;
            wrappyCtx.drawImage(sourceCanvas, 0, 0, width, height);
        }

        // Draw the result to the visible overlay canvas
        const overlayCtx = overlayCanvas.getContext('2d');
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.drawImage(wrappyCanvas, 0, 0, overlayCanvas.width, overlayCanvas.height);
    };

    return () => {
      // Restore original render function on cleanup
      if (window.monkey_patch_render.is_patched) {
        window.monkey_patch_render = originalRender;
      }
    };
  }, [isActive, sourceCanvas, options, wrappyCanvas]);

  if (!isActive) {
    return null;
  }

  const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    mixBlendMode: 'color-dodge',
    zIndex: 10000, // High z-index to be on top of everything
  };

  return <canvas ref={overlayCanvasRef} style={style} />;
};

export default VisualizerOverlay;
