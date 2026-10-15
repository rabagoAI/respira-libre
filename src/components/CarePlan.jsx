import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Lightbulb, Flag, Timer, Droplets, Repeat } from 'lucide-react';
import DailyTracker from './DailyTracker';
import { healthBenefits, getBenefitMinutes, formatTimeRemaining } from '../utils/healthBenefits';

const TIPS = [
  {
    icon: Timer,
    title: 'Retrasa el antojo 10 minutos',
    description: 'Las ganas intensas de fumar suelen pasar en pocos minutos. Cambia de actividad o sal a caminar mientras tanto.',
    tag: 'Ansiedad'
  },
  {
    icon: Droplets,
    title: 'Ten agua y algo sano a mano',
    description: 'Beber agua o picar fruta mantiene ocupadas las manos y la boca en los momentos en que antes fumabas.',
    tag: 'Hábitos'
  },
  {
    icon: Repeat,
    title: 'Cambia tus rutinas asociadas',
    description: 'Identifica cuándo fumabas (café, sobremesa, descansos) y prepara una alternativa para esos momentos.',
    tag: 'Rutina'
  }
];

const TABS = [
  { id: 'today', label: 'Registro de hoy', icon: ClipboardList },
  { id: 'tips', label: 'Consejos', icon: Lightbulb },
  { id: 'milestones', label: 'Próximos hitos', icon: Flag }
];

const UpcomingMilestones = ({ minutesSinceQuit }) => {
  const upcoming = healthBenefits.filter(b => minutesSinceQuit < getBenefitMinutes(b)).slice(0, 3);

  if (upcoming.length === 0) {
    return <p className="text-sm text-slate-600 py-6 text-center">Has alcanzado todos los hitos. ¡Enhorabuena! 🎉</p>;
  }

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {upcoming.map(benefit => {
        const remaining = formatTimeRemaining(getBenefitMinutes(benefit) - minutesSinceQuit);
        return (
          <div key={benefit.title} className="rounded-2xl bg-white/80 border border-white p-4 shadow-sm">
            <div className="text-2xl" aria-hidden="true">{benefit.icon}</div>
            <p className="font-semibold text-slate-800 mt-2 text-sm">{benefit.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{benefit.description}</p>
            <span className="inline-block mt-3 text-xs font-semibold rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-700">
              en {remaining.value} {remaining.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Plan personalizado con pestañas: registro diario, consejos y próximos hitos
 */
const CarePlan = ({ userData, onUpdateData, minutesSinceQuit }) => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <section className="rounded-3xl bg-white/50 border border-white p-4 sm:p-5" aria-labelledby="care-plan-title">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h3 id="care-plan-title" className="!text-lg !font-normal text-slate-800">Tu plan personalizado</h3>
        <div role="tablist" aria-label="Secciones del plan" className="flex gap-1 rounded-full bg-slate-100/80 p-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                activeTab === id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {activeTab === id && (
                <motion.span
                  layoutId="care-plan-tab"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative w-4 h-4" aria-hidden="true" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'today' && (
            <div className="rounded-2xl bg-white/80 border border-white p-4 shadow-sm">
              <DailyTracker userData={userData} onUpdateDaily={onUpdateData} embedded />
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="grid sm:grid-cols-3 gap-3">
              {TIPS.map(({ icon: Icon, title, description, tag }) => (
                <div key={title} className="rounded-2xl bg-white/80 border border-white p-4 shadow-sm">
                  <Icon className="w-5 h-5 text-slate-500" aria-hidden="true" />
                  <p className="font-semibold text-slate-800 mt-3 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
                  <span className="inline-block mt-3 text-xs font-semibold rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-700">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'milestones' && <UpcomingMilestones minutesSinceQuit={minutesSinceQuit} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default CarePlan;
