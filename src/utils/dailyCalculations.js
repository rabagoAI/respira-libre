import { differenceInCalendarDays, differenceInDays, parseISO } from 'date-fns';

/**
 * Calcula el ahorro real basado en el registro diario
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
    dailyLog 
  } = userData;

  const pricePerCigarette = packPrice / cigarettesPerPack;
  const startDate = new Date(quitDate);
  const today = new Date();
  const daysSince = differenceInDays(today, startDate);

  let totalCigarettesAvoided = 0;
  let totalMoneySaved = 0;

  // Si no hay registro diario, usar el método antiguo
  if (!dailyLog || Object.keys(dailyLog).length === 0) {
    const dailyReduction = cigarettesPerDayBefore - cigarettesPerDayNow;
    totalCigarettesAvoided = dailyReduction * Math.max(daysSince, 1);
    totalMoneySaved = totalCigarettesAvoided * pricePerCigarette;
    
    return {
      totalMoneySaved,
      totalCigarettesAvoided,
      averageDaily: cigarettesPerDayNow,
      daysTracked: 0
    };
  }

  // Calcular día por día usando el registro
  const logDates = Object.keys(dailyLog).sort();
  // Las claves del registro son fechas locales yyyy-MM-dd
  const firstLogDate = parseISO(logDates[0]);
  const lastLogDate = parseISO(logDates[logDates.length - 1]);

  // Días antes del primer registro: usar cigarettesPerDayNow inicial
  const daysBeforeLog = differenceInCalendarDays(firstLogDate, startDate);
  if (daysBeforeLog > 0) {
    const reduction = cigarettesPerDayBefore - cigarettesPerDayNow;
    totalCigarettesAvoided += reduction * daysBeforeLog;
  }

  // Días con registro: usar valores reales
  let totalConsumed = 0;
  let daysTracked = 0;

  logDates.forEach(dateStr => {
    const consumed = dailyLog[dateStr];
    const reduction = cigarettesPerDayBefore - consumed;
    totalCigarettesAvoided += reduction;
    totalConsumed += consumed;
    daysTracked++;
  });

  // Días después del último registro hasta hoy: usar último valor registrado
  const daysSinceLastLog = differenceInCalendarDays(today, lastLogDate);
  if (daysSinceLastLog > 0) {
    const lastConsumed = dailyLog[logDates[logDates.length - 1]];
    const reduction = cigarettesPerDayBefore - lastConsumed;
    totalCigarettesAvoided += reduction * daysSinceLastLog;
  }

  totalMoneySaved = totalCigarettesAvoided * pricePerCigarette;
  const averageDaily = daysTracked > 0 ? totalConsumed / daysTracked : cigarettesPerDayNow;

  return {
    totalMoneySaved,
    totalCigarettesAvoided,
    averageDaily: Math.round(averageDaily * 10) / 10,
    daysTracked
  };
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
  
  const change = ((last - first) / first) * 100;

  return {
    trend: change < -5 ? 'improving' : change > 5 ? 'worsening' : 'stable',
    percentage: Math.abs(Math.round(change))
  };
};