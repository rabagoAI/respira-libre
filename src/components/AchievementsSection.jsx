import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingDown, ClipboardCheck, Lock } from 'lucide-react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'unlocked', label: 'Conseguidos' },
  { id: 'locked', label: 'Por conseguir' }
];

const daysLabel = (n) => `${n} ${n === 1 ? 'día' : 'días'}`;

const StreakCard = ({ icon: Icon, label, current, best, accent, delay }) => {
  const value = useAnimatedNumber(current, 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="card !p-5 flex items-center gap-4"
    >
      <span className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${accent}`}>
        <Icon className="w-6 h-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="!text-xs !text-slate-500">{label}</p>
        <p className="text-3xl font-light text-slate-900 tabular-nums leading-tight">
          {Math.round(value)}
          <span className="text-sm text-slate-400 ml-1">{current === 1 ? 'día' : 'días'}</span>
        </p>
        <p className="!text-xs !text-slate-400">Mejor racha: {daysLabel(best)}</p>
      </div>
    </motion.div>
  );
};

const AchievementTile = ({ achievement, index }) => {
  const { icon: Icon, title, description, unlocked, progress, current, target } = achievement;
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 10) * 0.03 }}
      className={`relative rounded-3xl border p-4 flex flex-col items-center text-center transition-shadow ${
        unlocked ? 'bg-white/80 border-white shadow-sm hover:shadow-lg' : 'bg-white/40 border-white/60'
      }`}
    >
      <span
        className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
          unlocked
            ? 'bg-gradient-to-br from-amber-300 via-pink-400 to-sky-400 text-white shadow-lg shadow-pink-500/20'
            : 'bg-slate-100 text-slate-400'
        }`}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
        {!unlocked && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <Lock className="w-3 h-3 text-slate-400" aria-hidden="true" />
          </span>
        )}
      </span>
      <p className={`font-semibold !text-sm mt-3 ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{title}</p>
      <p className="!text-xs !text-slate-500 mt-0.5 leading-snug">{description}</p>

      {unlocked ? (
        <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-success-600">Conseguido</span>
      ) : (
        <div className="w-full mt-3" aria-label={`Progreso: ${Math.round(progress * 100)}%`}>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-sky-400"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(progress * 100, 2)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
          <p className="!text-[11px] !text-slate-400 mt-1 tabular-nums">
            {Math.floor(current).toLocaleString('es-ES')} / {target.toLocaleString('es-ES')}
          </p>
        </div>
      )}
    </motion.li>
  );
};

/**
 * Rachas y logros del usuario
 */
const AchievementsSection = ({ streaks, achievements }) => {
  const [filter, setFilter] = useState('all');
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const visible = achievements.filter(a =>
    filter === 'all' || (filter === 'unlocked' ? a.unlocked : !a.unlocked)
  );

  return (
    <section className="mb-12" aria-labelledby="achievements-title">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h3 id="achievements-title" className="!text-2xl md:!text-3xl !font-light text-slate-800 tracking-tight">
            Rachas y logros
          </h3>
          <p className="text-slate-500 mt-1">
            <span className="font-semibold text-slate-800">{unlockedCount} de {achievements.length}</span> logros conseguidos.
          </p>
        </div>
        <div role="group" aria-label="Filtrar logros" className="inline-flex self-start rounded-full bg-white/70 border border-white p-1 shadow-sm">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${filter === id ? 'text-slate-50' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {filter === id && (
                <motion.span layoutId="achievements-filter" className="absolute inset-0 rounded-full bg-slate-800" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rachas */}
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <StreakCard icon={Flame} label="Racha sin fumar" current={streaks.smokeFree.current} best={streaks.smokeFree.best} accent="bg-orange-50 text-orange-500" delay={0} />
        <StreakCard icon={TrendingDown} label="Días fumando menos que antes" current={streaks.reduction.current} best={streaks.reduction.best} accent="bg-sky-50 text-sky-600" delay={0.05} />
        <StreakCard icon={ClipboardCheck} label="Días seguidos registrando" current={streaks.logging.current} best={streaks.logging.best} accent="bg-violet-50 text-violet-600" delay={0.1} />
      </div>

      {/* Logros */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {visible.map((achievement, index) => (
          <AchievementTile key={achievement.id} achievement={achievement} index={index} />
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="text-center text-slate-500 py-8">
          {filter === 'unlocked' ? 'Aún no has conseguido logros. ¡El primero está muy cerca!' : '¡Has conseguido todos los logros!'}
        </p>
      )}
    </section>
  );
};

export default AchievementsSection;
