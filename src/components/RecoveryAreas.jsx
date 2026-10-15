import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Minus, TrendingDown, Info } from 'lucide-react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { getHeatColor } from '../utils/recovery';

const STATUS_STYLES = {
  starting: { icon: TrendingDown, className: 'text-orange-600' },
  recovering: { icon: Minus, className: 'text-primary-600' },
  advanced: { icon: TrendingUp, className: 'text-success-600' }
};

const RecoveryCard = ({ system, isSelected, onSelect, index }) => {
  const score = useAnimatedNumber(system.score, 1.4);
  const { icon: StatusIcon, className: statusClass } = STATUS_STYLES[system.status];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(system.id)}
      aria-pressed={isSelected}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08 }}
      className={`text-left rounded-2xl p-4 border transition-all ${
        isSelected
          ? 'bg-white border-primary-300 shadow-lg shadow-primary-500/10 ring-2 ring-primary-200'
          : 'bg-white/70 border-white hover:bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{system.name}</p>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} aria-hidden="true" />
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <p className="text-3xl font-light text-slate-900 tabular-nums">
          {Math.round(score)}<span className="text-sm text-slate-400">/100</span>
        </p>
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{system.achieved}/{system.total}</span> hitos
        </p>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-slate-50 border border-slate-100 px-2 py-1 ${statusClass}`}>
          <StatusIcon className="w-3 h-3" aria-hidden="true" />
          {system.label}
        </span>
        {/* Barra con degradado y marcador */}
        <div className="relative flex-1 h-5 rounded-md bg-slate-100 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-md"
            style={{ background: `linear-gradient(90deg, ${getHeatColor(0, 80)}, ${getHeatColor(system.score, 60)})` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(system.score, 3)}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 16, delay: 0.3 + index * 0.08 }}
          >
            <span className="absolute right-0 top-0.5 bottom-0.5 w-[3px] rounded-full bg-slate-700" />
          </motion.div>
        </div>
      </div>

      {isSelected && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-slate-600 mt-3 leading-relaxed"
        >
          {system.nextBenefit
            ? <>Próximo hito: <span className="font-semibold">{system.nextBenefit.title}</span>. {system.nextBenefit.description}.</>
            : '¡Has alcanzado todos los hitos de este sistema!'}
        </motion.p>
      )}
    </motion.button>
  );
};

/**
 * Tarjetas de recuperación por sistema corporal (sincronizadas con la figura)
 */
const RecoveryAreas = ({ systems, selected, onSelect }) => {
  return (
    <section className="rounded-3xl bg-white/50 border border-white p-4 sm:p-5" aria-labelledby="recovery-title">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 id="recovery-title" className="!text-lg !font-normal text-slate-800">Áreas de recuperación</h3>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500" title="Estimación basada en el tiempo sin fumar y en cuánto has reducido el consumo. No es un diagnóstico médico.">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          Estimación orientativa
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {systems.map((system, index) => (
          <RecoveryCard
            key={system.id}
            system={system}
            index={index}
            isSelected={selected === system.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default RecoveryAreas;
