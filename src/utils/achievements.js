import {
  Flag,
  Sunrise,
  Flame,
  CalendarCheck,
  CalendarHeart,
  Mountain,
  Crown,
  Coins,
  PiggyBank,
  Wallet,
  Gem,
  Ban,
  ShieldCheck,
  ClipboardCheck,
  Wind,
  Sparkles
} from 'lucide-react';

/**
 * Logros desbloqueables. `metric` indica qué dato del contexto se compara con `target`
 * (ver buildAchievementContext); `category` agrupa los logros en la interfaz.
 */
export const ACHIEVEMENTS = [
  { id: 'start', category: 'Rachas', icon: Flag, title: 'Primer paso', description: 'Has empezado tu camino', metric: 'started', target: 1 },
  { id: 'smoke-free-1', category: 'Rachas', icon: Sunrise, title: 'Primer día sin humo', description: 'Un día completo sin fumar', metric: 'bestSmokeFree', target: 1 },
  { id: 'smoke-free-3', category: 'Rachas', icon: Flame, title: 'Tres días seguidos', description: '3 días seguidos sin fumar', metric: 'bestSmokeFree', target: 3 },
  { id: 'smoke-free-7', category: 'Rachas', icon: CalendarCheck, title: 'Una semana', description: '7 días seguidos sin fumar', metric: 'bestSmokeFree', target: 7 },
  { id: 'smoke-free-30', category: 'Rachas', icon: CalendarHeart, title: 'Un mes', description: '30 días seguidos sin fumar', metric: 'bestSmokeFree', target: 30 },
  { id: 'smoke-free-90', category: 'Rachas', icon: Mountain, title: 'Tres meses', description: '90 días seguidos sin fumar', metric: 'bestSmokeFree', target: 90 },
  { id: 'smoke-free-365', category: 'Rachas', icon: Crown, title: 'Un año', description: '365 días seguidos sin fumar', metric: 'bestSmokeFree', target: 365 },
  { id: 'save-10', category: 'Ahorro', icon: Coins, title: 'Primeros 10 €', description: 'Has ahorrado 10 €', metric: 'moneySaved', target: 10 },
  { id: 'save-100', category: 'Ahorro', icon: PiggyBank, title: '100 € ahorrados', description: 'Has ahorrado 100 €', metric: 'moneySaved', target: 100 },
  { id: 'save-500', category: 'Ahorro', icon: Wallet, title: '500 € ahorrados', description: 'Has ahorrado 500 €', metric: 'moneySaved', target: 500 },
  { id: 'save-1000', category: 'Ahorro', icon: Gem, title: '1.000 € ahorrados', description: 'Has ahorrado 1.000 €', metric: 'moneySaved', target: 1000 },
  { id: 'avoided-100', category: 'Salud', icon: Ban, title: '100 cigarrillos menos', description: 'Has evitado 100 cigarrillos', metric: 'cigarettesAvoided', target: 100 },
  { id: 'avoided-1000', category: 'Salud', icon: ShieldCheck, title: '1.000 cigarrillos menos', description: 'Has evitado 1.000 cigarrillos', metric: 'cigarettesAvoided', target: 1000 },
  { id: 'logging-7', category: 'Constancia', icon: ClipboardCheck, title: 'Constancia', description: 'Registra tu consumo 7 días seguidos', metric: 'bestLogging', target: 7 },
  { id: 'breathing-1', category: 'Constancia', icon: Wind, title: 'Respira hondo', description: 'Completa un ejercicio de respiración', metric: 'breathingSessions', target: 1 },
  { id: 'breathing-10', category: 'Constancia', icon: Sparkles, title: 'Dueño de tus ganas', description: 'Completa 10 ejercicios de respiración', metric: 'breathingSessions', target: 10 }
];

/**
 * Datos que usan los logros
 * @param {Object} params
 * @param {Object} params.streaks - Resultado de getStreaks
 * @param {number} params.moneySaved - Dinero ahorrado
 * @param {number} params.cigarettesAvoided - Cigarrillos evitados
 * @param {number} params.breathingSessions - Ejercicios de respiración completados
 */
export const buildAchievementContext = ({ streaks, moneySaved, cigarettesAvoided, breathingSessions = 0 }) => ({
  started: 1,
  bestSmokeFree: streaks.smokeFree.best,
  bestLogging: streaks.logging.best,
  moneySaved,
  cigarettesAvoided,
  breathingSessions
});

/**
 * Estado de cada logro: desbloqueado o no, y progreso (0-1) hacia él
 * @param {Object} context - Resultado de buildAchievementContext
 * @returns {Array} Logros con { unlocked, progress, current }
 */
export const getAchievements = (context) =>
  ACHIEVEMENTS.map(achievement => {
    const current = Math.max(context[achievement.metric] ?? 0, 0);
    return {
      ...achievement,
      current,
      unlocked: current >= achievement.target,
      progress: Math.min(current / achievement.target, 1)
    };
  });

/**
 * Logros desbloqueados que el usuario aún no ha visto
 * @param {Array} achievements - Resultado de getAchievements
 * @param {string[]} seenIds - Ids ya mostrados
 * @returns {Array} Logros nuevos
 */
export const getNewAchievements = (achievements, seenIds = []) =>
  achievements.filter(a => a.unlocked && !seenIds.includes(a.id));
