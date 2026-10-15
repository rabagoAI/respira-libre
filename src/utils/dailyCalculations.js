import { addDays, differenceInCalendarDays, startOfDay } from 'date-fns';
import { toLocalDateString } from './dates';

/**
 * Serie con el consumo de cada día desde la fecha de inicio hasta hoy (incluido):
 * - Días con registro: el valor registrado
 * - Días sin registro: el último valor conocido
 *   (cigarettesPerDayNow antes del primer registro)
 * @param {Object} userData - Datos del usuario con dailyLog
 * @returns {Array} [{ date, value, logged }] de más antiguo a hoy
 */
export const getDailySeries = (userData) => {
  const { quitDate, cigarettesPerDayNow, dailyLog = {} } = userData;
  const startDate = startOfDay(new Date(quitDate));
  const totalDays = Math.max(differenceInCalendarDays(new Date(), startDate) + 1, 1);

  const series = [];
  let lastKnown = cigarettesPerDayNow;
  for (let i = 0; i < totalDays; i++) {
    const date = toLocalDateString(addDays(startDate, i));
    const logged = dailyLog[date] !== undefined;
    if (logged) lastKnown = dailyLog[date];
    series.push({ date, value: lastKnown, logged });
  }
  return series;
};

/**
 * Calcula el ahorro real basado en el registro diario (ver getDailySeries)
 * @param {Object} userData - Datos del usuario con dailyLog
 * @returns {Object} Dinero ahorrado y cigarrillos evitados
 */
export const calculateRealSavings = (userData) => {
  const { packPrice, cigarettesPerPack, cigarettesPerDayBefore, cigarettesPerDayNow } = userData;
  const series = getDailySeries(userData);
  const loggedDays = series.filter(day => day.logged);

  const totalCigarettesAvoided = series.reduce((sum, day) => sum + cigarettesPerDayBefore - day.value, 0);
  const totalConsumed = loggedDays.reduce((sum, day) => sum + day.value, 0);
  const averageDaily = loggedDays.length > 0 ? totalConsumed / loggedDays.length : cigarettesPerDayNow;

  return {
    totalMoneySaved: totalCigarettesAvoided * (packPrice / cigarettesPerPack),
    totalCigarettesAvoided,
    averageDaily: Math.round(averageDaily * 10) / 10,
    daysTracked: loggedDays.length
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
/**
 * Prepara los datos de la gráfica de consumo de los últimos N días
 * (sin pasar de la fecha de inicio). Los días sin registro quedan a null
 * @param {Object} dailyLog - Registro diario
 * @param {string} quitDate - Fecha de inicio (ISO)
 * @param {number} days - Número máximo de días a mostrar
 * @returns {Array} [{ date, value }] ordenado de más antiguo a hoy
 */
export const getChartData = (dailyLog = {}, quitDate, days = 30) => {
  const today = startOfDay(new Date());
  const startDate = startOfDay(new Date(quitDate));
  const daysSinceStart = differenceInCalendarDays(today, startDate) + 1;
  const total = Math.max(Math.min(days, daysSinceStart), 1);

  return Array.from({ length: total }, (_, i) => {
    const date = toLocalDateString(addDays(today, i - total + 1));
    return { date, value: dailyLog[date] ?? null };
  });
};
