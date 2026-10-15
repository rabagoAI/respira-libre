import { toLocalDateString } from './dates';

export const DEFAULT_REMINDER = { enabled: false, time: '21:00', lastNotified: null };

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Comprueba que una hora tenga el formato HH:MM
 * @param {string} time - Hora
 * @returns {boolean}
 */
export const isValidReminderTime = (time) => TIME_PATTERN.test(time ?? '');

/**
 * Fecha de hoy a la hora del recordatorio
 * @param {string} time - Hora HH:MM
 * @param {Date} now - Momento actual
 * @returns {Date}
 */
export const getReminderDate = (time, now = new Date()) => {
  const [, hours, minutes] = TIME_PATTERN.exec(time);
  const date = new Date(now);
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
};

/**
 * Configuración del recordatorio con valores por defecto
 * @param {Object} userData - Datos del usuario
 * @returns {Object} { enabled, time, lastNotified }
 */
export const getReminder = (userData) => {
  const reminder = { ...DEFAULT_REMINDER, ...(userData?.reminder ?? {}) };
  return isValidReminderTime(reminder.time) ? reminder : { ...reminder, time: DEFAULT_REMINDER.time };
};

/**
 * Si hoy ya se ha registrado el consumo
 * @param {Object} userData - Datos del usuario
 * @param {Date} now - Momento actual
 */
export const isTodayLogged = (userData, now = new Date()) =>
  userData?.dailyLog?.[toLocalDateString(now)] !== undefined;

/**
 * Si hay que mostrar el aviso dentro de la app: recordatorio activo,
 * ya ha pasado la hora y hoy no hay registro
 * @param {Object} userData - Datos del usuario
 * @param {Date} now - Momento actual
 */
export const shouldShowReminder = (userData, now = new Date()) => {
  const reminder = getReminder(userData);
  return reminder.enabled && !isTodayLogged(userData, now) && now >= getReminderDate(reminder.time, now);
};

/**
 * Milisegundos hasta la notificación de hoy, o null si hoy no toca
 * (desactivado, ya registrado, ya notificado o la hora ya ha pasado:
 * en ese caso basta con el aviso dentro de la app)
 * @param {Object} userData - Datos del usuario
 * @param {Date} now - Momento actual
 * @returns {number|null}
 */
export const getNotificationDelay = (userData, now = new Date()) => {
  const reminder = getReminder(userData);
  if (!reminder.enabled || isTodayLogged(userData, now)) return null;
  if (reminder.lastNotified === toLocalDateString(now)) return null;
  const delay = getReminderDate(reminder.time, now) - now;
  return delay > 0 ? delay : null;
};
