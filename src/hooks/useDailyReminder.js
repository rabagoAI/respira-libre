import { useEffect } from 'react';
import { getNotificationDelay, getReminder, isTodayLogged } from '../utils/reminder';
import { toLocalDateString } from '../utils/dates';

/**
 * Muestra una notificación del sistema (a través del service worker si lo hay,
 * para que al pulsarla se abra la app)
 * @param {string} title - Título
 * @param {string} body - Texto
 */
export const showSystemNotification = async (title, body) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;
  const options = { body, icon: '/icon-192.png', badge: '/icon-192.png', tag: 'respira-libre-recordatorio', lang: 'es' };
  try {
    if (navigator.serviceWorker?.controller) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
    return true;
  } catch (error) {
    console.error('No se pudo mostrar la notificación:', error);
    return false;
  }
};

/**
 * Programa la notificación del recordatorio diario mientras la app está abierta
 * (aunque sea en segundo plano). Sin servidor de notificaciones push no se puede
 * avisar con la app cerrada; para eso está también el aviso dentro de la app.
 * @param {Object} userData - Datos del usuario
 * @param {Function} onUpdateData - Actualiza los datos (admite función)
 */
export const useDailyReminder = (userData, onUpdateData) => {
  const { enabled, time, lastNotified } = getReminder(userData);
  const loggedToday = isTodayLogged(userData);
  const today = toLocalDateString();

  useEffect(() => {
    const delay = getNotificationDelay({
      reminder: { enabled, time, lastNotified },
      dailyLog: loggedToday ? { [today]: 0 } : {}
    });
    if (delay === null) return;

    const timeout = setTimeout(async () => {
      const shown = await showSystemNotification(
        '¿Qué tal hoy?',
        'Registra cuántos cigarrillos has fumado para seguir tu progreso.'
      );
      if (shown) {
        onUpdateData(prev => ({ ...prev, reminder: { ...getReminder(prev), lastNotified: today } }));
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [enabled, time, lastNotified, loggedToday, today, onUpdateData]);
};
