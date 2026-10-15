import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

/**
 * Anima un número desde su valor anterior hasta el nuevo (efecto contador)
 * @param {number} value - Valor final
 * @param {number} duration - Duración en segundos
 * @returns {number} Valor a mostrar en cada fotograma
 */
export const useAnimatedNumber = (value, duration = 1.2) => {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(previous.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: setDisplay
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return reduceMotion ? value : display;
};
