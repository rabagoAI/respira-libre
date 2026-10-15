import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Save, TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toLocalDateString, parseLocalDate } from '../utils/dates';
import { isValidCigaretteCount, MAX_CIGARETTES_PER_DAY } from '../utils/validation';

/**
 * Obtiene el último registro anterior a una fecha
 * @param {Object} dailyLog - Registro diario
 * @param {string} date - Fecha yyyy-MM-dd
 * @returns {Object|null} Fecha y valor del registro anterior
 */
const getPreviousEntry = (dailyLog = {}, date) => {
  const previousDate = Object.keys(dailyLog).sort().filter(d => d < date).pop();
  return previousDate ? { date: previousDate, value: dailyLog[previousDate] } : null;
};

const DailyTracker = ({ userData, onUpdateDaily, embedded = false }) => {
  const today = toLocalDateString();
  const minDate = toLocalDateString(new Date(userData.quitDate));
  const dailyLog = userData.dailyLog || {};

  const [selectedDate, setSelectedDate] = useState(today);
  const [cigarettes, setCigarettes] = useState(dailyLog[today] ?? '');
  const [error, setError] = useState('');
  const [savedDate, setSavedDate] = useState(null);

  const isToday = selectedDate === today;
  const formattedDate = format(parseLocalDate(selectedDate), "d 'de' MMMM", { locale: es });

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (!date) return;
    setSelectedDate(date);
    // Mostrar lo registrado ese día, si existe
    setCigarettes(dailyLog[date] ?? '');
    setError('');
    setSavedDate(null);
  };

  const handleSave = () => {
    if (!isValidCigaretteCount(cigarettes)) {
      setError(`Introduce un número entero entre 0 y ${MAX_CIGARETTES_PER_DAY}`);
      return;
    }

    // Solo se actualiza el registro diario: cigarettesPerDayNow se usa para
    // los días anteriores al primer registro y no debe cambiar cada día
    onUpdateDaily({
      ...userData,
      lastUpdate: today,
      dailyLog: {
        ...dailyLog,
        [selectedDate]: Number(cigarettes)
      }
    });

    setError('');
    setSavedDate(selectedDate);
    setTimeout(() => setSavedDate(null), 2000);
  };

  const hasValue = isValidCigaretteCount(cigarettes);
  const value = Number(cigarettes);
  const improvement = (userData.cigarettesPerDayBefore || 0) - value;
  const previousEntry = getPreviousEntry(dailyLog, selectedDate);
  const changeVsPrevious = previousEntry ? value - previousEntry.value : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={embedded ? '' : 'card bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 mb-8'}
    >
      <div className="flex items-start gap-4">
        {/* Dentro del plan personalizado ya hay contexto, así que se omite el icono */}
        {!embedded && (
          <div className="p-3 bg-primary-600 rounded-xl">
            <Cigarette className="w-6 h-6 text-white" />
          </div>
        )}

        <div className="flex-1">
          <h3 className={`${embedded ? '!text-base' : '!text-xl'} font-bold text-slate-900 mb-2`}>
            {isToday ? '¿Cuántos cigarrillos has fumado hoy?' : `¿Cuántos cigarrillos fumaste el ${formattedDate}?`}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Actualiza tu consumo diario para ver tu progreso real. ¿Se te olvidó algún día? Cambia la fecha.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={today}
              onChange={handleDateChange}
              aria-label="Día del registro"
              className="input-field max-w-[12rem]"
            />

            <div className="flex-1 min-w-[10rem] max-w-xs">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={MAX_CIGARETTES_PER_DAY}
                  step="1"
                  value={cigarettes}
                  onChange={(e) => {
                    setCigarettes(e.target.value);
                    setError('');
                  }}
                  aria-label="Cigarrillos fumados"
                  className={`input-field text-2xl font-bold text-center ${error ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  cigarrillos
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {/* Feedback visual */}
          {savedDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-success-100 border border-success-300 rounded-lg"
            >
              <p className="text-success-700 font-semibold text-sm">
                ✓ Consumo {savedDate === today ? 'de hoy' : `del ${formattedDate}`} guardado correctamente
              </p>
            </motion.div>
          )}

          {/* Comparativa rápida */}
          {!savedDate && hasValue && (
            <div className="mt-4 space-y-2">
              {improvement > 0 ? (
                <div className="flex items-center gap-2 text-success-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {improvement} menos que antes de empezar ({userData.cigarettesPerDayBefore}/día)
                  </span>
                </div>
              ) : improvement < 0 ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {Math.abs(improvement)} más que antes de empezar, pero no te desanimes 💪
                  </span>
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  Mismo consumo que antes de empezar
                </div>
              )}

              {changeVsPrevious !== null && changeVsPrevious !== 0 && (
                <p className={`text-sm ${changeVsPrevious < 0 ? 'text-success-600' : 'text-orange-600'}`}>
                  {Math.abs(changeVsPrevious)} {changeVsPrevious < 0 ? 'menos' : 'más'} que tu registro anterior
                  {' '}({format(parseLocalDate(previousEntry.date), "d 'de' MMMM", { locale: es })}: {previousEntry.value})
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyTracker;
