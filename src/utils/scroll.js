/**
 * Desplaza la vista hasta una sección de la página
 * @param {string} id - id del elemento de destino
 */
export const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
