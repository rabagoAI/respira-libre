import { useState } from 'react';
import { validateUserData } from '../utils/validation';
import { parseLocalDate } from '../utils/dates';

/**
 * Estado, validación y conversión del formulario de configuración
 * (compartido por el onboarding y el modal de ajustes)
 * @param {Object} initialValues - Valores iniciales del formulario
 */
export const useUserDataForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Valida y devuelve los datos convertidos, o null si hay errores
  const getValidatedData = () => {
    const newErrors = validateUserData(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return null;

    return {
      packPrice: parseFloat(formData.packPrice),
      cigarettesPerPack: parseInt(formData.cigarettesPerPack, 10),
      cigarettesPerDayBefore: parseInt(formData.cigarettesPerDayBefore, 10),
      cigarettesPerDayNow: parseInt(formData.cigarettesPerDayNow, 10),
      quitDate: parseLocalDate(formData.quitDate).toISOString()
    };
  };

  return { formData, errors, handleChange, getValidatedData };
};
