/**
 * Beneficios de salud según el tiempo sin fumar
 * Basado en estudios médicos de la OMS y CDC
 */
export const healthBenefits = [
  {
    minutes: 20,
    title: "Presión arterial normal",
    description: "Tu ritmo cardíaco y presión arterial vuelven a la normalidad",
    icon: "❤️",
    color: "text-red-500"
  },
  {
    minutes: 120, // 2 horas
    title: "Mejora circulación",
    description: "La circulación comienza a mejorar, especialmente en manos y pies",
    icon: "🩸",
    color: "text-rose-500"
  },
  {
    minutes: 720, // 12 horas
    title: "Nivel de CO normalizado",
    description: "El nivel de monóxido de carbono en tu sangre vuelve a la normalidad",
    icon: "💨",
    color: "text-blue-500"
  },
  {
    days: 1,
    title: "Riesgo cardíaco reducido",
    description: "El riesgo de ataque cardíaco comienza a disminuir",
    icon: "💚",
    color: "text-green-500"
  },
  {
    days: 2,
    title: "Sentidos recuperados",
    description: "Las terminaciones nerviosas comienzan a regenerarse. Mejora el olfato y gusto",
    icon: "👃",
    color: "text-purple-500"
  },
  {
    days: 3,
    title: "Respiración más fácil",
    description: "Los bronquios comienzan a relajarse, respirar es más fácil",
    icon: "🫁",
    color: "text-cyan-500"
  },
  {
    days: 7,
    title: "Primera semana completada",
    description: "¡Has superado lo más difícil! La dependencia física disminuye notablemente",
    icon: "🎉",
    color: "text-yellow-500"
  },
  {
    days: 14,
    title: "Circulación mejorada",
    description: "La circulación sanguínea mejora significativamente",
    icon: "🔄",
    color: "text-indigo-500"
  },
  {
    days: 30,
    title: "Función pulmonar mejorada",
    description: "La función pulmonar aumenta hasta un 30%. Menos tos y falta de aire",
    icon: "🌬️",
    color: "text-teal-500"
  },
  {
    days: 90,
    title: "Regeneración pulmonar",
    description: "Los cilios pulmonares se regeneran, mejorando la limpieza de los pulmones",
    icon: "✨",
    color: "text-emerald-500"
  },
  {
    days: 180,
    title: "Energía renovada",
    description: "Notas un aumento significativo de energía y capacidad física",
    icon: "⚡",
    color: "text-amber-500"
  },
  {
    days: 365,
    title: "¡Un año sin fumar!",
    description: "El riesgo de enfermedad cardíaca coronaria es la mitad del de un fumador",
    icon: "🏆",
    color: "text-yellow-600"
  },
  {
    days: 1825, // 5 años
    title: "Riesgo de cáncer reducido",
    description: "El riesgo de cáncer de boca, garganta y esófago es la mitad",
    icon: "🛡️",
    color: "text-blue-600"
  },
  {
    days: 3650, // 10 años
    title: "Riesgo de cáncer pulmonar",
    description: "El riesgo de morir de cáncer de pulmón es la mitad del de un fumador",
    icon: "🎯",
    color: "text-green-600"
  },
  {
    days: 5475, // 15 años
    title: "Riesgo cardíaco normalizado",
    description: "El riesgo de enfermedad cardíaca es igual al de alguien que nunca fumó",
    icon: "💪",
    color: "text-red-600"
  }
];

const MINUTES_PER_DAY = 24 * 60;

/**
 * Minutos sin fumar necesarios para alcanzar un beneficio
 * @param {Object} benefit - Beneficio con `minutes` o `days`
 * @returns {number} Minutos necesarios
 */
const getBenefitMinutes = (benefit) =>
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
 * Calcula el tiempo restante para el siguiente beneficio
 * @param {number} minutesSinceQuit - Minutos desde que dejó de fumar
 * @returns {Object|null} Tiempo restante o null
 */
export const getTimeToNextBenefit = (minutesSinceQuit) => {
  const nextBenefit = getNextBenefit(minutesSinceQuit);
  
  if (!nextBenefit) return null;
  
  const minutesRemaining = getBenefitMinutes(nextBenefit) - minutesSinceQuit;
  
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
