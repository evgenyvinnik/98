import React from 'react';
import { useMessageBox } from '../contexts/MessageBoxContext';
import MessageBox from './MessageBox';

const MessageBoxContainer = () => {
  const { messageBox } = useMessageBox();

  if (!messageBox) {
    return null;
  }

  return <MessageBox options={messageBox} />;
};

export default MessageBoxContainer;
