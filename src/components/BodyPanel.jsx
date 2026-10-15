import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Plus, Minus, Maximize2, Sparkles, X, ArrowRight } from 'lucide-react';
import BodyFigure from './BodyFigure';

const ZOOM_LEVELS = [1, 1.35, 1.7];

/**
 * Columna izquierda del panel: figura del cuerpo con zoom y tarjeta de logros
 */
const BodyPanel = ({ systems, selected, onSelect, achievedCount, totalBenefits, onShowBenefits }) => {
  const [zoomIndex, setZoomIndex] = useState(0);
  const [showInsight, setShowInsight] = useState(true);
  const zoom = ZOOM_LEVELS[zoomIndex];
  // Desplazamiento al arrastrar la figura con zoom
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const changeZoom = (index) => {
    setZoomIndex(index);
    // Sin zoom, la figura vuelve al centro
    if (index === 0) {
      animate(x, 0, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, 0, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  return (
    <div className="relative h-full min-h-[640px] sm:min-h-[580px] rounded-[28px] bg-gradient-to-b from-white/70 via-slate-100/60 to-slate-200/70 border border-white/70 overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-16 -left-10 w-64 h-64 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-10 right-0 w-56 h-56 rounded-full bg-success-200/30 blur-3xl" />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ borderStyle: 'dashed' }}
        />
      </div>

      <div className="relative px-6 pt-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700/80">Tu cuerpo hoy</p>
          <p className="text-sm text-slate-500 mt-0.5">Pulsa un órgano para ver su estado</p>
        </div>
        {/* Leyenda de colores */}
        <div className="text-right" aria-hidden="true">
          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-[hsl(8,92%,55%)] via-[hsl(83,92%,55%)] to-[hsl(158,92%,55%)]" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 w-28">
            <span>Inicio</span><span>Recuperado</span>
          </div>
        </div>
      </div>

      {/* Figura con zoom; con zoom se puede arrastrar */}
      <div className="absolute inset-x-0 top-14 bottom-28 sm:bottom-2 flex items-center justify-center overflow-hidden">
        <motion.div
          className="h-full max-h-[680px] aspect-[200/470]"
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          drag={zoom > 1}
          dragConstraints={{ left: -120, right: 120, top: -160, bottom: 160 }}
          dragElastic={0.15}
          style={{ x, y, cursor: zoom > 1 ? 'grab' : 'default', transformOrigin: 'center 35%' }}
        >
          <BodyFigure systems={systems} selected={selected} onSelect={onSelect} />
        </motion.div>
      </div>

      {/* Controles de zoom */}
      <div className="absolute right-4 bottom-6 flex flex-col gap-2">
        {[
          { label: 'Acercar', icon: Plus, onClick: () => changeZoom(Math.min(zoomIndex + 1, ZOOM_LEVELS.length - 1)), disabled: zoomIndex === ZOOM_LEVELS.length - 1 },
          { label: 'Alejar', icon: Minus, onClick: () => changeZoom(Math.max(zoomIndex - 1, 0)), disabled: zoomIndex === 0 },
          { label: 'Restablecer vista', icon: Maximize2, onClick: () => changeZoom(0), disabled: zoomIndex === 0 }
        ].map(({ label, icon: Icon, onClick, disabled }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-white shadow-md flex items-center justify-center text-slate-600 hover:text-primary-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Tarjeta de logros */}
      <AnimatePresence>
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="theme-fixed absolute left-3 sm:left-4 bottom-3 sm:bottom-4 w-[calc(100%-4.5rem)] sm:w-60 rounded-2xl bg-slate-800/75 backdrop-blur-xl text-white p-3 sm:p-4 shadow-xl border border-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <Sparkles className="w-4 h-4 text-success-300 self-center" aria-hidden="true" />
                <span className="text-3xl font-light">{achievedCount}</span>
                <span className="text-sm text-slate-200">de {totalBenefits} hitos</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInsight(false)}
                aria-label="Ocultar tarjeta de hitos"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="hidden sm:block text-xs text-slate-300 mt-2 leading-relaxed">
              Tu cuerpo ya ha alcanzado estos beneficios. Descubre cuál es el siguiente.
            </p>
            <button
              type="button"
              onClick={onShowBenefits}
              className="mt-3 w-full flex items-center justify-between rounded-xl bg-primary-300 hover:bg-primary-200 text-slate-900 text-sm font-semibold px-3 py-2 transition-colors"
            >
              Ver beneficios
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyPanel;
