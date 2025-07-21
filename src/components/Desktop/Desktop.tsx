import React, { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Desktop.styles';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { getIconUrl, Stats } from './icon-helpers';

declare const BrowserFS: any; // Assuming BrowserFS is loaded globally

interface DesktopItem {
  name: string;
  iconUrl: string;
}

const Desktop: React.FC = () => {
  const [items, setItems] = useState<DesktopItem[]>([]);

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

          const promises = files.map(file => 
            new Promise<DesktopItem>((resolve, reject) => {
              const filePath = `${desktopPath}${file}`;
              fs.stat(filePath, (err: Error | null, stats: Stats) => {
                if (err) {
                  console.error(`Error getting stats for ${filePath}:`, err);
                  // Resolve with a default item on error
                  resolve({ name: file, iconUrl: getIconUrl(file, { isDirectory: () => false }, 32) });
                  return;
                }
                resolve({ name: file, iconUrl: getIconUrl(file, stats, 32) });
              });
            })
          );

          Promise.all(promises).then(setItems);
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
          onDoubleClick={() => alert(`Opening ${item.name}`)}
        />
      ))}
    </div>
  );
};

export default Desktop;
