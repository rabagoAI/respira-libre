import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { toLocalDateString } from '../utils/dates';
import { isValidCigaretteCount } from '../utils/validation';
import { calculateDailySavings, formatCurrency } from '../utils/calculations';
import { useUserDataForm } from '../hooks/useUserDataForm';
import UserDataFields from './UserDataFields';

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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comienza tu viaje
          </h2>
          <p className="text-lg text-slate-600">
            Completa estos datos para ver tu progreso personalizado
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="card space-y-6" noValidate>
          <UserDataFields formData={formData} errors={errors} onChange={handleChange} variant="onboarding" />

          {/* Vista previa de ahorro diario */}
          {canPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-success-50 to-primary-50 rounded-xl p-6 border border-success-200"
              aria-live="polite"
            >
              <p className="text-sm text-slate-600 mb-2">Tu ahorro estimado diario:</p>
              <p className="text-3xl font-bold text-success-600">
                {formatCurrency(dailySavings)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ¡En un mes podrías ahorrar aproximadamente {formatCurrency(dailySavings * 30)}!
              </p>
            </motion.div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            Comenzar mi camino
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </form>

        {/* Nota de privacidad */}
        <p className="text-center text-sm text-slate-500 mt-8">
          🔒 Tus datos se guardan solo en tu navegador. Nadie más puede verlos.
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
