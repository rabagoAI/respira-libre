// Preparación para los tests de componentes (los que usan `@vitest-environment jsdom`)
import { afterEach } from 'vitest';

if (typeof window !== 'undefined') {
  await import('@testing-library/jest-dom/vitest');
  const { cleanup } = await import('@testing-library/react');

  // Desmontar lo renderizado entre tests
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  // jsdom no implementa estas APIs del navegador que usan framer-motion y la app.
  // Se simula "reducir movimiento" para que los contadores animados muestren su
  // valor final al instante y los tests no dependan de las animaciones.
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion') && !query.includes('no-preference'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    });
  }

  class MockObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  window.IntersectionObserver ??= MockObserver;
  window.ResizeObserver ??= MockObserver;
}
