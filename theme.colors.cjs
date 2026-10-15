/**
 * Paleta de colores con variables CSS para el modo claro y el oscuro.
 *
 * En lugar de añadir variantes `dark:` a cada clase, los colores de Tailwind
 * apuntan a variables que cambian de valor con la clase `dark` en <html>:
 * - Grises (slate/gray): se invierten (el fondo claro pasa a oscuro y el texto oscuro a claro)
 * - Blanco en fondos y bordes: pasa a una superficie oscura (`text-white` sigue siendo blanco)
 * - Colores: los tonos claros de fondo (50-200) se oscurecen y el texto (500-900) se aclara
 * Dentro de `.theme-fixed` se conservan los colores claros (zonas que ya son oscuras
 * en ambos modos, como la portada o el pie).
 */
const defaults = require('tailwindcss/colors');

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const PALETTES = {
  slate: defaults.slate,
  gray: defaults.gray,
  primary: {
    50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8',
    500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49'
  },
  success: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
    500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16'
  },
  sky: defaults.sky,
  blue: defaults.blue,
  indigo: defaults.indigo,
  violet: defaults.violet,
  purple: defaults.purple,
  pink: defaults.pink,
  rose: defaults.rose,
  red: defaults.red,
  orange: defaults.orange,
  amber: defaults.amber,
  yellow: defaults.yellow,
  green: defaults.green,
  emerald: defaults.emerald,
  teal: defaults.teal,
  cyan: defaults.cyan
};

const NEUTRALS = ['slate', 'gray'];

// Grises del modo oscuro (de fondo a texto)
const DARK_NEUTRAL = {
  50: '#0b1120', 100: '#131c2e', 200: '#1e293b', 300: '#334155', 400: '#64748b',
  500: '#94a3b8', 600: '#cbd5e1', 700: '#e2e8f0', 800: '#f1f5f9', 900: '#f8fafc', 950: '#ffffff'
};
const LIGHT_SURFACE = '#ffffff';
const DARK_SURFACE = '#1a2336';
const DARK_BASE = '#0b1120';

const toRgb = (hex) => {
  const value = hex.replace('#', '');
  const n = parseInt(value.length === 3 ? value.split('').map(c => c + c).join('') : value, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbVar = (hex) => toRgb(hex).join(' ');
const mix = (hex, baseHex, amount) => {
  const a = toRgb(hex);
  const b = toRgb(baseHex);
  return '#' + a.map((v, i) => Math.round(v * amount + b[i] * (1 - amount)).toString(16).padStart(2, '0')).join('');
};

// Proporción de color que conservan los tonos claros de fondo en modo oscuro
const DARK_TINT = { 50: 0.12, 100: 0.18, 200: 0.28 };
// Tono que se usa para el texto en modo oscuro
const DARK_TEXT = { 500: '400', 600: '400', 700: '300', 800: '200', 900: '100', 950: '50' };

const shadeOf = (palette, shade) => palette[shade] ?? palette['900'];

const buildVars = (mode) => {
  const vars = {
    '--bg-white': rgbVar(mode === 'dark' ? DARK_SURFACE : LIGHT_SURFACE)
  };
  for (const [name, palette] of Object.entries(PALETTES)) {
    for (const shade of SHADES) {
      const base = shadeOf(palette, shade);
      let bg = base;
      let text = base;
      if (mode === 'dark') {
        if (NEUTRALS.includes(name)) {
          bg = DARK_NEUTRAL[shade];
          text = DARK_NEUTRAL[shade];
        } else {
          bg = DARK_TINT[shade] ? mix(palette['500'], DARK_BASE, DARK_TINT[shade]) : base;
          text = DARK_TEXT[shade] ? shadeOf(palette, DARK_TEXT[shade]) : base;
        }
      }
      vars[`--bg-${name}-${shade}`] = rgbVar(bg);
      vars[`--tx-${name}-${shade}`] = rgbVar(text);
    }
  }
  return vars;
};

const paletteFromVars = (prefix) =>
  Object.fromEntries(Object.keys(PALETTES).map(name => [
    name,
    Object.fromEntries(SHADES.map(shade => [shade, `rgb(var(--${prefix}-${name}-${shade}) / <alpha-value>)`]))
  ]));

const BASE_COLORS = { transparent: 'transparent', current: 'currentColor', inherit: 'inherit', black: '#000000' };

module.exports = {
  // Fondos, bordes, degradados, anillos…
  colors: { ...BASE_COLORS, white: 'rgb(var(--bg-white) / <alpha-value>)', ...paletteFromVars('bg') },
  // Texto: blanco fijo y colores con su propia variante oscura
  textColor: { ...BASE_COLORS, white: '#ffffff', ...paletteFromVars('tx') },
  // Sombras: siempre con los colores originales (una sombra clara sobre fondo oscuro no tiene sentido)
  boxShadowColor: { ...BASE_COLORS, white: '#ffffff', ...PALETTES },
  lightVars: buildVars('light'),
  darkVars: buildVars('dark')
};
