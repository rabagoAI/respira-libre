import { motion } from 'framer-motion';

/**
 * Cabecera "Resumen general" con la barra de progreso hacia el próximo hito
 */
const OverviewHeader = ({ nextBenefit, timeToNext, progress }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
      <div className="flex items-center gap-3 shrink-0">
        {/* Anillo animado */}
        <motion.span
          className="w-7 h-7 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#0ea5e9,#a78bfa,#22c55e,#0ea5e9)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        >
          <span className="block w-full h-full rounded-full bg-slate-50" />
        </motion.span>
        <h2 className="!text-2xl md:!text-3xl !font-light text-slate-800 tracking-tight">
          Resumen general
        </h2>
      </div>

      <div className="flex-1 min-w-0">
        {nextBenefit ? (
          <>
            <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm text-slate-500">
              <p className="truncate">
                Tu cuerpo está trabajando en: <span className="font-semibold text-slate-700">{nextBenefit.title}</span>
                {' '}— en <span className="font-semibold text-slate-700">{timeToNext.value} {timeToNext.unit}</span>
              </p>
              <span className="font-semibold text-slate-600 tabular-nums">{progress}%</span>
            </div>
            <div
              className="mt-2 h-1.5 rounded-full bg-slate-200/80 overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso hacia ${nextBenefit.title}`}
            >
              <motion.div
                className="relative h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(progress, 2)}%` }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              >
                {/* Brillo que recorre la barra */}
                <motion.span
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  animate={{ x: ['-4rem', '40rem'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                />
              </motion.div>
            </div>
          </>
        ) : (
          <p className="text-sm text-success-700 font-semibold">
            ¡Has alcanzado todos los hitos de recuperación!
          </p>
        )}
      </div>
    </div>
  );
};

export default OverviewHeader;
