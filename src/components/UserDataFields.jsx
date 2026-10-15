import { useId } from 'react';
import { Cigarette, Euro, Calendar } from 'lucide-react';
import { toLocalDateString } from '../utils/dates';

// Textos de cada campo según dónde se muestre el formulario
const FIELD_TEXTS = {
  onboarding: {
    packPrice: { label: '¿Cuánto cuesta tu paquete de tabaco?', placeholder: '5.50' },
    cigarettesPerPack: { label: '¿Cuántos cigarrillos tiene tu paquete?', placeholder: '20', hint: 'Normalmente 20 cigarrillos' },
    cigarettesPerDayBefore: { label: '¿Cuántos cigarrillos fumabas al día?', placeholder: '20' },
    cigarettesPerDayNow: { label: '¿Cuántos cigarrillos fumas ahora?', placeholder: '0', hint: 'Escribe 0 si lo dejaste completamente' },
    quitDate: { label: '¿Cuándo empezaste a reducir o dejar de fumar?' }
  },
  settings: {
    packPrice: { label: 'Precio del paquete' },
    cigarettesPerPack: { label: 'Cigarrillos por paquete' },
    cigarettesPerDayBefore: { label: 'Cigarrillos que fumabas al día (antes)' },
    cigarettesPerDayNow: {
      label: 'Cigarrillos al día al empezar',
      hint: 'Se usa para los días anteriores a tu primer registro diario. Tu consumo de cada día se apunta en el registro diario.'
    },
    quitDate: { label: 'Fecha de inicio' }
  }
};

const FIELDS = [
  { name: 'packPrice', icon: Euro, iconClass: 'text-primary-600', type: 'number', min: '0', step: '0.01', suffix: '€' },
  { name: 'cigarettesPerPack', icon: Cigarette, iconClass: 'text-primary-600', type: 'number', min: '1', step: '1' },
  { name: 'cigarettesPerDayBefore', icon: Cigarette, iconClass: 'text-orange-600', type: 'number', min: '1', step: '1' },
  { name: 'cigarettesPerDayNow', icon: Cigarette, iconClass: 'text-success-600', type: 'number', min: '0', step: '1' },
  { name: 'quitDate', icon: Calendar, iconClass: 'text-primary-600', type: 'date' }
];

/**
 * Campos de configuración del usuario (precio, consumo y fecha de inicio)
 * @param {Object} formData - Valores del formulario
 * @param {Object} errors - Errores por campo
 * @param {Function} onChange - Manejador de cambios
 * @param {'onboarding'|'settings'} variant - Textos a usar
 */
const UserDataFields = ({ formData, errors, onChange, variant = 'onboarding' }) => {
  const idPrefix = useId();
  const texts = FIELD_TEXTS[variant];

  return (
    <>
      {FIELDS.map(({ name, icon: Icon, iconClass, suffix, ...inputProps }) => {
        const { label, placeholder, hint } = texts[name];
        const id = `${idPrefix}-${name}`;
        const error = errors[name];
        const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

        return (
          <div key={name}>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Icon className={`w-4 h-4 ${iconClass}`} aria-hidden="true" />
              {label}
            </label>
            <div className="relative">
              <input
                id={id}
                name={name}
                value={formData[name]}
                onChange={onChange}
                placeholder={placeholder}
                max={name === 'quitDate' ? toLocalDateString() : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={`input-field ${error ? 'border-red-500' : ''}`}
                {...inputProps}
              />
              {suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">{suffix}</span>
              )}
            </div>
            {error && (
              <p id={`${id}-error`} className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {hint && (
              <p id={`${id}-hint`} className="text-xs text-slate-500 mt-1">{hint}</p>
            )}
          </div>
        );
      })}
    </>
  );
};

export default UserDataFields;
