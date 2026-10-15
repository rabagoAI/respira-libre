import { motion } from 'framer-motion';

/**
 * Barra de rango con degradado y marcador (estilo "biomarcador")
 * @param {number} value - Progreso 0-100
 * @param {string} startLabel - Etiqueta del extremo izquierdo
 * @param {string} endLabel - Etiqueta del extremo derecho
 * @param {boolean} muted - Atenúa la parte aún no recorrida
 * @param {number} delay - Retraso de la animación (s)
 */
const RangeBar = ({ value, startLabel, endLabel, muted = true, delay = 0 }) => {
  const percent = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      {(startLabel || endLabel) && (
        <div className="flex justify-between text-[11px] text-slate-400 mb-1 tabular-nums">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
      <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-sky-400">
        {/* Parte pendiente atenuada */}
        {muted && (
          <motion.div
            className="absolute inset-y-0 right-0 rounded-r-full bg-white/65"
            initial={{ width: '100%' }}
            whileInView={{ width: `${100 - percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay }}
          />
        )}
        {/* Marcador */}
        <motion.span
          className="absolute top-1/2 w-1 h-4 -translate-y-1/2 -ml-0.5 rounded-full bg-slate-700 ring-2 ring-white"
          initial={{ left: '0%' }}
          whileInView={{ left: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  );
};

export default RangeBar;
