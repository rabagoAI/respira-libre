import { useEffect, useState } from 'react';

/**
 * Comprueba si una imagen se puede cargar (p. ej. un archivo opcional de /public)
 * @param {string} src - Ruta de la imagen
 * @returns {boolean} true cuando la imagen ha cargado correctamente
 */
export const useImageAvailable = (src) => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => { if (!cancelled) setAvailable(true); };
    image.onerror = () => { if (!cancelled) setAvailable(false); };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);

  return available;
};
