import {
  Wind,
  HeartPulse,
  Droplets,
  Brain,
  Laptop,
  Headphones,
  Bike,
  GraduationCap,
  Clapperboard,
  Camera,
  Gamepad2,
  Sofa,
  Zap,
  Plane,
  Dumbbell,
  Target
} from 'lucide-react';

// Icono de línea de cada sistema corporal (sustituye a los emojis de los hitos)
export const SYSTEM_ICONS = {
  respiratory: Wind,
  cardio: HeartPulse,
  circulation: Droplets,
  wellbeing: Brain
};

// Icono de cada categoría de objetivo de ahorro
const CATEGORY_ICONS = {
  'Tecnología': Laptop,
  'Audio': Headphones,
  'Deporte': Bike,
  'Educación': GraduationCap,
  'Entretenimiento': Clapperboard,
  'Fotografía': Camera,
  'Gaming': Gamepad2,
  'Hogar': Sofa,
  'Movilidad': Zap,
  'Salud': Dumbbell,
  'Viajes': Plane
};

/**
 * Icono de una categoría de objetivo (Target para las personalizadas o desconocidas)
 * @param {string} category - Categoría del objetivo
 */
export const getCategoryIcon = (category) => CATEGORY_ICONS[category] ?? Target;
