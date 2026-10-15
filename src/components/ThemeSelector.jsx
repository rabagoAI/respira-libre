import { useId } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Sun, Moon } from 'lucide-react';

const OPTIONS = [
  { id: 'system', label: 'Sistema', icon: Monitor },
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Oscuro', icon: Moon }
];

/**
 * Selector de tema para los ajustes (sistema, claro u oscuro)
 * @param {Object} theme - Resultado de useTheme
 */
const ThemeSelector = ({ theme }) => {
  const id = useId();
  if (!theme) return null;

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <p id={`${id}-label`} className="text-sm font-semibold text-slate-700">Apariencia</p>
      <p className="!text-xs !text-slate-500 mt-1">Con «Sistema» se usa el tema claro u oscuro de tu dispositivo.</p>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-slate-100 p-1">
        {OPTIONS.map(({ id: option, label, icon: Icon }) => {
          const selected = theme.preference === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => theme.setPreference(option)}
              className={`relative flex items-center justify-center gap-1.5 rounded-full py-1.5 text-sm transition-colors ${selected ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {selected && (
                <motion.span layoutId={`${id}-theme`} className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <Icon className="relative w-4 h-4" aria-hidden="true" />
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
