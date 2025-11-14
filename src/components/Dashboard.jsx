import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Cigarette, 
  Clock, 
  Euro,
  Heart,
  Target
} from 'lucide-react';
import {
  calculateTimeSinceQuit,
  calculateMoneySaved,
  calculateCigarettesAvoided,
  calculateDailySavings,
  formatCurrency
} from '../utils/calculations';
import { differenceInDays } from 'date-fns';
import HealthTimeline from './HealthTimeline';
import SavingsGoals from './SavingsGoals';

const Dashboard = ({ userData, onUpdateData }) => {
  const [stats, setStats] = useState({
    timeSinceQuit: { days: 0, hours: 0, minutes: 0 },
    moneySaved: 0,
    cigarettesAvoided: 0,
    dailySavings: 0,
    daysSinceQuit: 0
  });

  // Actualizar estadísticas cada minuto
  useEffect(() => {
    const updateStats = () => {
      const quitDate = new Date(userData.quitDate);
      const timeSinceQuit = calculateTimeSinceQuit(quitDate);
      let daysSinceQuit = differenceInDays(new Date(), quitDate);
      
      // Si es el mismo día, contar como 1 día para mostrar estadísticas
      if (daysSinceQuit === 0) {
        daysSinceQuit = 1;
      }
      
      const moneySaved = calculateMoneySaved(
        quitDate,
        userData.packPrice,
        userData.cigarettesPerPack,
        userData.cigarettesPerDayBefore,
        userData.cigarettesPerDayNow
      );
      const cigarettesAvoided = calculateCigarettesAvoided(
        quitDate,
        userData.cigarettesPerDayBefore,
        userData.cigarettesPerDayNow
      );
      const dailySavings = calculateDailySavings(
        userData.packPrice,
        userData.cigarettesPerPack,
        userData.cigarettesPerDayBefore,
        userData.cigarettesPerDayNow
      );

      setStats({
        timeSinceQuit,
        moneySaved,
        cigarettesAvoided,
        dailySavings,
        daysSinceQuit
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [userData]);

  const isCompletelyQuit = userData.cigarettesPerDayNow === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Título de bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          {isCompletelyQuit ? '¡Estás libre de humo!' : '¡Sigue así!'}
        </h2>
        <p className="text-lg text-slate-600">
          {isCompletelyQuit 
            ? 'Cada día sin fumar es una victoria. Este es tu progreso:'
            : `Has reducido tu consumo de ${userData.cigarettesPerDayBefore} a ${userData.cigarettesPerDayNow} cigarrillos al día`
          }
        </p>
      </motion.div>

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
              {userData.cigarettesPerDayBefore - userData.cigarettesPerDayNow} menos/día
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
    </div>
  );
};

export default Dashboard;