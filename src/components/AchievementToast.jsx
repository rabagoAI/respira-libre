import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PARTICLES = 14;
const COLORS = ['#fcd34d', '#f472b6', '#38bdf8', '#4ade80'];

/**
 * Aviso animado de logro desbloqueado
 * @param {Array} achievements - Logros nuevos (se muestra el primero)
 * @param {Function} onDismiss - Marca como vistos los logros mostrados
 */
const AchievementToast = ({ achievements, onDismiss }) => {
  const achievement = achievements[0];
  const others = achievements.length - 1;

  // Se cierra solo a los 7 segundos
  useEffect(() => {
    if (!achievement) return;
    const timeout = setTimeout(onDismiss, 7000);
    return () => clearTimeout(timeout);
  }, [achievement, onDismiss]);

  return (
    <div className="fixed inset-x-0 bottom-24 sm:bottom-8 z-50 flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {achievement && (
          <motion.div
            key={achievement.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="theme-fixed pointer-events-auto relative flex items-center gap-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl text-white pl-4 pr-3 py-3 shadow-2xl border border-white/10 max-w-sm w-full"
          >
            {/* Icono con estallido de partículas */}
            <span className="relative shrink-0 w-14 h-14">
              {Array.from({ length: PARTICLES }, (_, i) => {
                const angle = (i / PARTICLES) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(angle) * 38, y: Math.sin(angle) * 38, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
                    aria-hidden="true"
                  />
                );
              })}
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-pink-400 to-sky-400 flex items-center justify-center shadow-lg"
                initial={{ rotate: -30, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              >
                <achievement.icon className="w-7 h-7 text-white" aria-hidden="true" />
              </motion.span>
            </span>

            <div className="min-w-0 flex-1">
              <p className="!text-[11px] uppercase tracking-wider font-semibold !text-amber-300">¡Logro desbloqueado!</p>
              <p className="font-semibold !text-white truncate">{achievement.title}</p>
              <p className="!text-xs !text-slate-300 truncate">
                {achievement.description}{others > 0 ? ` · y ${others} más` : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar aviso de logro"
              className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementToast;
