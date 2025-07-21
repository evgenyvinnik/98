import React, { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { getIconUrl, Stats } from './icon-helpers';

const styles = stylex.create({
  desktop: {
    backgroundImage: 'url(/images/clouds.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw',
  },
});

declare const BrowserFS: any; // Assuming BrowserFS is loaded globally

interface DesktopItem {
  name: string;
  iconUrl: string;
  x: number;
  y: number;
}

const Desktop: React.FC = () => {
  const [items, setItems] = useState<DesktopItem[]>([]);

  const updateIconPosition = (name: string, x: number, y: number) => {
    setItems(prev =>
      prev.map(item => (item.name === name ? { ...item, x, y } : item))
    );
  };

  useEffect(() => {
    const initializeFs = () => {
      BrowserFS.configure({ fs: 'XmlHttpRequest', options: { index: '/filesystem-index.json' } }, (err: Error | null) => {
        if (err) {
          console.error('BrowserFS configuration error:', err);
          return;
        }
        const fs = BrowserFS.BFSRequire('fs');
        const desktopPath = '/desktop/';

        fs.readdir(desktopPath, (err: Error | null, files: string[]) => {
          if (err) {
            console.error('Error reading desktop directory:', err);
            return;
          }

                    const statPromises = files.map(file =>
            new Promise<{ name: string; stats: Stats }>((resolve) => {
              const filePath = `${desktopPath}${file}`;
              fs.stat(filePath, (err: Error | null, stats: Stats) => {
                if (err) {
                  console.error(`Error getting stats for ${filePath}:`, err);
                  // To prevent Promise.all from failing, resolve with a dummy stats object
                  resolve({ name: file, stats: { isDirectory: () => false } as Stats });
                  return;
                }
                resolve({ name: file, stats });
              });
            })
          );

          Promise.all(statPromises).then(results => {
            const gridX = 85;
            const gridY = 85;
            const padding = 10;
            let currentX = padding;
            let currentY = padding;

            const desktopItems = results.map(result => {
              const item = {
                name: result.name,
                iconUrl: getIconUrl(result.name, result.stats, 32),
                x: currentX,
                y: currentY,
              };

              currentY += gridY;
              // A simple grid layout logic, assuming a fixed desktop height for now
              if (currentY + gridY > 600) {
                currentY = padding;
                currentX += gridX;
              }

              return item;
            });

            setItems(desktopItems);
          });
        });
      });
    };

    if (typeof BrowserFS !== 'undefined') {
      initializeFs();
    } else {
      console.error('BrowserFS is not loaded.');
    }
  }, []);

  return (
    <div {...stylex.props(styles.desktop)}>
      {items.map(item => (
        <DesktopIcon
          key={item.name}
          name={item.name}
          iconUrl={item.iconUrl}
          x={item.x}
          y={item.y}
          onDoubleClick={() => alert(`Opening ${item.name}`)}
          onDrag={updateIconPosition}
        />
      ))}
    </div>
  );
};

export default Desktop;
