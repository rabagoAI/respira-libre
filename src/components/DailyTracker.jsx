import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Save, TrendingDown, TrendingUp, CircleCheck, AlertTriangle, HeartHandshake, Wind, ExternalLink } from 'lucide-react';
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

const SETBACK_SOURCE_URL = 'https://smokefree.gov/challenges-when-quitting/stick-with-it/get-back-on-track';

const DailyTracker = ({ userData, onUpdateDaily, onOpenBreathing, embedded = false }) => {
  const today = toLocalDateString();
  const minDate = toLocalDateString(new Date(userData.quitDate));
  const dailyLog = userData.dailyLog || {};

  const [selectedDate, setSelectedDate] = useState(today);
  const [cigarettes, setCigarettes] = useState(dailyLog[today] ?? '');
  const [error, setError] = useState('');
  const [savedDate, setSavedDate] = useState(null);
  // Día guardado por encima del consumo anterior: se muestra un mensaje de apoyo
  const [setbackDate, setSetbackDate] = useState(null);

  // El aviso de guardado desaparece a los 2 segundos
  useEffect(() => {
    if (!savedDate) return;
    const timeout = setTimeout(() => setSavedDate(null), 2000);
    return () => clearTimeout(timeout);
  }, [savedDate]);

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
    setSetbackDate(null);
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
    setSetbackDate(Number(cigarettes) > userData.cigarettesPerDayBefore ? selectedDate : null);
  };

  const hasValue = isValidCigaretteCount(cigarettes);
  const value = Number(cigarettes);
  const improvement = (userData.cigarettesPerDayBefore || 0) - value;
  const previousEntry = getPreviousEntry(dailyLog, selectedDate);
  const changeVsPrevious = previousEntry ? value - previousEntry.value : null;
  const aboveBefore = hasValue && value > userData.cigarettesPerDayBefore;

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
                    setSetbackDate(null);
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
              <Save className="w-5 h-5" aria-hidden="true" />
              Guardar
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {/* Aviso antes de guardar: más que antes de empezar (puede ser un error al escribir) */}
          {aboveBefore && !setbackDate && (
            <div className="mt-4 flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200" role="note">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="!text-sm !text-amber-800">
                Es más de lo que fumabas al día antes de empezar ({userData.cigarettesPerDayBefore}). Revisa que sea
                correcto; si lo es, guárdalo igualmente: anotarlo con sinceridad te ayuda a ver tu progreso real.
              </p>
            </div>
          )}

          {/* Mensaje de apoyo tras guardar un día por encima del consumo anterior */}
          {setbackDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-violet-50 border border-violet-200"
              role="status"
            >
              <p className="flex items-center gap-2 font-semibold !text-violet-800">
                <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                Un mal día no borra tu progreso
              </p>
              <p className="!text-sm !text-violet-700 mt-2 leading-relaxed">
                Un tropiezo es un revés temporal: no vuelves a empezar de cero y todos los cigarrillos que no fumaste
                siguen contando. Piensa qué te llevó a fumar más y qué harás la próxima vez, y retoma tu plan cuanto antes.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {onOpenBreathing && (
                  <button
                    type="button"
                    onClick={onOpenBreathing}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
                  >
                    <Wind className="w-4 h-4" aria-hidden="true" />
                    Respirar ahora
                  </button>
                )}
                <a
                  href={SETBACK_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-violet-700 hover:underline"
                >
                  Consejos de smokefree.gov para retomar el camino
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </div>
            </motion.div>
          )}

          {/* Aviso de guardado */}
          {savedDate && !setbackDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-success-100 border border-success-300 rounded-lg"
              role="status"
            >
              <p className="flex items-center gap-2 text-success-700 font-semibold text-sm">
                <CircleCheck className="w-4 h-4" aria-hidden="true" />
                Consumo {savedDate === today ? 'de hoy' : `del ${formattedDate}`} guardado correctamente
              </p>
            </motion.div>
          )}

          {/* Comparativa rápida */}
          {!savedDate && !setbackDate && hasValue && (
            <div className="mt-4 space-y-2">
              {improvement > 0 ? (
                <div className="flex items-center gap-2 text-success-600">
                  <TrendingDown className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    {improvement} menos que antes de empezar ({userData.cigarettesPerDayBefore}/día)
                  </span>
                </div>
              ) : improvement < 0 ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    {Math.abs(improvement)} más que antes de empezar
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
