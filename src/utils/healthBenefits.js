/**
 * Fuentes oficiales de los hitos de salud (consultadas en octubre de 2026)
 */
export const HEALTH_SOURCES = {
  sanidad: {
    name: 'Ministerio de Sanidad',
    url: 'https://www.sanidad.gob.es/areas/promocionPrevencion/tabaco/ciudadania/dejarDeFumar/programa/todaviaFumas/ventajasDeNoFumar.htm'
  },
  oms: {
    name: 'Organización Mundial de la Salud',
    url: 'https://www.who.int/es/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation'
  },
  acs: {
    name: 'American Cancer Society',
    url: 'https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html'
  },
  nci: {
    name: 'National Cancer Institute',
    url: 'https://www.cancer.gov/about-cancer/causes-prevention/risk/tobacco/withdrawal-fact-sheet'
  }
};

/**
 * Beneficios de salud según el tiempo sin fumar.
 * Cada texto resume lo que indica su fuente (`source`, ver HEALTH_SOURCES);
 * cuando la fuente da un intervalo, el hito se sitúa dentro de él.
 * `system` indica el sistema corporal al que afecta (ver utils/recovery.js)
 */
export const healthBenefits = [
  {
    minutes: 20,
    title: 'Tensión y pulso normales',
    description: 'La tensión arterial y el ritmo del pulso recuperan sus valores normales',
    system: 'cardio',
    source: 'sanidad'
  },
  {
    minutes: 480, // 8 horas
    title: 'Nicotina y monóxido a la mitad',
    description: 'Los niveles de nicotina y de monóxido de carbono en sangre se reducen a la mitad',
    system: 'circulation',
    source: 'sanidad'
  },
  {
    minutes: 720, // 12 horas
    title: 'Monóxido de carbono normal',
    description: 'El nivel de monóxido de carbono en sangre baja hasta valores normales',
    system: 'respiratory',
    source: 'oms'
  },
  {
    days: 1,
    title: 'Menor riesgo de infarto',
    description: 'Empieza a disminuir el riesgo de sufrir un ataque al corazón',
    system: 'cardio',
    source: 'sanidad'
  },
  {
    days: 2,
    title: 'Mejoran el gusto y el olfato',
    description: 'A las 48 horas sin fumar empiezas a notar mejor los sabores y los olores',
    system: 'wellbeing',
    source: 'sanidad'
  },
  {
    days: 3,
    title: 'Respiras mejor',
    description: 'A las 72 horas sin fumar mejora la respiración',
    system: 'respiratory',
    source: 'sanidad'
  },
  {
    days: 7,
    title: 'Primera semana superada',
    description: 'Los síntomas de abstinencia suelen ser más intensos la primera semana; a partir de ahora tienden a disminuir',
    system: 'wellbeing',
    source: 'nci'
  },
  {
    days: 14,
    title: 'Mejora la circulación',
    description: 'Entre las 2 semanas y los 3 meses mejora la circulación sanguínea y caminar resulta más fácil',
    system: 'circulation',
    source: 'sanidad'
  },
  {
    days: 30,
    title: 'Aumenta la función pulmonar',
    description: 'Entre las 2 y las 12 semanas sin fumar aumenta la función pulmonar',
    system: 'respiratory',
    source: 'oms'
  },
  {
    days: 90,
    title: 'Menos tos y falta de aire',
    description: 'Entre 1 y 9 meses sin fumar disminuyen la tos y la dificultad para respirar',
    system: 'respiratory',
    source: 'oms'
  },
  {
    days: 180,
    title: 'Más energía y bienestar',
    description: 'Entre 1 y 9 meses sin fumar disminuye la fatiga y aumenta la sensación de bienestar',
    system: 'wellbeing',
    source: 'sanidad'
  },
  {
    days: 365,
    title: '¡Un año sin fumar!',
    description: 'El riesgo de cardiopatía coronaria es la mitad que el de una persona que fuma',
    system: 'cardio',
    source: 'oms'
  },
  {
    days: 1825, // 5 años
    title: 'Menos riesgo de cáncer oral',
    description: 'Entre los 5 y los 10 años, el riesgo de cáncer de boca, garganta y laringe se reduce a la mitad',
    system: 'wellbeing',
    source: 'acs'
  },
  {
    days: 3650, // 10 años
    title: 'Riesgo de cáncer de pulmón a la mitad',
    description: 'El riesgo de cáncer de pulmón baja hasta la mitad del de una persona que fuma',
    system: 'respiratory',
    source: 'oms'
  },
  {
    days: 5475, // 15 años
    title: 'Corazón de no fumador',
    description: 'El riesgo de cardiopatía coronaria es igual al de una persona que no fuma',
    system: 'cardio',
    source: 'oms'
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
