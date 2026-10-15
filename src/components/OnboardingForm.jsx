import { motion } from 'framer-motion';
import { ArrowRight, Lock, CalendarDays, CalendarRange, Calendar, Cigarette } from 'lucide-react';
import { toLocalDateString } from '../utils/dates';
import { isValidCigaretteCount } from '../utils/validation';
import { calculateDailySavings, formatCurrency } from '../utils/calculations';
import { useUserDataForm } from '../hooks/useUserDataForm';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import UserDataFields from './UserDataFields';

const PreviewRow = ({ icon: Icon, label, value, highlight = false }) => (
  <div className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${highlight ? 'bg-white shadow-sm border border-white' : 'bg-white/50 border border-white/70'}`}>
    <span className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="w-4 h-4 text-primary-600" aria-hidden="true" />
      {label}
    </span>
    <span className={`tabular-nums font-light ${highlight ? 'text-2xl text-success-600' : 'text-lg text-slate-800'}`}>{value}</span>
  </div>
);

const OnboardingForm = ({ onSubmit }) => {
  const { formData, errors, handleChange, getValidatedData } = useUserDataForm({
    packPrice: '',
    cigarettesPerPack: '20',
    cigarettesPerDayBefore: '',
    cigarettesPerDayNow: '0',
    quitDate: toLocalDateString()
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = getValidatedData();
    if (data) onSubmit(data);
  };

  // Vista previa solo con valores que tengan sentido
  const canPreview = parseFloat(formData.packPrice) > 0 &&
    isValidCigaretteCount(formData.cigarettesPerPack, 1) &&
    isValidCigaretteCount(formData.cigarettesPerDayBefore, 1) &&
    isValidCigaretteCount(formData.cigarettesPerDayNow) &&
    Number(formData.cigarettesPerDayNow) <= Number(formData.cigarettesPerDayBefore);
  const dailySavings = canPreview
    ? calculateDailySavings(
      parseFloat(formData.packPrice),
      Number(formData.cigarettesPerPack),
      Number(formData.cigarettesPerDayBefore),
      Number(formData.cigarettesPerDayNow)
    )
    : 0;
  const yearlyAvoided = canPreview
    ? (Number(formData.cigarettesPerDayBefore) - Number(formData.cigarettesPerDayNow)) * 365
    : 0;

  const animatedDaily = useAnimatedNumber(dailySavings, 0.6);
  const animatedYearly = useAnimatedNumber(dailySavings * 365, 0.9);
  const animatedAvoided = useAnimatedNumber(yearlyAvoided, 0.9);

  return (
    <section id="empezar" className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-14 scroll-mt-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-3 sm:p-5"
      >
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Formulario */}
          <div className="lg:col-span-3 rounded-[28px] bg-white/70 border border-white p-5 sm:p-8">
            <div className="flex items-center gap-3">
              <motion.span
                className="w-7 h-7 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#0ea5e9,#a78bfa,#22c55e,#0ea5e9)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              >
                <span className="block w-full h-full rounded-full bg-white" />
              </motion.span>
              <h2 className="!text-2xl md:!text-3xl !font-light text-slate-800 tracking-tight">
                Comienza tu viaje
              </h2>
            </div>
            <p className="text-slate-500 mt-2">
              Cuéntanos cómo fumabas para personalizar tu panel. Solo tardas un minuto.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8" noValidate>
              <UserDataFields formData={formData} errors={errors} onChange={handleChange} variant="onboarding" />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-800 hover:bg-slate-900 text-slate-50 font-semibold text-lg px-6 py-3.5 shadow-lg shadow-slate-900/20 transition-colors"
              >
                Comenzar mi camino
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Vista previa */}
          <aside className="lg:col-span-2 rounded-[28px] bg-gradient-to-b from-primary-50/80 to-white/60 border border-white p-5 sm:p-6 flex flex-col" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700/80">Tu ahorro estimado</p>
            <p className="!text-sm !text-slate-500 mt-1">
              {canPreview ? 'Así se verá tu progreso si mantienes este consumo' : 'Rellena el precio y tu consumo para ver la estimación'}
            </p>

            <div className="space-y-2.5 mt-5">
              <PreviewRow icon={CalendarDays} label="Cada día" value={formatCurrency(animatedDaily)} highlight />
              <PreviewRow icon={CalendarRange} label="En un mes" value={formatCurrency(animatedDaily * 30)} />
              <PreviewRow icon={Calendar} label="En un año" value={formatCurrency(animatedYearly)} />
              <PreviewRow icon={Cigarette} label="Cigarrillos evitados al año" value={Math.round(animatedAvoided).toLocaleString('es-ES')} />
            </div>

            <div className="mt-auto pt-6">
              <div className="theme-fixed rounded-2xl bg-slate-800/90 text-white p-4 flex gap-3">
                <Lock className="w-5 h-5 text-success-300 shrink-0" aria-hidden="true" />
                <p className="!text-xs !text-slate-300 leading-relaxed">
                  Tus datos se guardan solo en tu navegador. Nadie más puede verlos y puedes exportarlos cuando quieras.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </section>
  );
};

export default OnboardingForm;
