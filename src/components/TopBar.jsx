import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LineChart, Trophy, HeartPulse, Target, Settings, Flame, Download } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';
import { scrollToSection } from '../utils/scroll';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const NAV_ITEMS = [
  { id: 'panel', label: 'Panel', icon: LayoutDashboard },
  { id: 'evolucion', label: 'Evolución', icon: LineChart },
  { id: 'logros', label: 'Logros', icon: Trophy },
  { id: 'beneficios', label: 'Beneficios', icon: HeartPulse },
  { id: 'objetivos', label: 'Objetivos', icon: Target }
];

/**
 * Barra superior fija del panel (sustituye al Hero cuando ya hay datos)
 */
const TopBar = ({ userData, onOpenSettings }) => {
  const [active, setActive] = useState('panel');
  const { canInstall, install } = useInstallPrompt();
  const days = Math.max(differenceInCalendarDays(new Date(), new Date(userData.quitDate)), 0);

  const goTo = (id) => {
    setActive(id);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-lg shadow-slate-900/5 pl-4 pr-2 py-2">
        {/* Logo */}
        <a href="#panel" onClick={(e) => { e.preventDefault(); goTo('panel'); }} className="flex items-center gap-2 shrink-0">
          <img src="/favicon.svg" alt="" className="w-8 h-8" />
          <span className="font-semibold text-slate-800 hidden sm:inline">
            Respira <span className="text-primary-600">Libre</span>
          </span>
        </a>

        {/* Navegación */}
        <nav aria-label="Secciones" className="flex-1 flex justify-center min-w-0">
          <ul className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => goTo(id)}
                  aria-current={active === id ? 'true' : undefined}
                  aria-label={label}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    active === id ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {active === id && (
                    <motion.span
                      layoutId="topbar-active"
                      className="absolute inset-0 rounded-full bg-slate-800 shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative w-4 h-4" aria-hidden="true" />
                  <span className="relative hidden md:inline">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Instalar, racha y ajustes */}
        <div className="flex items-center gap-2 shrink-0">
          {canInstall && (
            <button
              type="button"
              onClick={install}
              aria-label="Instalar la app"
              title="Instalar la app"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="hidden lg:inline">Instalar</span>
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-600">
            <Flame className="w-4 h-4" aria-hidden="true" />
            {days} {days === 1 ? 'día' : 'días'}
          </span>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Editar configuración"
            title="Editar configuración"
            className="w-10 h-10 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-700 flex items-center justify-center transition-colors"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
