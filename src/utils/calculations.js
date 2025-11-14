import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

/**
 * Calcula el tiempo transcurrido desde que dejó de fumar
 * @param {Date} quitDate - Fecha en la que dejó de fumar
 * @returns {Object} Objeto con días, horas y minutos
 */
export const calculateTimeSinceQuit = (quitDate) => {
  const now = new Date();
  const days = differenceInDays(now, quitDate);
  const hours = differenceInHours(now, quitDate) % 24;
  const minutes = differenceInMinutes(now, quitDate) % 60;

  return { days, hours, minutes };
};

/**
 * Calcula el dinero ahorrado
 * @param {Date} quitDate - Fecha en la que dejó de fumar
 * @param {number} pricePerPack - Precio del paquete
 * @param {number} cigarettesPerPack - Cigarrillos por paquete
 * @param {number} cigarettesPerDayBefore - Cigarrillos que fumaba al día
 * @param {number} cigarettesPerDayNow - Cigarrillos que fuma ahora
 * @returns {number} Dinero ahorrado en euros
 */
export const calculateMoneySaved = (
  quitDate,
  pricePerPack,
  cigarettesPerPack,
  cigarettesPerDayBefore,
  cigarettesPerDayNow = 0
) => {
  let days = differenceInDays(new Date(), quitDate);
  // Si es el mismo día, contar como 1 día
  if (days === 0) days = 1;
  
  const cigarettesReduced = cigarettesPerDayBefore - cigarettesPerDayNow;
  const totalCigarettesAvoided = cigarettesReduced * days;
  const pricePerCigarette = pricePerPack / cigarettesPerPack;
  
  return totalCigarettesAvoided * pricePerCigarette;
};

/**
 * Calcula los cigarrillos no fumados
 * @param {Date} quitDate - Fecha en la que dejó de fumar
 * @param {number} cigarettesPerDayBefore - Cigarrillos que fumaba al día
 * @param {number} cigarettesPerDayNow - Cigarrillos que fuma ahora
 * @returns {number} Total de cigarrillos no fumados
 */
export const calculateCigarettesAvoided = (
  quitDate,
  cigarettesPerDayBefore,
  cigarettesPerDayNow = 0
) => {
  const days = differenceInDays(new Date(), quitDate);
  const cigarettesReduced = cigarettesPerDayBefore - cigarettesPerDayNow;
  
  return cigarettesReduced * days;
};

/**
 * Calcula el progreso hacia un objetivo
 * @param {number} saved - Dinero ahorrado
 * @param {number} goalPrice - Precio del objetivo
 * @param {number} dailySavings - Ahorro diario
 * @returns {Object} Porcentaje y días restantes estimados
 */
export const calculateGoalProgress = (
  saved,
  goalPrice,
  dailySavings
) => {
  const percentage = Math.min((saved / goalPrice) * 100, 100);
  const remaining = goalPrice - saved;
  const daysRemaining = remaining > 0 ? Math.ceil(remaining / dailySavings) : 0;

  return {
    percentage: percentage.toFixed(1),
    remaining,
    daysRemaining
  };
};

/**
 * Calcula el ahorro diario
 * @param {number} pricePerPack - Precio del paquete
 * @param {number} cigarettesPerPack - Cigarrillos por paquete
 * @param {number} cigarettesPerDayBefore - Cigarrillos que fumaba al día
 * @param {number} cigarettesPerDayNow - Cigarrillos que fuma ahora
 * @returns {number} Ahorro diario en euros
 */
export const calculateDailySavings = (
  pricePerPack,
  cigarettesPerPack,
  cigarettesPerDayBefore,
  cigarettesPerDayNow = 0
) => {
  const pricePerCigarette = pricePerPack / cigarettesPerPack;
  const cigarettesReduced = cigarettesPerDayBefore - cigarettesPerDayNow;
  
  return cigarettesReduced * pricePerCigarette;
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};