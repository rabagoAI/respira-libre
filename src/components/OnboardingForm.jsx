import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Euro, Calendar, ArrowRight } from 'lucide-react';
import { toLocalDateString, parseLocalDate } from '../utils/dates';

const OnboardingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    packPrice: '',
    cigarettesPerPack: '20',
    cigarettesPerDayBefore: '',
    cigarettesPerDayNow: '0',
    quitDate: toLocalDateString()
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.packPrice || parseFloat(formData.packPrice) <= 0) {
      newErrors.packPrice = 'Introduce un precio válido';
    }

    if (!formData.cigarettesPerPack || parseInt(formData.cigarettesPerPack) <= 0) {
      newErrors.cigarettesPerPack = 'Introduce una cantidad válida';
    }

    if (!formData.cigarettesPerDayBefore || parseInt(formData.cigarettesPerDayBefore) <= 0) {
      newErrors.cigarettesPerDayBefore = 'Introduce cuántos cigarrillos fumabas';
    }

    if (formData.cigarettesPerDayNow === '') {
      newErrors.cigarettesPerDayNow = 'Introduce cuántos fumas ahora (0 si lo dejaste)';
    }

    if (parseInt(formData.cigarettesPerDayNow) >= parseInt(formData.cigarettesPerDayBefore)) {
      newErrors.cigarettesPerDayNow = 'Debe ser menor que lo que fumabas antes';
    }

    if (!formData.quitDate) {
      newErrors.quitDate = 'Selecciona una fecha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        packPrice: parseFloat(formData.packPrice),
        cigarettesPerPack: parseInt(formData.cigarettesPerPack),
        cigarettesPerDayBefore: parseInt(formData.cigarettesPerDayBefore),
        cigarettesPerDayNow: parseInt(formData.cigarettesPerDayNow),
        quitDate: parseLocalDate(formData.quitDate).toISOString()
      });
    }
  };

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
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Precio del paquete */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Euro className="w-4 h-4 text-primary-600" />
              ¿Cuánto cuesta tu paquete de tabaco?
            </label>
            <div className="relative">
              <input
                type="number"
                name="packPrice"
                value={formData.packPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="5.50"
                className={`input-field ${errors.packPrice ? 'border-red-500' : ''}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
            </div>
            {errors.packPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.packPrice}</p>
            )}
          </div>

          {/* Cigarrillos por paquete */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Cigarette className="w-4 h-4 text-primary-600" />
              ¿Cuántos cigarrillos tiene tu paquete?
            </label>
            <input
              type="number"
              name="cigarettesPerPack"
              value={formData.cigarettesPerPack}
              onChange={handleChange}
              min="1"
              placeholder="20"
              className={`input-field ${errors.cigarettesPerPack ? 'border-red-500' : ''}`}
            />
            {errors.cigarettesPerPack && (
              <p className="text-red-500 text-sm mt-1">{errors.cigarettesPerPack}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">Normalmente 20 cigarrillos</p>
          </div>

          {/* Cigarrillos al día ANTES */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Cigarette className="w-4 h-4 text-orange-600" />
              ¿Cuántos cigarrillos fumabas al día?
            </label>
            <input
              type="number"
              name="cigarettesPerDayBefore"
              value={formData.cigarettesPerDayBefore}
              onChange={handleChange}
              min="1"
              placeholder="20"
              className={`input-field ${errors.cigarettesPerDayBefore ? 'border-red-500' : ''}`}
            />
            {errors.cigarettesPerDayBefore && (
              <p className="text-red-500 text-sm mt-1">{errors.cigarettesPerDayBefore}</p>
            )}
          </div>

          {/* Cigarrillos al día AHORA */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Cigarette className="w-4 h-4 text-success-600" />
              ¿Cuántos cigarrillos fumas ahora?
            </label>
            <input
              type="number"
              name="cigarettesPerDayNow"
              value={formData.cigarettesPerDayNow}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className={`input-field ${errors.cigarettesPerDayNow ? 'border-red-500' : ''}`}
            />
            {errors.cigarettesPerDayNow && (
              <p className="text-red-500 text-sm mt-1">{errors.cigarettesPerDayNow}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">Escribe 0 si lo dejaste completamente</p>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              ¿Cuándo empezaste a reducir o dejar de fumar?
            </label>
            <input
              type="date"
              name="quitDate"
              value={formData.quitDate}
              onChange={handleChange}
              max={toLocalDateString()}
              className={`input-field ${errors.quitDate ? 'border-red-500' : ''}`}
            />
            {errors.quitDate && (
              <p className="text-red-500 text-sm mt-1">{errors.quitDate}</p>
            )}
          </div>

          {/* Vista previa de ahorro diario */}
          {formData.packPrice && formData.cigarettesPerPack && formData.cigarettesPerDayBefore && formData.cigarettesPerDayNow !== '' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-success-50 to-primary-50 rounded-xl p-6 border border-success-200"
            >
              <p className="text-sm text-slate-600 mb-2">Tu ahorro estimado diario:</p>
              <p className="text-3xl font-bold text-success-600">
                {(
                  ((parseFloat(formData.packPrice) / parseInt(formData.cigarettesPerPack)) *
                  (parseInt(formData.cigarettesPerDayBefore) - parseInt(formData.cigarettesPerDayNow)))
                ).toFixed(2)}€
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ¡En un mes podrías ahorrar aproximadamente {(
                  ((parseFloat(formData.packPrice) / parseInt(formData.cigarettesPerPack)) *
                  (parseInt(formData.cigarettesPerDayBefore) - parseInt(formData.cigarettesPerDayNow))) * 30
                ).toFixed(2)}€!
              </p>
            </motion.div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            Comenzar mi camino
            <ArrowRight className="w-5 h-5" />
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