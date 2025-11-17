import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Cigarette, 
  Clock, 
  Euro,
  Heart,
  Settings
} from 'lucide-react';
import {
  calculateTimeSinceQuit,
  calculateDailySavings,
  formatCurrency
} from '../utils/calculations';
import { calculateRealSavings, getMovingAverage, getTrendStats } from '../utils/dailyCalculations';
import { differenceInDays } from 'date-fns';
import HealthTimeline from './HealthTimeline';
import SavingsGoals from './SavingsGoals';
import SettingsModal from './SettingsModal';
import DailyTracker from './DailyTracker';

const Dashboard = ({ userData, onUpdateData, onReset }) => {
  const [stats, setStats] = useState({
    timeSinceQuit: { days: 0, hours: 0, minutes: 0 },
    moneySaved: 0,
    cigarettesAvoided: 0,
    dailySavings: 0,
    daysSinceQuit: 0
  });
  const [showSettings, setShowSettings] = useState(false);

  // Validación de seguridad
  if (!userData || !userData.quitDate || !userData.packPrice) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    );
  }

  // Actualizar estadísticas cada minuto
  useEffect(() => {
    if (!userData?.quitDate) return;
    
    const updateStats = () => {
      const quitDate = new Date(userData.quitDate);
      const timeSinceQuit = calculateTimeSinceQuit(quitDate);
      let daysSinceQuit = differenceInDays(new Date(), quitDate);
      
      // Si es el mismo día, contar como 1 día para mostrar estadísticas
      if (daysSinceQuit === 0) {
        daysSinceQuit = 1;
      }
      
      // Usar cálculos reales basados en registro diario
      const realSavings = calculateRealSavings(userData);
      
      const dailySavings = calculateDailySavings(
        userData.packPrice,
        userData.cigarettesPerPack,
        userData.cigarettesPerDayBefore,
        realSavings.averageDaily
      );

      setStats({
        timeSinceQuit,
        moneySaved: realSavings.totalMoneySaved,
        cigarettesAvoided: realSavings.totalCigarettesAvoided,
        dailySavings,
        daysSinceQuit,
        averageDaily: realSavings.averageDaily,
        daysTracked: realSavings.daysTracked
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [userData]);

  const isCompletelyQuit = userData.cigarettesPerDayNow === 0;
  const movingAverage = getMovingAverage(userData.dailyLog, 7);
  const trendStats = getTrendStats(userData.dailyLog);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Título de bienvenida con botón de configuración */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <button
          onClick={() => setShowSettings(true)}
          className="absolute right-0 top-0 p-3 hover:bg-slate-100 rounded-xl transition-colors group"
          title="Editar configuración"
        >
          <Settings className="w-6 h-6 text-slate-400 group-hover:text-primary-600 group-hover:rotate-90 transition-all duration-300" />
        </button>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          {isCompletelyQuit ? '¡Estás libre de humo!' : '¡Sigue así!'}
        </h2>
        <p className="text-lg text-slate-600">
          {stats.daysTracked > 0 
            ? `Promedio últimos 7 días: ${movingAverage} cigarrillos/día`
            : `Has reducido tu consumo de ${userData.cigarettesPerDayBefore} a ${userData.cigarettesPerDayNow} cigarrillos al día`
          }
        </p>
      </motion.div>

      {/* Tracker diario */}
      <DailyTracker userData={userData} onUpdateDaily={onUpdateData} />

      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Tiempo sin fumar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Tiempo libre</h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-slate-900">
              {stats.timeSinceQuit.days}
              <span className="text-lg font-normal text-slate-500 ml-2">días</span>
            </p>
            <p className="text-sm text-slate-500">
              {stats.timeSinceQuit.hours}h {stats.timeSinceQuit.minutes}m
            </p>
          </div>
        </motion.div>

        {/* Dinero ahorrado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-success-100 rounded-xl">
              <Euro className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Dinero ahorrado</h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-success-600">
              {formatCurrency(stats.moneySaved)}
            </p>
            <p className="text-sm text-slate-500">
              {formatCurrency(stats.dailySavings)}/día
            </p>
          </div>
        </motion.div>

        {/* Cigarrillos evitados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Cigarette className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Cigarrillos evitados</h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-slate-900">
              {stats.cigarettesAvoided.toLocaleString('es-ES')}
            </p>
            <p className="text-sm text-slate-500">
              {stats.averageDaily ? `Promedio: ${stats.averageDaily}/día` : `${userData.cigarettesPerDayBefore - userData.cigarettesPerDayNow} menos/día`}
            </p>
          </div>
        </motion.div>

        {/* Mejora de salud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stat-card bg-gradient-to-br from-pink-50 to-red-50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-700">Tu salud mejora</h3>
          </div>
          <p className="text-sm text-slate-600">
            Tu cuerpo se está recuperando día a día
          </p>
        </motion.div>
      </div>

      {/* Comparativa visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card mb-12"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Tu reducción de consumo
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Antes */}
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Antes</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-orange-100 rounded-full h-8 flex items-center px-4">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-orange-600 min-w-[60px]">
                {userData.cigarettesPerDayBefore}
              </span>
            </div>
            <p className="text-xs text-slate-500">cigarrillos al día</p>
          </div>

          {/* Ahora */}
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Ahora</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-success-100 rounded-full h-8 flex items-center px-4">
                <div 
                  className="bg-success-500 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(userData.cigarettesPerDayNow / userData.cigarettesPerDayBefore) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-success-600 min-w-[60px]">
                {userData.cigarettesPerDayNow}
              </span>
            </div>
            <p className="text-xs text-slate-500">cigarrillos al día</p>
          </div>
        </div>

        {/* Porcentaje de reducción */}
        <div className="mt-6 text-center p-4 bg-gradient-to-r from-success-50 to-primary-50 rounded-xl">
          <p className="text-sm text-slate-600 mb-1">Has reducido tu consumo en</p>
          <p className="text-3xl font-bold text-success-600">
            {(((userData.cigarettesPerDayBefore - userData.cigarettesPerDayNow) / userData.cigarettesPerDayBefore) * 100).toFixed(0)}%
          </p>
        </div>
      </motion.div>

      {/* Timeline de beneficios de salud */}
      <HealthTimeline daysSinceQuit={stats.daysSinceQuit} />

      {/* Objetivos de ahorro */}
      <SavingsGoals 
        moneySaved={stats.moneySaved}
        dailySavings={stats.dailySavings}
      />

      <SettingsModal
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  userData={userData}
  onSave={onUpdateData}
  onReset={onReset}  // ← Esta línea debe estar
/>
    </div>
  );
};

export default Dashboard;