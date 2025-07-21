import React, { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { styles } from './Desktop.styles';
import DesktopIcon from '../DesktopIcon/DesktopIcon';

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
        fs.readdir('/desktop/', (err: Error | null, files: string[]) => {
          if (err) {
            console.error('Error reading desktop directory:', err);
            return;
          }
          // TODO: Get proper icons for each file type
          const desktopItems = files.map(file => ({
            name: file,
            iconUrl: '/images/icons/file-32x32.png', // Placeholder icon
          }));
          setItems(desktopItems);
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
