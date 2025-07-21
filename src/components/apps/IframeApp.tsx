import React, { useState, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useMessageBox } from '../../contexts/MessageBoxContext';

const styles = stylex.create({
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    flex: 1,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'var(--ButtonFace)',
    color: 'var(--ButtonText)',
  },
});

interface IframeAppProps {
  src: string;
  title: string;
}

const IframeApp: React.FC<IframeAppProps> = ({ src, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { showMessageBox } = useMessageBox();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      try {
        if (iframe.contentWindow) {
          (iframe.contentWindow as any).showMessageBox = showMessageBox;
        }
      } catch (e) {
        console.warn(`Could not attach APIs to iframe '${src}':`, e);
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [src, showMessageBox]);

  return (
    <>
      {isLoading && <div {...stylex.props(styles.loading)}>Loading...</div>}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        {...stylex.props(styles.iframe)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

export default IframeApp;
