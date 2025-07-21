import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

declare const BrowserFS: any;

interface FileSystemContextType {
  fs: any | null;
  isFsInitialized: boolean;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};

interface FileSystemProviderProps {
  children: ReactNode;
}

export const FileSystemProvider: React.FC<FileSystemProviderProps> = ({ children }) => {
  const [fs, setFs] = useState<any | null>(null);
  const [isFsInitialized, setIsFsInitialized] = useState(false);

  useEffect(() => {
    if (typeof BrowserFS === 'undefined') {
      console.error('BrowserFS is not loaded.');
      return;
    }

    BrowserFS.configure({ fs: 'XmlHttpRequest', options: { index: '/filesystem-index.json' } }, (err: Error | null) => {
      if (err) {
        console.error('BrowserFS configuration error:', err);
        return;
      }
      const bfs = BrowserFS.BFSRequire('fs');
      setFs(bfs);
      setIsFsInitialized(true);
    });
  }, []);

  return (
    <FileSystemContext.Provider value={{ fs, isFsInitialized }}>
      {children}
    </FileSystemContext.Provider>
  );
};
