import { format, parseISO } from 'date-fns';

/**
 * Devuelve la fecha en formato yyyy-MM-dd según la hora local
 * (toISOString usa UTC y de madrugada devuelve el día anterior)
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha local en formato yyyy-MM-dd
 */
export const toLocalDateString = (date = new Date()) => format(date, 'yyyy-MM-dd');

/**
 * Convierte un string yyyy-MM-dd en un Date a medianoche local
 * (new Date('yyyy-MM-dd') lo interpreta como medianoche UTC)
 * @param {string} dateString - Fecha en formato yyyy-MM-dd
 * @returns {Date} Fecha a medianoche local
 */
export const parseLocalDate = (dateString) => parseISO(dateString);
