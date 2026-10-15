import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatCurrency } from '../utils/calculations';

const SEGMENTS = 10;

/**
 * Tarjetas superiores: tiempo sin fumar, dinero ahorrado y mensaje de progreso
 */
const SummaryCards = ({ stats, reductionPercent, achievedCount, totalBenefits, onShowReport }) => {
  const days = useAnimatedNumber(stats.timeSinceQuit.days);
  const money = useAnimatedNumber(stats.moneySaved);
  const filledSegments = Math.round((reductionPercent / 100) * SEGMENTS);

  return (
    <div className="grid sm:grid-cols-5 gap-4">
      {/* Tiempo y dinero */}
      <div className="sm:col-span-3 rounded-3xl bg-white/80 border border-white shadow-sm p-4 flex items-center gap-4">
        {/* Indicador de reducción por segmentos */}
        <div className="shrink-0 rounded-2xl bg-slate-50 border border-slate-100 p-2.5" aria-label={`Consumo reducido un ${reductionPercent}%`} role="img">
          <div className="flex flex-col-reverse gap-[3px]">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <motion.span
                key={i}
                className={`block w-9 h-1.5 rounded-sm ${i < filledSegments ? 'bg-primary-500' : 'bg-slate-200'}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                style={{ originX: 0 }}
              />
            ))}
          </div>
          <p className="text-[10px] text-center text-slate-500 mt-1.5 font-semibold">−{reductionPercent}%</p>
        </div>

        <div className="flex-1 grid grid-cols-2 divide-x divide-slate-200">
          <div className="pr-3">
            <p className="text-xs text-slate-500">Días sin fumar</p>
            <p className="text-4xl font-light text-slate-900 tabular-nums mt-1">
              {Math.round(days)}
              <span className="text-xs text-slate-400 ml-1">días</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {stats.timeSinceQuit.hours} h {stats.timeSinceQuit.minutes} min
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs text-slate-500">Dinero ahorrado</p>
            <p className="text-3xl sm:text-[2rem] font-light text-success-600 tabular-nums mt-1 leading-tight">
              {formatCurrency(money)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatCurrency(stats.dailySavings)}/día
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div className="sm:col-span-2 rounded-3xl bg-white/60 border border-white shadow-sm p-4 flex flex-col justify-between gap-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Has evitado <span className="font-semibold text-slate-900">{stats.cigarettesAvoided.toLocaleString('es-ES')} cigarrillos</span> y
          tu cuerpo ya ha alcanzado <span className="font-semibold text-slate-900">{achievedCount} de {totalBenefits}</span> hitos.
        </p>
        <button
          type="button"
          onClick={onShowReport}
          className="self-start inline-flex items-center gap-1 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium pl-4 pr-3 py-1.5 shadow-md shadow-primary-600/30 transition-colors"
        >
          Ver tu evolución
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default SummaryCards;
