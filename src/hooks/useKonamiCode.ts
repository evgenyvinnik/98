import { useEffect, useState, useCallback } from 'react';

const konamiCodeSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback: () => void) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const handler = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    const newSequence = [...keySequence, key.toLowerCase()];
    
    while (newSequence.length > konamiCodeSequence.length) {
      newSequence.shift();
    }
    
    setKeySequence(newSequence);

    if (newSequence.join('') === konamiCodeSequence.join('')) {
      callback();
    }
  }, [keySequence, callback]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handler]);
};
