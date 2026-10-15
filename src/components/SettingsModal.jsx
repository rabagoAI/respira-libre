import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Cigarette, Euro, Calendar } from 'lucide-react';
import { toLocalDateString, parseLocalDate } from '../utils/dates';

// Convierte los datos guardados en valores del formulario
const getInitialFormData = (userData) => ({
  packPrice: userData?.packPrice || 0,
  cigarettesPerPack: userData?.cigarettesPerPack || 20,
  cigarettesPerDayBefore: userData?.cigarettesPerDayBefore || 0,
  cigarettesPerDayNow: userData?.cigarettesPerDayNow || 0,
  quitDate: toLocalDateString(userData?.quitDate ? new Date(userData.quitDate) : new Date())
});

const SettingsModal = ({ isOpen, onClose, userData, onSave, onReset }) => {
  // El modal se monta al abrirse, así que el formulario parte siempre de los datos actuales
  const [formData, setFormData] = useState(() => getInitialFormData(userData));
  const [errors, setErrors] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Validación de seguridad (después de los hooks para no romper su orden)
  if (!userData || !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      newErrors.cigarettesPerDayNow = 'Introduce cuántos fumas ahora';
    }

    if (parseInt(formData.cigarettesPerDayNow) > parseInt(formData.cigarettesPerDayBefore)) {
      newErrors.cigarettesPerDayNow = 'No puede ser mayor que lo que fumabas antes';
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
      onSave({
        ...userData,
        packPrice: parseFloat(formData.packPrice),
        cigarettesPerPack: parseInt(formData.cigarettesPerPack),
        cigarettesPerDayBefore: parseInt(formData.cigarettesPerDayBefore),
        cigarettesPerDayNow: parseInt(formData.cigarettesPerDayNow),
        quitDate: parseLocalDate(formData.quitDate).toISOString(),
        updatedAt: new Date().toISOString()
      });
      onClose();
    }
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onClose();
    // Pequeño delay para que el modal se cierre antes
    setTimeout(() => {
      if (onReset && typeof onReset === 'function') {
        onReset();
      } else {
        console.error('onReset is not a function');
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">
              Editar configuración
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Contenido */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="space-y-6">
              {/* Precio del paquete */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Euro className="w-4 h-4 text-primary-600" />
                  Precio del paquete
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="packPrice"
                    value={formData.packPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
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
                  Cigarrillos por paquete
                </label>
                <input
                  type="number"
                  name="cigarettesPerPack"
                  value={formData.cigarettesPerPack}
                  onChange={handleChange}
                  min="1"
                  className={`input-field ${errors.cigarettesPerPack ? 'border-red-500' : ''}`}
                />
                {errors.cigarettesPerPack && (
                  <p className="text-red-500 text-sm mt-1">{errors.cigarettesPerPack}</p>
                )}
              </div>

              {/* Cigarrillos al día ANTES */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Cigarette className="w-4 h-4 text-orange-600" />
                  Cigarrillos que fumabas al día (antes)
                </label>
                <input
                  type="number"
                  name="cigarettesPerDayBefore"
                  value={formData.cigarettesPerDayBefore}
                  onChange={handleChange}
                  min="1"
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
                  Cigarrillos que fumas ahora
                </label>
                <input
                  type="number"
                  name="cigarettesPerDayNow"
                  value={formData.cigarettesPerDayNow}
                  onChange={handleChange}
                  min="0"
                  className={`input-field ${errors.cigarettesPerDayNow ? 'border-red-500' : ''}`}
                />
                {errors.cigarettesPerDayNow && (
                  <p className="text-red-500 text-sm mt-1">{errors.cigarettesPerDayNow}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Actualiza este número según tu consumo actual
                </p>
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  Fecha de inicio
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

              {/* Vista previa del cambio */}
              {String(formData.cigarettesPerDayNow) !== String(userData.cigarettesPerDayNow) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gradient-to-r from-primary-50 to-success-50 rounded-xl p-4 border border-primary-200"
                >
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    📊 Cambio detectado:
                  </p>
                  <p className="text-sm text-slate-600">
                    De <span className="font-bold text-orange-600">{userData.cigarettesPerDayNow}</span> cigarrillos/día 
                    {' → '}
                    <span className="font-bold text-success-600">{formData.cigarettesPerDayNow}</span> cigarrillos/día
                  </p>
                  {parseInt(formData.cigarettesPerDayNow) < userData.cigarettesPerDayNow && (
                    <p className="text-success-600 font-semibold text-sm mt-1">
                      ¡Felicidades! Has reducido tu consumo 🎉
                    </p>
                  )}
                  {parseInt(formData.cigarettesPerDayNow) > userData.cigarettesPerDayNow && (
                    <p className="text-orange-600 text-sm mt-1">
                      No te preocupes, mañana es un nuevo día 💪
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Guardar cambios
              </button>
            </div>
            
            {/* Botón de reiniciar */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all duration-200 border-2 border-red-200"
            >
              🔄 Reiniciar mi camino desde cero
            </button>
          </div>
        </motion.div>

        {/* Modal de confirmación de reset */}
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-10"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  ¿Reiniciar completamente?
                </h3>
                <p className="text-slate-600">
                  Esta acción no se puede deshacer
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-red-900 mb-2">Esto borrará:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>✗ Tu historial diario completo</li>
                  <li>✗ Tus objetivos guardados</li>
                  <li>✗ Todas tus estadísticas</li>
                  <li>✗ Todo tu progreso acumulado</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Sí, reiniciar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </motion.div>
      
    </AnimatePresence>
  );
};

export default SettingsModal;