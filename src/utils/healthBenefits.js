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

/**
 * Obtiene los beneficios alcanzados según los días sin fumar
 * @param {number} daysSinceQuit - Días desde que dejó de fumar
 * @returns {Array} Array de beneficios alcanzados
 */
export const getAchievedBenefits = (daysSinceQuit) => {
  const minutesSinceQuit = daysSinceQuit * 24 * 60;
  
  return healthBenefits.filter(benefit => {
    if (benefit.minutes) {
      return minutesSinceQuit >= benefit.minutes;
    }
    if (benefit.days) {
      return daysSinceQuit >= benefit.days;
    }
    return false;
  });
};

/**
 * Obtiene el siguiente beneficio a alcanzar
 * @param {number} daysSinceQuit - Días desde que dejó de fumar
 * @returns {Object|null} Siguiente beneficio o null si alcanzó todos
 */
export const getNextBenefit = (daysSinceQuit) => {
  const minutesSinceQuit = daysSinceQuit * 24 * 60;
  
  return healthBenefits.find(benefit => {
    if (benefit.minutes) {
      return minutesSinceQuit < benefit.minutes;
    }
    if (benefit.days) {
      return daysSinceQuit < benefit.days;
    }
    return false;
  });
};

/**
 * Calcula el tiempo restante para el siguiente beneficio
 * @param {number} daysSinceQuit - Días desde que dejó de fumar
 * @returns {Object|null} Tiempo restante o null
 */
export const getTimeToNextBenefit = (daysSinceQuit) => {
  const nextBenefit = getNextBenefit(daysSinceQuit);
  
  if (!nextBenefit) return null;
  
  if (nextBenefit.minutes) {
    const minutesSinceQuit = daysSinceQuit * 24 * 60;
    const minutesRemaining = nextBenefit.minutes - minutesSinceQuit;
    
    if (minutesRemaining < 60) {
      return { value: minutesRemaining, unit: 'minutos' };
    } else {
      return { value: Math.round(minutesRemaining / 60), unit: 'horas' };
    }
  }
  
  if (nextBenefit.days) {
    const daysRemaining = nextBenefit.days - daysSinceQuit;
    return { value: daysRemaining, unit: 'días' };
  }
  
  return null;
};