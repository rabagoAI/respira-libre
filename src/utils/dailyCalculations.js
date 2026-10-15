import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns';
import { toLocalDateString } from './dates';

/**
 * Calcula el ahorro real basado en el registro diario
 * Recorre cada día desde la fecha de inicio hasta hoy (incluido):
 * - Días con registro: usa el valor registrado
 * - Días sin registro: usa el último valor conocido
 *   (cigarettesPerDayNow antes del primer registro)
 * @param {Object} userData - Datos del usuario con dailyLog
 * @returns {Object} Dinero ahorrado y cigarrillos evitados
 */
export const calculateRealSavings = (userData) => {
  const { 
    quitDate, 
    packPrice, 
    cigarettesPerPack, 
    cigarettesPerDayBefore, 
    cigarettesPerDayNow,
    dailyLog = {}
  } = userData;

  const pricePerCigarette = packPrice / cigarettesPerPack;
  const startDate = startOfDay(new Date(quitDate));
  const totalDays = Math.max(differenceInCalendarDays(new Date(), startDate) + 1, 1);

  let totalCigarettesAvoided = 0;
  let totalConsumed = 0;
  let daysTracked = 0;
  let lastKnown = cigarettesPerDayNow;

  for (let i = 0; i < totalDays; i++) {
    const dateStr = toLocalDateString(addDays(startDate, i));
    const logged = dailyLog[dateStr];

    if (logged !== undefined) {
      lastKnown = logged;
      totalConsumed += logged;
      daysTracked++;
    }

    totalCigarettesAvoided += cigarettesPerDayBefore - lastKnown;
  }

  const averageDaily = daysTracked > 0 ? totalConsumed / daysTracked : cigarettesPerDayNow;

  return {
    totalMoneySaved: totalCigarettesAvoided * pricePerCigarette,
    totalCigarettesAvoided,
    averageDaily: Math.round(averageDaily * 10) / 10,
    daysTracked
  };
};

/**
 * Obtiene el consumo más reciente registrado
 * @param {Object} userData - Datos del usuario con dailyLog
 * @returns {number} Último valor del registro o cigarettesPerDayNow si no hay
 */
export const getCurrentConsumption = (userData) => {
  const dates = Object.keys(userData.dailyLog || {}).sort();
  return dates.length > 0
    ? userData.dailyLog[dates[dates.length - 1]]
    : userData.cigarettesPerDayNow;
};

/**
 * Obtiene el promedio móvil de los últimos N días
 * @param {Object} dailyLog - Registro diario
 * @param {number} days - Número de días para el promedio
 * @returns {number} Promedio móvil
 */
export const getMovingAverage = (dailyLog, days = 7) => {
  if (!dailyLog || Object.keys(dailyLog).length === 0) return 0;

  const dates = Object.keys(dailyLog).sort().slice(-days);
  const total = dates.reduce((sum, date) => sum + dailyLog[date], 0);
  
  return dates.length > 0 ? Math.round((total / dates.length) * 10) / 10 : 0;
};

/**
 * Obtiene estadísticas de tendencia
 * @param {Object} dailyLog - Registro diario
 * @returns {Object} Estadísticas de tendencia
 */
export const getTrendStats = (dailyLog) => {
  if (!dailyLog || Object.keys(dailyLog).length < 2) {
    return { trend: 'neutral', percentage: 0 };
  }

  const dates = Object.keys(dailyLog).sort();
  const lastWeek = dates.slice(-7);
  
  if (lastWeek.length < 2) {
    return { trend: 'neutral', percentage: 0 };
  }

  const first = dailyLog[lastWeek[0]];
  const last = dailyLog[lastWeek[lastWeek.length - 1]];

  // Si se partía de 0 no hay porcentaje posible: cualquier cigarrillo es empeorar
  if (first === 0) {
    return last === 0
      ? { trend: 'stable', percentage: 0 }
      : { trend: 'worsening', percentage: 100 };
  }
  
  const change = ((last - first) / first) * 100;

  return {
    trend: change < -5 ? 'improving' : change > 5 ? 'worsening' : 'stable',
    percentage: Math.abs(Math.round(change))
  };
};