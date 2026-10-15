import { toLocalDateString } from './dates';
import { isValidCigaretteCount, validateUserData } from './validation';

export const BACKUP_APP_ID = 'respira-libre';
export const BACKUP_VERSION = 1;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Crea el objeto de copia de seguridad con todos los datos del usuario
 * @param {Object} userData - Datos del usuario
 * @param {Array} goals - Objetivos de ahorro
 * @returns {Object} Copia lista para serializar
 */
export const buildBackup = (userData, goals = []) => ({
  app: BACKUP_APP_ID,
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  userData,
  goals
});

/**
 * Nombre del archivo de la copia, con la fecha local
 * @returns {string} Nombre de archivo
 */
export const getBackupFileName = () => `respira-libre-${toLocalDateString()}.json`;

/**
 * Lee y valida una copia de seguridad
 * @param {string} text - Contenido del archivo
 * @returns {Object} { userData, goals }
 * @throws {Error} Con un mensaje para el usuario si el archivo no es válido
 */
export const parseBackup = (text) => {
  let backup;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido');
  }

  if (backup?.app !== BACKUP_APP_ID || typeof backup.version !== 'number') {
    throw new Error('El archivo no es una copia de seguridad de Respira Libre');
  }

  if (backup.version > BACKUP_VERSION) {
    throw new Error('La copia es de una versión más reciente de la app');
  }

  const { userData, goals = [] } = backup;
  const quitDate = new Date(userData?.quitDate);

  if (!userData || Number.isNaN(quitDate.getTime())) {
    throw new Error('La copia no contiene datos de usuario válidos');
  }

  const errors = validateUserData({ ...userData, quitDate: toLocalDateString(quitDate) });
  if (Object.keys(errors).length > 0) {
    throw new Error('La copia contiene una configuración no válida');
  }

  const dailyLog = userData.dailyLog ?? {};
  const validLog = typeof dailyLog === 'object' && !Array.isArray(dailyLog) &&
    Object.entries(dailyLog).every(([date, value]) => DATE_KEY.test(date) && isValidCigaretteCount(value));
  if (!validLog) {
    throw new Error('El registro diario de la copia no es válido');
  }

  const validGoals = Array.isArray(goals) &&
    goals.every(goal => goal && typeof goal.name === 'string' && Number(goal.price) > 0);
  if (!validGoals) {
    throw new Error('Los objetivos de la copia no son válidos');
  }

  return { userData: { ...userData, dailyLog }, goals };
};
