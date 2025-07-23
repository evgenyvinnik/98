import React, { useEffect, useRef } from 'react';
import { useMessageBox } from '../contexts/MessageBoxContext';

const MessageBox = ({ options }) => {
  const { closeMessageBox } = useMessageBox();
  const windowRef = useRef(null);

  useEffect(() => {
    const {
      title = window.defaultMessageBoxTitle ?? 'Alert',
      message,
      messageHTML,
      buttons = [{ label: 'OK', value: 'ok', default: true }],
      iconID = 'warning',
      windowOptions = {},
    } = options;

    const $window = new window.$Window(Object.assign({
      title,
      resizable: false,
      innerWidth: 400,
      maximizeButton: false,
      minimizeButton: false,
    }, windowOptions));
    windowRef.current = $window;

    const $message = window.$('<div>').css({
        textAlign: 'left',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: '14px',
        marginTop: '22px',
        flex: 1,
        minWidth: 0,
        whiteSpace: 'normal',
    });

    if (messageHTML) {
        $message.html(messageHTML);
    } else if (message) {
        $message.text(message).css({
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
        });
    }

    window.$('<div>').append(
        window.$('<img width="32" height="32">').attr('src', `images/icons/${iconID}-32x32-8bpp.png`).css({
            margin: '16px',
            display: 'block',
        }),
        $message
    ).css({
        display: 'flex',
        flexDirection: 'row',
    }).appendTo($window.$content);

    $window.$content.css({
        textAlign: 'center',
    });

    for (const button of buttons) {
        const $button = $window.$Button(button.label, () => {
            button.action?.();
            closeMessageBox(button.value);
        });
        if (button.default) {
            $button.addClass('default');
            $button.focus();
            setTimeout(() => $button.focus(), 0);
        }
        $button.css({
            minWidth: 75,
            height: 23,
            margin: '16px 2px',
        });
    }
    
    $window.on('closed', () => {
        closeMessageBox('closed');
    });

    $window.center();

    try {
        new Audio('/audio/CHORD.WAV').play().catch(e => console.warn("Failed to play sound", e));
    } catch (error) {
        console.warn(`Failed to play CHORD.WAV: `, error);
    }

    return () => {
      if (windowRef.current && !windowRef.current.is_closed) {
        windowRef.current.close();
      }
    };
  }, [options, closeMessageBox]);

  return null; // This component manages the jQuery UI, but doesn't render any React DOM itself.
};

export default MessageBox;
