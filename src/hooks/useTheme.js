import { useCallback, useEffect, useState } from 'react';

// Preferencia por dispositivo (no forma parte de los datos del usuario ni de la copia)
export const THEME_STORAGE_KEY = 'respiraLibre_theme';
export const THEME_OPTIONS = ['system', 'light', 'dark'];

const THEME_COLORS = { light: '#0284c7', dark: '#0b1120' };

const readPreference = () => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.includes(value) ? value : 'system';
  } catch {
    return 'system';
  }
};

const systemPrefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

/**
 * Tema de la app: sistema, claro u oscuro
 * @returns {Object} { preference, isDark, cycleTheme, setPreference }
 */
export const useTheme = () => {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const isDark = preference === 'dark' || (preference === 'system' && systemDark);

  // Seguir los cambios de tema del sistema operativo
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemDark(e.matches);
    media?.addEventListener('change', handleChange);
    return () => media?.removeEventListener('change', handleChange);
  }, []);

  // La clase `dark` en <html> activa las variables oscuras de theme.colors.cjs
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[isDark ? 'dark' : 'light']);
  }, [isDark]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Sin almacenamiento disponible: el tema solo dura esta visita
    }
  }, [preference]);

  // Sistema → claro → oscuro → sistema
  const cycleTheme = useCallback(() => {
    setPreference(current => THEME_OPTIONS[(THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length]);
  }, []);

  return { preference, isDark, cycleTheme, setPreference };
};
