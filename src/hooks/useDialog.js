import { useEffect, useRef } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento accesible de un diálogo modal:
 * - Lleva el foco al diálogo al abrirse y lo devuelve al cerrarse
 * - Mantiene el foco dentro con Tab / Shift+Tab
 * - Cierra con Escape
 * @param {Function} onClose - Se llama al pulsar Escape
 * @param {boolean} active - Si el diálogo está activo (permite diálogos anidados)
 * @returns {Object} ref para el elemento del diálogo
 */
export const useDialog = (onClose, active = true) => {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!active || !dialog) return;

    const previouslyFocused = document.activeElement;
    const getFocusable = () =>
      [...dialog.querySelectorAll(FOCUSABLE)].filter(el => !el.disabled && el.offsetParent !== null);

    (getFocusable()[0] ?? dialog).focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active]);

  return ref;
};
