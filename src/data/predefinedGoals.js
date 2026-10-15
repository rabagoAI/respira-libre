/**
 * Objetivos predefinidos con sus precios aproximados
 */
export const predefinedGoals = [
  {
    id: 'iphone',
    name: 'iPhone 15 Pro',
    category: 'Tecnología',
    price: 1219,
    description: 'El último iPhone con todas sus prestaciones',
    popular: true
  },
  {
    id: 'macbook',
    name: 'MacBook Air',
    category: 'Tecnología',
    price: 1299,
    description: 'Laptop perfecta para trabajo y creatividad',
    popular: true
  },
  {
    id: 'ipad',
    name: 'iPad Air',
    category: 'Tecnología',
    price: 699,
    description: 'Tablet versátil para entretenimiento y productividad'
  },
  {
    id: 'ps5',
    name: 'PlayStation 5',
    category: 'Gaming',
    price: 549,
    description: 'La última generación de consolas'
  },
  {
    id: 'switch',
    name: 'Nintendo Switch',
    category: 'Gaming',
    price: 299,
    description: 'Consola portátil y de sobremesa'
  },
  {
    id: 'airpods',
    name: 'AirPods Pro',
    category: 'Audio',
    price: 279,
    description: 'Auriculares inalámbricos con cancelación de ruido'
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    category: 'Tecnología',
    price: 449,
    description: 'Smartwatch para salud y fitness'
  },
  {
    id: 'bici',
    name: 'Bicicleta eléctrica',
    category: 'Deporte',
    price: 1500,
    description: 'Movilidad sostenible y ejercicio'
  },
  {
    id: 'paris',
    name: 'Viaje a París',
    category: 'Viajes',
    price: 800,
    description: 'Fin de semana romántico en la ciudad del amor',
    popular: true
  },
  {
    id: 'tokyo',
    name: 'Viaje a Tokio',
    category: 'Viajes',
    price: 2500,
    description: 'Aventura en el país del sol naciente'
  },
  {
    id: 'bali',
    name: 'Viaje a Bali',
    category: 'Viajes',
    price: 1800,
    description: 'Paraíso tropical y cultura fascinante'
  },
  {
    id: 'nueva-york',
    name: 'Viaje a Nueva York',
    category: 'Viajes',
    price: 1500,
    description: 'La ciudad que nunca duerme'
  },
  {
    id: 'caribe',
    name: 'Crucero por el Caribe',
    category: 'Viajes',
    price: 2000,
    description: 'Navega por islas paradisíacas'
  },
  {
    id: 'gym',
    name: 'Año de gimnasio',
    category: 'Salud',
    price: 600,
    description: 'Inversión en tu salud y bienestar',
    popular: true
  },
  {
    id: 'curso',
    name: 'Curso online especializado',
    category: 'Educación',
    price: 500,
    description: 'Invierte en tu formación profesional'
  },
  {
    id: 'camara',
    name: 'Cámara profesional',
    category: 'Fotografía',
    price: 1200,
    description: 'Captura momentos con calidad profesional'
  },
  {
    id: 'moto',
    name: 'Scooter eléctrico',
    category: 'Movilidad',
    price: 800,
    description: 'Transporte ecológico y económico'
  },
  {
    id: 'spa',
    name: 'Retiro de bienestar',
    category: 'Salud',
    price: 900,
    description: 'Fin de semana de relax y desconexión'
  },
  {
    id: 'sofa',
    name: 'Sofá nuevo',
    category: 'Hogar',
    price: 1000,
    description: 'Renueva tu espacio de descanso'
  },
  {
    id: 'tv',
    name: 'Smart TV 55"',
    category: 'Entretenimiento',
    price: 700,
    description: 'Experiencia de cine en casa'
  }
];

/**
 * Obtiene objetivos por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Array} Array de objetivos de esa categoría
 */
export const getGoalsByCategory = (category) => {
  return predefinedGoals.filter(goal => goal.category === category);
};

/**
 * Obtiene las categorías únicas
 * @returns {Array} Array de categorías
 */
export const getCategories = () => {
  return [...new Set(predefinedGoals.map(goal => goal.category))];
};

/**
 * Obtiene objetivos populares
 * @returns {Array} Array de objetivos populares
 */
export const getPopularGoals = () => {
  return predefinedGoals.filter(goal => goal.popular);
};