import { useEffect, useRef } from 'react';
import { useThreeDee } from '../contexts/ThreeDeeContext';

// Konami code listener hook
const useKonamiCode = (callback) => {
    const sequence = useRef([]);
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const handler = (e) => {
            sequence.current.push(e.key);
            if (sequence.current.length > konamiCode.length) {
                sequence.current.shift();
            }
            if (sequence.current.join('') === konamiCode.join('')) {
                callback();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [callback]);
};

const ThreeDeeEffect = () => {
    const { isThreeDeeEnabled, toggleThreeDee } = useThreeDee();
    const animationFrameId = useRef(null);

    useKonamiCode(toggleThreeDee);

    useEffect(() => {
        const animate = () => {
            document.querySelectorAll('.os-window').forEach(el => {
                const rect = el.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const rotateY = -(x - window.innerWidth / 2) / window.innerWidth / 3;
                const rotateX = (y - window.innerHeight / 2) / window.innerHeight / 3;

                el.style.transform = `perspective(4000px) rotateY(${rotateY}turn) rotateX(${rotateX}turn)`;
                el.style.transformOrigin = '50% 50%';
                el.style.transformStyle = 'preserve-3d';
            });
            animationFrameId.current = requestAnimationFrame(animate);
        };

        if (isThreeDeeEnabled) {
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            document.querySelectorAll('.os-window').forEach(el => {
                el.style.transform = '';
            });
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isThreeDeeEnabled]);

    return null; // This component only produces a side effect
};

export default ThreeDeeEffect;
