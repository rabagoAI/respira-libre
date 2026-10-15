import { useEffect, useState, useCallback } from 'react';

/**
 * Ofrece instalar la app cuando el navegador lo permite (evento beforeinstallprompt,
 * disponible en Chrome, Edge y Android; Safari no lo tiene)
 * @returns {Object} { canInstall, install }
 */
export const useInstallPrompt = () => {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const handlePrompt = (e) => {
      // Evitar el aviso automático del navegador y mostrar nuestro propio botón
      e.preventDefault();
      setPromptEvent(e);
    };
    const handleInstalled = () => setPromptEvent(null);

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    // El evento solo se puede usar una vez
    setPromptEvent(null);
  }, [promptEvent]);

  return { canInstall: Boolean(promptEvent), install };
};
