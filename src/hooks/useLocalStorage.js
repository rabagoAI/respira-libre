import { useState, useEffect, useCallback } from 'react';

/**
 * Lee y parsea un valor de localStorage
 * @param {string} key - Clave para localStorage
 * @param {any} fallback - Valor a devolver si no existe o falla
 */
const readValue = (key, fallback) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error al leer localStorage key "${key}":`, error);
    return fallback;
  }
};

/**
 * Hook personalizado para manejar localStorage con React
 * @param {string} key - Clave para localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  // Guardar el valor inicial una sola vez para que las funciones sean estables
  const [defaultValue] = useState(initialValue);
  const [storedValue, setStoredValue] = useState(() => readValue(key, initialValue));

  // Función para actualizar el valor (estable entre renders)
  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      // Permitir que value sea una función como en useState, usando siempre el valor más reciente
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error al guardar en localStorage key "${key}":`, error);
      }
      return valueToStore;
    });
  }, [key]);

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar localStorage key "${key}":`, error);
    }
    setStoredValue(defaultValue);
  }, [key, defaultValue]);

  // Sincronizar con cambios hechos en otras pestañas
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.storageArea === window.localStorage && e.key === key) {
        setStoredValue(e.newValue ? readValue(key, defaultValue) : defaultValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
};
