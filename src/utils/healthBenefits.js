/**
 * Beneficios de salud según el tiempo sin fumar
 * Basado en estudios médicos de la OMS y CDC
 * `system` indica el sistema corporal al que afecta (ver utils/recovery.js)
 */
export const healthBenefits = [
  {
    minutes: 20,
    title: "Presión arterial normal",
    description: "Tu ritmo cardíaco y presión arterial vuelven a la normalidad",
    system: 'cardio'
  },
  {
    minutes: 120, // 2 horas
    title: "Mejora circulación",
    description: "La circulación comienza a mejorar, especialmente en manos y pies",
    system: 'circulation'
  },
  {
    minutes: 720, // 12 horas
    title: "Nivel de CO normalizado",
    description: "El nivel de monóxido de carbono en tu sangre vuelve a la normalidad",
    system: 'respiratory'
  },
  {
    days: 1,
    title: "Riesgo cardíaco reducido",
    description: "El riesgo de ataque cardíaco comienza a disminuir",
    system: 'cardio'
  },
  {
    days: 2,
    title: "Sentidos recuperados",
    description: "Las terminaciones nerviosas comienzan a regenerarse. Mejora el olfato y gusto",
    system: 'wellbeing'
  },
  {
    days: 3,
    title: "Respiración más fácil",
    description: "Los bronquios comienzan a relajarse, respirar es más fácil",
    system: 'respiratory'
  },
  {
    days: 7,
    title: "Primera semana completada",
    description: "¡Has superado lo más difícil! La dependencia física disminuye notablemente",
    system: 'wellbeing'
  },
  {
    days: 14,
    title: "Circulación mejorada",
    description: "La circulación sanguínea mejora significativamente",
    system: 'circulation'
  },
  {
    days: 30,
    title: "Función pulmonar mejorada",
    description: "La función pulmonar aumenta hasta un 30%. Menos tos y falta de aire",
    system: 'respiratory'
  },
  {
    days: 90,
    title: "Regeneración pulmonar",
    description: "Los cilios pulmonares se regeneran, mejorando la limpieza de los pulmones",
    system: 'respiratory'
  },
  {
    days: 180,
    title: "Energía renovada",
    description: "Notas un aumento significativo de energía y capacidad física",
    system: 'wellbeing'
  },
  {
    days: 365,
    title: "¡Un año sin fumar!",
    description: "El riesgo de enfermedad cardíaca coronaria es la mitad del de un fumador",
    system: 'cardio'
  },
  {
    days: 1825, // 5 años
    title: "Riesgo de cáncer reducido",
    description: "El riesgo de cáncer de boca, garganta y esófago es la mitad",
    system: 'wellbeing'
  },
  {
    days: 3650, // 10 años
    title: "Riesgo de cáncer pulmonar",
    description: "El riesgo de morir de cáncer de pulmón es la mitad del de un fumador",
    system: 'respiratory'
  },
  {
    days: 5475, // 15 años
    title: "Riesgo cardíaco normalizado",
    description: "El riesgo de enfermedad cardíaca es igual al de alguien que nunca fumó",
    system: 'cardio'
  }
];

const MINUTES_PER_DAY = 24 * 60;

/**
 * Minutos sin fumar necesarios para alcanzar un beneficio
 * @param {Object} benefit - Beneficio con `minutes` o `days`
 * @returns {number} Minutos necesarios
 */
export const getBenefitMinutes = (benefit) =>
  benefit.minutes ?? benefit.days * MINUTES_PER_DAY;

/**
 * Obtiene los beneficios alcanzados según los minutos sin fumar
 * @param {number} minutesSinceQuit - Minutos desde que dejó de fumar
 * @returns {Array} Array de beneficios alcanzados
 */
export const getAchievedBenefits = (minutesSinceQuit) => {
  return healthBenefits.filter(benefit => minutesSinceQuit >= getBenefitMinutes(benefit));
};

/**
 * Obtiene el siguiente beneficio a alcanzar
 * @param {number} minutesSinceQuit - Minutos desde que dejó de fumar
 * @returns {Object|null} Siguiente beneficio o null si alcanzó todos
 */
export const getNextBenefit = (minutesSinceQuit) => {
  return healthBenefits.find(benefit => minutesSinceQuit < getBenefitMinutes(benefit)) ?? null;
};

/**
 * Convierte minutos restantes en la unidad más legible
 * @param {number} minutesRemaining - Minutos que faltan
 * @returns {Object} { value, unit }
 */
export const formatTimeRemaining = (minutesRemaining) => {
  if (minutesRemaining < 60) {
    return { value: minutesRemaining, unit: minutesRemaining === 1 ? 'minuto' : 'minutos' };
  }
  
  if (minutesRemaining < MINUTES_PER_DAY) {
    const hours = Math.ceil(minutesRemaining / 60);
    return { value: hours, unit: hours === 1 ? 'hora' : 'horas' };
  }
  
  const days = Math.ceil(minutesRemaining / MINUTES_PER_DAY);
  return { value: days, unit: days === 1 ? 'día' : 'días' };
};

/**
 * Calcula el tiempo restante para el siguiente beneficio
 * @param {number} minutesSinceQuit - Minutos desde que dejó de fumar
 * @returns {Object|null} Tiempo restante o null
 */
export const getTimeToNextBenefit = (minutesSinceQuit) => {
  const nextBenefit = getNextBenefit(minutesSinceQuit);
  if (!nextBenefit) return null;
  return formatTimeRemaining(getBenefitMinutes(nextBenefit) - minutesSinceQuit);
};

/**
 * Duración corta y legible de un tiempo en minutos (p. ej. para hitos)
 * @param {number} minutes - Minutos
 * @returns {string} "20 min", "12 h", "3 días", "1 año"...
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < MINUTES_PER_DAY) return `${Math.round(minutes / 60)} h`;
  const days = Math.round(minutes / MINUTES_PER_DAY);
  if (days < 365) return `${days} ${days === 1 ? 'día' : 'días'}`;
  const years = Math.round(days / 365);
  return `${years} ${years === 1 ? 'año' : 'años'}`;
};
