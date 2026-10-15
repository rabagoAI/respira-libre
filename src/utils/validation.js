import { toLocalDateString } from './dates';

// Límite razonable de cigarrillos al día para descartar errores de escritura
export const MAX_CIGARETTES_PER_DAY = 200;

/**
 * Comprueba que un valor sea un número entero de cigarrillos válido
 * @param {string|number} value - Valor introducido
 * @param {number} min - Mínimo permitido
 * @returns {boolean} true si es válido
 */
export const isValidCigaretteCount = (value, min = 0) => {
  if (value === '' || value === null || value === undefined) return false;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= MAX_CIGARETTES_PER_DAY;
};

/**
 * Valida los datos de configuración del usuario (onboarding y ajustes)
 * @param {Object} formData - Valores del formulario
 * @returns {Object} Errores por campo (vacío si todo es válido)
 */
export const validateUserData = (formData) => {
  const errors = {};

  if (!formData.packPrice || parseFloat(formData.packPrice) <= 0) {
    errors.packPrice = 'Introduce un precio válido';
  }

  if (!isValidCigaretteCount(formData.cigarettesPerPack, 1)) {
    errors.cigarettesPerPack = 'Introduce una cantidad válida';
  }

  if (!isValidCigaretteCount(formData.cigarettesPerDayBefore, 1)) {
    errors.cigarettesPerDayBefore = 'Introduce cuántos cigarrillos fumabas';
  }

  if (!isValidCigaretteCount(formData.cigarettesPerDayNow)) {
    errors.cigarettesPerDayNow = 'Introduce cuántos fumas ahora (0 si lo dejaste)';
  } else if (Number(formData.cigarettesPerDayNow) > Number(formData.cigarettesPerDayBefore)) {
    errors.cigarettesPerDayNow = 'No puede ser mayor que lo que fumabas antes';
  }

  if (!formData.quitDate) {
    errors.quitDate = 'Selecciona una fecha';
  } else if (formData.quitDate > toLocalDateString()) {
    errors.quitDate = 'La fecha no puede ser futura';
  }

  return errors;
};
