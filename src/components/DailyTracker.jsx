import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Save, TrendingDown } from 'lucide-react';

const DailyTracker = ({ userData, onUpdateDaily }) => {
  const [todayCigarettes, setTodayCigarettes] = useState(userData.cigarettesPerDayNow || 0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Actualizar el registro diario
    onUpdateDaily({
      ...userData,
      cigarettesPerDayNow: parseInt(todayCigarettes),
      lastUpdate: today,
      dailyLog: {
        ...userData.dailyLog,
        [today]: parseInt(todayCigarettes)
      }
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const improvement = (userData.cigarettesPerDayBefore || 0) - todayCigarettes;
  const isImprovement = improvement > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-600 rounded-xl">
          <Cigarette className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            ¿Cuántos cigarrillos has fumado hoy?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Actualiza tu consumo diario para ver tu progreso real
          </p>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={todayCigarettes}
                  onChange={(e) => setTodayCigarettes(e.target.value)}
                  className="input-field text-2xl font-bold text-center"
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

          {/* Feedback visual */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-success-100 border border-success-300 rounded-lg"
            >
              <p className="text-success-700 font-semibold text-sm">
                ✓ Consumo actualizado correctamente
              </p>
            </motion.div>
          )}

          {/* Comparativa rápida */}
          {!showSuccess && (
            <div className="mt-4 flex items-center gap-3">
              {isImprovement ? (
                <div className="flex items-center gap-2 text-success-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {improvement} menos que tu consumo anterior ({userData.cigarettesPerDayBefore})
                  </span>
                </div>
              ) : improvement < 0 ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <span className="text-sm font-semibold">
                    {Math.abs(improvement)} más que ayer, pero no te desanimes 💪
                  </span>
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  Mismo consumo que antes
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyTracker;