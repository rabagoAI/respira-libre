import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, PiggyBank, Target, Sparkles, ArrowDown, ShieldCheck, Download } from 'lucide-react';
import BodyFigure from './BodyFigure';
import { getRecoverySystems } from '../utils/recovery';
import { scrollToSection } from '../utils/scroll';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const DAY = 24 * 60;

// Etapas de la demo: la figura pasa de recién empezado a recuperado
const DEMO_STAGES = [
  { minutes: 30, label: '30 minutos' },
  { minutes: DAY, label: '1 día' },
  { minutes: 7 * DAY, label: '1 semana' },
  { minutes: 30 * DAY, label: '1 mes' },
  { minutes: 365 * DAY, label: '1 año' },
  { minutes: 3650 * DAY, label: '10 años' }
];

const FEATURES = [
  { icon: HeartPulse, title: 'Mejora tu salud', text: 'Sigue la recuperación de cada sistema de tu cuerpo' },
  { icon: PiggyBank, title: 'Ahorra dinero', text: 'Mira cuánto ahorras cada día, semana y mes' },
  { icon: Target, title: 'Alcanza objetivos', text: 'Convierte tu ahorro en metas que te motiven' }
];

/**
 * Portada para quien todavía no ha empezado
 */
const Hero = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const { canInstall, install } = useInstallPrompt();
  const stage = DEMO_STAGES[stageIndex];
  const systems = getRecoverySystems(stage.minutes);
  const lungs = systems.find(s => s.id === 'respiratory');

  useEffect(() => {
    const interval = setInterval(() => setStageIndex(i => (i + 1) % DEMO_STAGES.length), 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0b1d42] text-white rounded-b-[40px] sm:rounded-b-[64px] shadow-2xl shadow-[#0b1d42]/30">
      {/* Fondo: degradado profundo con anillos tipo hélice */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d42] via-[#123172] to-[#0a1a3a]" />
        <div className="absolute -top-40 right-0 w-[42rem] h-[42rem] rounded-full bg-primary-500/25 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[34rem] h-[34rem] rounded-full bg-indigo-500/20 blur-3xl" />
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-sky-300/15"
            style={{
              width: `${44 + i * 14}rem`,
              height: `${44 + i * 14}rem`,
              right: `${-14 - i * 7}rem`,
              top: `${-8 - i * 7}rem`,
              borderWidth: i === 0 ? 28 : 1
            }}
            animate={{ rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 80 + i * 20, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pb-24">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="w-9 h-9" />
          <span className="font-semibold text-lg">Respira <span className="text-success-300">Libre</span></span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-6 items-center mt-12 lg:mt-6">
          {/* Texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 px-4 py-1.5 rounded-full text-sm"
            >
              <Sparkles className="w-4 h-4 text-success-300" aria-hidden="true" />
              Tu camino hacia una vida sin humo
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="!text-5xl md:!text-6xl lg:!text-7xl !font-light tracking-tight mt-6 leading-[1.05]"
            >
              Respira <span className="font-semibold bg-gradient-to-r from-sky-300 to-success-300 bg-clip-text text-transparent">Libre</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="!text-lg md:!text-xl !text-sky-100/80 mt-6 max-w-xl"
            >
              Descubre cómo se recupera tu cuerpo y cuánto dinero ahorras al dejar de fumar.
              Cada día cuenta, cada decisión importa.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-3 gap-3 mt-8"
            >
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl bg-white/[0.07] backdrop-blur border border-white/10 p-4">
                  <Icon className="w-5 h-5 text-success-300" aria-hidden="true" />
                  <p className="font-semibold !text-sm !text-white mt-3">{title}</p>
                  <p className="!text-xs !text-sky-100/70 mt-1 leading-relaxed">{text}</p>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                type="button"
                onClick={() => scrollToSection('empezar')}
                className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-6 py-3 shadow-lg shadow-sky-900/40 hover:bg-sky-50 transition-colors"
              >
                Empezar ahora
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
              {canInstall && (
                <button
                  type="button"
                  onClick={install}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-5 py-3 transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Instalar la app
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-sky-100/70">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Gratis y sin registro: tus datos se quedan en tu navegador
              </span>
            </motion.div>
          </div>

          {/* Demo de la figura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative aspect-[4/5] rounded-[40px] bg-gradient-to-b from-white/90 via-slate-100/80 to-slate-300/70 border border-white/60 shadow-2xl shadow-black/40 overflow-hidden">
              <div className="absolute inset-x-0 top-6 bottom-0 flex justify-center">
                <div className="h-full aspect-[200/470]">
                  <BodyFigure systems={systems} interactive={false} />
                </div>
              </div>

              {/* Etiquetas flotantes */}
              <motion.div
                className="absolute left-4 top-6 rounded-2xl bg-white/80 backdrop-blur border border-white px-3 py-2 shadow-lg text-slate-800"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <p className="!text-[10px] uppercase tracking-wider !text-slate-500">Sin fumar</p>
                <motion.p key={stage.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-semibold !text-slate-800">
                  {stage.label}
                </motion.p>
              </motion.div>
              <motion.div
                className="absolute right-4 top-1/3 rounded-2xl bg-slate-900/80 backdrop-blur text-white px-3 py-2 shadow-lg"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <p className="!text-[10px] uppercase tracking-wider !text-slate-300">Pulmones</p>
                <p className="font-semibold tabular-nums !text-white">{lungs.score}<span className="text-xs text-slate-400">/100</span></p>
              </motion.div>

              {/* Progreso de la demo */}
              <div className="absolute inset-x-6 bottom-5 flex gap-1.5" aria-hidden="true">
                {DEMO_STAGES.map((s, i) => (
                  <span key={s.label} className="h-1 flex-1 rounded-full bg-slate-400/40 overflow-hidden">
                    {i <= stageIndex && (
                      <motion.span
                        className="block h-full bg-primary-600"
                        initial={{ width: i === stageIndex ? 0 : '100%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: i === stageIndex ? 2.6 : 0, ease: 'linear' }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
