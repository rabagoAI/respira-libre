import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Sun, Moon } from 'lucide-react';

const OPTIONS = {
  system: { icon: Monitor, label: 'Tema del sistema' },
  light: { icon: Sun, label: 'Tema claro' },
  dark: { icon: Moon, label: 'Tema oscuro' }
};

/**
 * Botón que alterna el tema: sistema → claro → oscuro
 * @param {Object} theme - Resultado de useTheme
 * @param {string} className - Estilos del botón
 */
const ThemeToggle = ({ theme, className = '' }) => {
  const { icon: Icon, label } = OPTIONS[theme.preference];
  return (
    <button
      type="button"
      onClick={theme.cycleTheme}
      aria-label={`${label}. Pulsa para cambiar`}
      title={label}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme.preference}
          initial={{ y: 12, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
