import React, { createContext, useState, useContext } from 'react';

const MessageBoxContext = createContext();

export const useMessageBox = () => useContext(MessageBoxContext);

export const MessageBoxProvider = ({ children }) => {
  const [messageBox, setMessageBox] = useState(null);
  const [resolvePromise, setResolvePromise] = useState(null);

  const showMessageBox = (options) => {
    return new Promise((resolve) => {
      setMessageBox(options);
      setResolvePromise(() => resolve);
    });
  };

  const closeMessageBox = (value) => {
    if (resolvePromise) {
      resolvePromise(value);
    }
    setMessageBox(null);
    setResolvePromise(null);
  };

  // Expose the function to the window object for legacy scripts
  useState(() => {
    window.showMessageBox = showMessageBox;
  }, []);

  return (
    <MessageBoxContext.Provider value={{ messageBox, showMessageBox, closeMessageBox }}>
      {children}
    </MessageBoxContext.Provider>
  );
};
