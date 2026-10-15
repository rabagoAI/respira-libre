/**
 * Registra el service worker (solo en producción: en desarrollo la caché
 * impediría ver los cambios al momento)
 */
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('No se pudo registrar el service worker:', error);
    });
  });
};
