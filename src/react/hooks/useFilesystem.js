import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for interacting with the BrowserFS filesystem
 * This hook provides a React interface to the existing filesystem functionality
 */
const useFilesystem = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize the filesystem
  useEffect(() => {
    // Check if BrowserFS is available
    if (!window.BrowserFS) {
      setError('BrowserFS is not available');
      return;
    }
    
    // Check if the filesystem is already initialized
    if (window.fs) {
      setIsReady(true);
      return;
    }
    
    // If not initialized, wait for it
    const checkInterval = setInterval(() => {
      if (window.fs) {
        setIsReady(true);
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Clean up
    return () => clearInterval(checkInterval);
  }, []);
  
  /**
   * Read a file from the filesystem
   * @param {string} path - Path to the file
   * @returns {Promise<string|Buffer>} - File contents
   */
  const readFile = useCallback((path, options = { encoding: 'utf8' }) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.readFile(path, options, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }, [isReady]);
  
  /**
   * Write a file to the filesystem
   * @param {string} path - Path to the file
   * @param {string|Buffer} data - Data to write
   * @returns {Promise<void>}
   */
  const writeFile = useCallback((path, data, options = { encoding: 'utf8' }) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.writeFile(path, data, options, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, [isReady]);
  
  /**
   * Check if a file exists
   * @param {string} path - Path to the file
   * @returns {Promise<boolean>}
   */
  const fileExists = useCallback((path) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.stat(path, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(false);
          } else {
            reject(err);
          }
          return;
        }
        resolve(true);
      });
    });
  }, [isReady]);
  
  /**
   * List files in a directory
   * @param {string} path - Path to the directory
   * @returns {Promise<string[]>}
   */
  const readdir = useCallback((path) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.readdir(path, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    });
  }, [isReady]);
  
  /**
   * Create a directory
   * @param {string} path - Path to the directory
   * @returns {Promise<void>}
   */
  const mkdir = useCallback((path, options = { recursive: true }) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.mkdir(path, options, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, [isReady]);
  
  /**
   * Delete a file
   * @param {string} path - Path to the file
   * @returns {Promise<void>}
   */
  const unlink = useCallback((path) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.unlink(path, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, [isReady]);
  
  /**
   * Delete a directory
   * @param {string} path - Path to the directory
   * @returns {Promise<void>}
   */
  const rmdir = useCallback((path) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Filesystem not ready'));
        return;
      }
      
      window.fs.rmdir(path, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, [isReady]);
  
  return {
    isReady,
    error,
    readFile,
    writeFile,
    fileExists,
    readdir,
    mkdir,
    unlink,
    rmdir
  };
};

export default useFilesystem;
