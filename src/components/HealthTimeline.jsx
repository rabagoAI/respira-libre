import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Info } from 'lucide-react';
import { healthBenefits, getBenefitMinutes, formatDuration, HEALTH_SOURCES } from '../utils/healthBenefits';
import { BODY_SYSTEMS } from '../utils/recovery';
import { SYSTEM_ICONS } from '../utils/icons';
import RangeBar from './ui/RangeBar';
import StatusPill from './ui/StatusPill';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'done', label: 'Conseguidos' },
  { id: 'pending', label: 'Pendientes' }
];

const STATUS_LABELS = { done: 'Conseguido', active: 'En curso', pending: 'Pendiente' };

const SYSTEM_NAMES = Object.fromEntries(BODY_SYSTEMS.map(s => [s.id, s.name]));

/**
 * Tabla de hitos de salud con su progreso y estado
 */
const HealthTimeline = ({ minutesSinceQuit }) => {
  const [filter, setFilter] = useState('all');

  const nextIndex = healthBenefits.findIndex(b => minutesSinceQuit < getBenefitMinutes(b));
  const rows = healthBenefits.map((benefit, index) => {
    const target = getBenefitMinutes(benefit);
    const status = minutesSinceQuit >= target ? 'done' : index === nextIndex ? 'active' : 'pending';
    return {
      benefit,
      status,
      target,
      progress: Math.min((minutesSinceQuit / target) * 100, 100)
    };
  });
  const achievedCount = rows.filter(r => r.status === 'done').length;
  const visibleRows = rows.filter(r =>
    filter === 'all' || (filter === 'done' ? r.status === 'done' : r.status !== 'done')
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="mb-12"
      aria-labelledby="benefits-title"
    >
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h3 id="benefits-title" className="!text-2xl md:!text-3xl !font-light text-slate-800 tracking-tight">
            Beneficios para tu salud
          </h3>
          <p className="text-slate-500 mt-1">
            <span className="font-semibold text-slate-800">{achievedCount} de {healthBenefits.length}</span> hitos conseguidos.
            Tu cuerpo se recupera día a día.
          </p>
        </div>
        <div role="group" aria-label="Filtrar hitos" className="inline-flex self-start rounded-full bg-white/70 border border-white p-1 shadow-sm">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${filter === id ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {filter === id && (
                <motion.span layoutId="benefits-filter" className="absolute inset-0 rounded-full bg-slate-800" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="card !p-0 overflow-hidden">
        <div className="hidden md:grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_8.5rem] gap-6 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/70">
          <span>Hito</span>
          <span>Progreso</span>
          <span>Estado</span>
        </div>

        <ul>
          {visibleRows.map(({ benefit, status, target, progress }, index) => {
            const Icon = SYSTEM_ICONS[benefit.system];
            const remaining = target - minutesSinceQuit;
            return (
              <li
                key={target}
                className={`grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_8.5rem] gap-3 md:gap-6 md:items-center px-4 md:px-6 py-4 border-b border-slate-200/60 last:border-0 transition-colors ${
                  status === 'active' ? 'bg-sky-50/60' : 'hover:bg-white/50'
                }`}
              >
                {/* Hito */}
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                      status === 'done' ? 'bg-white border-white text-slate-700 shadow-sm' : 'bg-white/50 border-white/70 text-slate-400'
                    }`}
                    title={SYSTEM_NAMES[benefit.system]}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className={`font-semibold ${status === 'pending' ? 'text-slate-500' : 'text-slate-800'}`}>
                      {benefit.title}
                    </p>
                    <p className="!text-sm !text-slate-500 leading-snug mt-0.5">{benefit.description}</p>
                    <a
                      href={HEALTH_SOURCES[benefit.source].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-xs text-slate-400 hover:text-primary-700 underline-offset-2 hover:underline"
                    >
                      Fuente: {HEALTH_SOURCES[benefit.source].name}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </div>
                </div>

                {/* Progreso */}
                <div className="flex items-center gap-4 pl-[3.25rem] md:pl-0">
                  <div className="flex-1 min-w-0">
                    <RangeBar value={progress} startLabel="Inicio" endLabel={formatDuration(target)} delay={Math.min(index, 8) * 0.04} />
                  </div>
                  <p className="md:w-32 shrink-0 text-right text-sm tabular-nums whitespace-nowrap">
                    {status === 'done' ? (
                      <span className="font-semibold text-slate-800">{formatDuration(target)}</span>
                    ) : (
                      <>
                        <span className="text-slate-400">faltan </span>
                        <span className="font-semibold text-slate-800">{formatDuration(remaining)}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Estado */}
                <div className="pl-[3.25rem] md:pl-0">
                  <StatusPill variant={status}>{STATUS_LABELS[status]}</StatusPill>
                </div>
              </li>
            );
          })}
        </ul>

        {visibleRows.length === 0 && (
          <p className="text-center text-slate-500 py-10">
            {filter === 'done' ? 'Tu primer hito llega a los 20 minutos. ¡Ya casi está!' : '¡Has conseguido todos los hitos!'}
          </p>
        )}

        {/* Aviso médico */}
        <div className="flex gap-3 px-4 md:px-6 py-4 bg-slate-50/70 border-t border-slate-200/70">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="!text-xs !text-slate-500 leading-relaxed">
            Los plazos son orientativos y proceden de fuentes sanitarias oficiales; cada persona se recupera a su ritmo.
            Esta información no sustituye el consejo de un profesional sanitario. Si tienes dudas sobre tu salud
            o sobre cómo dejar de fumar, consulta con tu médico o farmacéutico.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HealthTimeline;
