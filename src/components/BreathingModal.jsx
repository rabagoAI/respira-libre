import { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RotateCcw, ExternalLink } from 'lucide-react';
import { useDialog } from '../hooks/useDialog';

// Pauta de smokefree.gov: respiraciones lentas y profundas, tomando el aire por la
// nariz y soltándolo por la boca, unas 10 veces o hasta sentirse más relajado
const TOTAL_BREATHS = 10;
const PHASES = {
  inhale: { seconds: 4, label: 'Toma aire por la nariz', scale: 1 },
  exhale: { seconds: 6, label: 'Suelta el aire por la boca', scale: 0.55 }
};
const BREATH_SECONDS = PHASES.inhale.seconds + PHASES.exhale.seconds;
const SOURCE_URL = 'https://smokefree.gov/challenges-when-quitting/cravings-triggers/how-manage-cravings';

const INITIAL = { status: 'ready', breath: 1, phase: 'inhale', secondsLeft: PHASES.inhale.seconds };

// Avanza un segundo el ejercicio
const tick = (state) => {
  if (state.secondsLeft > 1) return { ...state, secondsLeft: state.secondsLeft - 1 };
  if (state.phase === 'inhale') return { ...state, phase: 'exhale', secondsLeft: PHASES.exhale.seconds };
  if (state.breath >= TOTAL_BREATHS) return { ...state, status: 'done' };
  return { ...state, breath: state.breath + 1, phase: 'inhale', secondsLeft: PHASES.inhale.seconds };
};

const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Ejercicio de respiración guiada para los momentos de ganas de fumar
 * @param {Function} onClose - Cierra el modal
 * @param {Function} onComplete - Se llama al terminar las 10 respiraciones
 */
const BreathingModal = ({ onClose, onComplete }) => {
  const [state, setState] = useState(INITIAL);
  const titleId = useId();
  const dialogRef = useDialog(onClose);

  // Reloj del ejercicio
  useEffect(() => {
    if (state.status !== 'running') return;
    const interval = setInterval(() => setState(tick), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  // Avisar al terminar (una sola vez por ejercicio)
  useEffect(() => {
    if (state.status === 'done') onComplete();
  }, [state.status, onComplete]);

  const phase = PHASES[state.phase];
  const elapsed = (state.breath - 1) * BREATH_SECONDS +
    (state.phase === 'exhale' ? PHASES.inhale.seconds : 0) +
    (phase.seconds - state.secondsLeft);
  const progress = state.status === 'done' ? 1 : state.status === 'ready' ? 0 : elapsed / (TOTAL_BREATHS * BREATH_SECONDS);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1d42]/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[36px] bg-gradient-to-b from-white to-slate-100 shadow-2xl p-6 sm:p-8 text-center overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 w-9 h-9 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-500"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 id={titleId} className="!text-2xl !font-light text-slate-800 tracking-tight">
          {state.status === 'done' ? '¡Bien hecho!' : 'Respira conmigo'}
        </h2>
        <p className="!text-sm !text-slate-500 mt-1">
          {state.status === 'done'
            ? 'Has completado 10 respiraciones profundas.'
            : 'Las ganas de fumar suelen durar solo unos minutos. Vamos a dejarlas pasar.'}
        </p>

        {/* Esfera que crece al tomar aire y se encoge al soltarlo */}
        <div className="relative mx-auto my-8 w-60 h-60">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <circle
              cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="url(#breathing-ring)" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <defs>
              <linearGradient id="breathing-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-4 flex items-center justify-center">
            <motion.div
              className="w-full h-full rounded-full bg-gradient-to-br from-sky-300 via-primary-400 to-success-300 shadow-2xl shadow-primary-500/30"
              animate={{ scale: state.status === 'running' ? phase.scale : state.status === 'done' ? 0.8 : 0.6 }}
              transition={{ duration: state.status === 'running' ? phase.seconds : 0.6, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white" aria-live="polite">
              {state.status === 'running' && (
                <>
                  <span className="text-5xl font-light tabular-nums drop-shadow">{state.secondsLeft}</span>
                  <span className="text-sm font-semibold drop-shadow mt-1 px-6">{phase.label}</span>
                </>
              )}
              {state.status === 'ready' && <span className="text-sm font-semibold drop-shadow">10 respiraciones · 1 min 40 s</span>}
              {state.status === 'done' && <span className="text-sm font-semibold drop-shadow px-8">¿Cómo te sientes ahora?</span>}
            </div>
          </div>
        </div>

        {state.status === 'running' && (
          <p className="!text-sm !text-slate-500 tabular-nums">Respiración {state.breath} de {TOTAL_BREATHS}</p>
        )}

        {state.status === 'ready' && (
          <button
            type="button"
            onClick={() => setState({ ...INITIAL, status: 'running' })}
            className="inline-flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 shadow-lg transition-colors"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            Empezar
          </button>
        )}

        {state.status === 'done' && (
          <div className="space-y-4">
            <p className="!text-sm !text-slate-600 leading-relaxed">
              Si las ganas siguen ahí, bebe un vaso de agua, sal a caminar unos minutos o cambia de actividad.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setState({ ...INITIAL, status: 'running' })}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Otra vez
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-primary-700"
        >
          Basado en las pautas de smokefree.gov
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default BreathingModal;
