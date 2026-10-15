import { healthBenefits, getBenefitMinutes } from './healthBenefits';

/**
 * Sistemas corporales que se muestran en el panel y en la figura del cuerpo
 */
export const BODY_SYSTEMS = [
  { id: 'respiratory', name: 'Sistema respiratorio', organ: 'Pulmones' },
  { id: 'cardio', name: 'Sistema cardiovascular', organ: 'Corazón' },
  { id: 'circulation', name: 'Circulación', organ: 'Vasos sanguíneos' },
  { id: 'wellbeing', name: 'Sentidos y bienestar', organ: 'Cerebro y sentidos' }
];

// Umbrales de la puntuación (0-100) para cada estado
const STATUS_THRESHOLDS = [
  { min: 67, status: 'advanced', label: 'Avanzado' },
  { min: 34, status: 'recovering', label: 'Recuperándose' },
  { min: 0, status: 'starting', label: 'Inicio' }
];

/**
 * Factor de reducción del consumo: 1 si ya no fuma, 0 si fuma igual que antes
 * @param {number} cigarettesBefore - Consumo diario antes de empezar
 * @param {number} cigarettesNow - Consumo diario actual (p. ej. media de 7 días)
 * @returns {number} Valor entre 0 y 1
 */
export const getReductionFactor = (cigarettesBefore, cigarettesNow) => {
  if (!(cigarettesBefore > 0)) return 0;
  return Math.min(Math.max((cigarettesBefore - cigarettesNow) / cigarettesBefore, 0), 1);
};

/**
 * Progreso (0-1) a través de una lista ordenada de hitos en minutos.
 * Cada hito pesa lo mismo y el avance entre dos hitos se mide en escala
 * logarítmica, porque los hitos van de minutos a años.
 * @param {number} minutes - Minutos desde que empezó
 * @param {number[]} milestones - Minutos de cada hito, ordenados
 * @returns {number} Progreso entre 0 y 1
 */
export const getMilestoneProgress = (minutes, milestones) => {
  if (milestones.length === 0) return 0;
  if (minutes <= 0) return 0;

  let previous = 1;
  for (let i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];
    if (minutes < milestone) {
      const fraction = Math.log(Math.max(minutes, 1) / previous) / Math.log(milestone / previous);
      return (i + Math.min(Math.max(fraction, 0), 1)) / milestones.length;
    }
    previous = milestone;
  }
  return 1;
};

/**
 * Estado (inicio, recuperándose, avanzado) de una puntuación
 * @param {number} score - Puntuación 0-100
 * @returns {Object} { status, label }
 */
export const getRecoveryStatus = (score) => {
  const { status, label } = STATUS_THRESHOLDS.find(t => score >= t.min);
  return { status, label };
};

/**
 * Puntuación de recuperación orientativa de cada sistema corporal
 * @param {number} minutesSinceQuit - Minutos desde la fecha de inicio
 * @param {number} reductionFactor - Ver getReductionFactor
 * @returns {Array} Sistemas con score, estado, hitos y próximo hito
 */
export const getRecoverySystems = (minutesSinceQuit, reductionFactor = 1) => {
  return BODY_SYSTEMS.map(system => {
    const benefits = healthBenefits.filter(b => b.system === system.id);
    const milestones = benefits.map(getBenefitMinutes);
    const progress = getMilestoneProgress(minutesSinceQuit, milestones);
    const score = Math.round(progress * reductionFactor * 100);
    const achieved = benefits.filter(b => minutesSinceQuit >= getBenefitMinutes(b)).length;

    return {
      ...system,
      score,
      ...getRecoveryStatus(score),
      achieved,
      total: benefits.length,
      nextBenefit: benefits.find(b => minutesSinceQuit < getBenefitMinutes(b)) ?? null
    };
  });
};

/**
 * Progreso (0-100) hacia el siguiente hito de salud
 * @param {number} minutesSinceQuit - Minutos desde la fecha de inicio
 * @returns {number|null} Porcentaje, o null si ya se alcanzaron todos
 */
export const getNextBenefitProgress = (minutesSinceQuit) => {
  const index = healthBenefits.findIndex(b => minutesSinceQuit < getBenefitMinutes(b));
  if (index === -1) return null;

  const start = index === 0 ? 0 : getBenefitMinutes(healthBenefits[index - 1]);
  const end = getBenefitMinutes(healthBenefits[index]);
  return Math.round(((minutesSinceQuit - start) / (end - start)) * 100);
};

/**
 * Color de un sistema según su puntuación: rojo/naranja (sin recuperar)
 * → verde azulado (recuperado)
 * @param {number} score - Puntuación 0-100
 * @param {number} lightness - Luminosidad HSL
 */
export const getHeatColor = (score, lightness = 55) => {
  const hue = 8 + (score / 100) * 150;
  return `hsl(${hue}, 92%, ${lightness}%)`;
};
