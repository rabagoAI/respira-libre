import { useId, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { getReminder, isValidReminderTime } from '../utils/reminder';

const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window;

/**
 * Activar el recordatorio diario y elegir la hora
 * @param {Object} userData - Datos del usuario
 * @param {Function} onSave - Actualiza los datos (admite función)
 */
const ReminderSettings = ({ userData, onSave }) => {
  const id = useId();
  const reminder = getReminder(userData);
  const [permission, setPermission] = useState(notificationsSupported() ? Notification.permission : 'unsupported');

  const update = (changes) => {
    onSave(prev => ({ ...prev, reminder: { ...getReminder(prev), ...changes } }));
  };

  const handleToggle = async () => {
    const enabling = !reminder.enabled;
    update({ enabled: enabling });
    // Pedir permiso solo cuando el usuario lo activa (nunca al cargar la página)
    if (enabling && notificationsSupported() && Notification.permission === 'default') {
      setPermission(await Notification.requestPermission());
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            {reminder.enabled ? <Bell className="w-4 h-4 text-primary-600" aria-hidden="true" /> : <BellOff className="w-4 h-4 text-slate-400" aria-hidden="true" />}
            <span id={`${id}-label`}>Recordatorio diario</span>
          </p>
          <p className="!text-xs !text-slate-500 mt-1">
            Te avisa si a esa hora aún no has registrado tu consumo del día.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={reminder.enabled}
          aria-labelledby={`${id}-label`}
          onClick={handleToggle}
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${reminder.enabled ? 'bg-primary-600' : 'bg-slate-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${reminder.enabled ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      {reminder.enabled && (
        <div className="mt-4 space-y-3">
          <label htmlFor={`${id}-time`} className="flex items-center justify-between gap-3 text-sm text-slate-700">
            Hora del aviso
            <input
              id={`${id}-time`}
              type="time"
              value={reminder.time}
              onChange={(e) => isValidReminderTime(e.target.value) && update({ time: e.target.value, lastNotified: null })}
              className="input-field !w-32 !py-2"
            />
          </label>

          <p className="!text-xs !text-slate-500 leading-relaxed">
            {permission === 'granted' && 'Recibirás una notificación a esa hora mientras la app esté abierta, aunque sea en segundo plano. Al abrirla también verás el aviso.'}
            {permission === 'denied' && 'Las notificaciones están bloqueadas en tu navegador. Verás el aviso al abrir la app; para recibir notificaciones, permítelas en los ajustes del navegador.'}
            {permission === 'default' && 'Permite las notificaciones cuando el navegador te lo pida para recibir el aviso. Mientras tanto, lo verás al abrir la app.'}
            {permission === 'unsupported' && 'Tu navegador no admite notificaciones. Verás el aviso al abrir la app.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReminderSettings;
