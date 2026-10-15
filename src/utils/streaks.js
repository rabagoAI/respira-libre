/**
 * Racha actual (terminando en el último día) y mejor racha de días que cumplen una condición
 * @param {Array} series - Resultado de getDailySeries
 * @param {Function} predicate - Condición que debe cumplir cada día
 * @returns {Object} { current, best }
 */
const getRun = (series, predicate) => {
  let best = 0;
  let run = 0;
  for (const day of series) {
    run = predicate(day) ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return { current: run, best };
};

/**
 * Rachas del usuario a partir de su serie diaria
 * - smokeFree: días seguidos sin fumar
 * - reduction: días seguidos fumando menos que antes de empezar
 * - logging: días seguidos con registro (hoy sin registrar todavía no rompe la racha)
 * @param {Array} series - Resultado de getDailySeries
 * @param {number} cigarettesPerDayBefore - Consumo diario antes de empezar
 * @returns {Object} { smokeFree, reduction, logging } con { current, best }
 */
export const getStreaks = (series, cigarettesPerDayBefore) => {
  const smokeFree = getRun(series, day => day.value === 0);
  const reduction = getRun(series, day => day.value < cigarettesPerDayBefore);

  const todayLogged = series.length > 0 && series[series.length - 1].logged;
  const loggingSeries = todayLogged ? series : series.slice(0, -1);
  const logging = getRun(loggingSeries, day => day.logged);

  return { smokeFree, reduction, logging };
};
