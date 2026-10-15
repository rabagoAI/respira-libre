import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInMinutes } from 'date-fns';
import { calculateTimeSinceQuit, calculateDailySavings } from '../utils/calculations';
import { calculateRealSavings, getCurrentConsumption, getMovingAverage } from '../utils/dailyCalculations';
import { getAchievedBenefits, getNextBenefit, getTimeToNextBenefit, healthBenefits } from '../utils/healthBenefits';
import { getRecoverySystems, getReductionFactor, getNextBenefitProgress } from '../utils/recovery';
import { scrollToSection } from '../utils/scroll';
import BodyPanel from './BodyPanel';
import OverviewHeader from './OverviewHeader';
import SummaryCards from './SummaryCards';
import RecoveryAreas from './RecoveryAreas';
import CarePlan from './CarePlan';
import GoalsBanner from './GoalsBanner';
import HealthTimeline from './HealthTimeline';
import SavingsGoals from './SavingsGoals';
import SettingsModal from './SettingsModal';

// La gráfica (recharts) va en un chunk aparte para no engordar la carga inicial
const ConsumptionChart = lazy(() => import('./ConsumptionChart'));

const Dashboard = ({
  userData,
  onUpdateData,
  onReset,
  showSettings,
  onCloseSettings
}) => {
  const [selectedSystem, setSelectedSystem] = useState('respiratory');

  // Volver a renderizar cada minuto para refrescar contadores y totales
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Validación de seguridad (después de los hooks para no romper su orden)
  if (!userData || !userData.quitDate || !userData.packPrice) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    );
  }

  // Estadísticas derivadas de los datos: se calculan en cada render (son baratas)
  // en lugar de guardarlas en estado, así no se ven ceros al cargar
  const quitDate = new Date(userData.quitDate);
  const realSavings = calculateRealSavings(userData);
  const minutesSinceQuit = Math.max(differenceInMinutes(new Date(), quitDate), 0);
  const stats = {
    timeSinceQuit: calculateTimeSinceQuit(quitDate),
    minutesSinceQuit,
    moneySaved: realSavings.totalMoneySaved,
    cigarettesAvoided: realSavings.totalCigarettesAvoided,
    dailySavings: calculateDailySavings(
      userData.packPrice,
      userData.cigarettesPerPack,
      userData.cigarettesPerDayBefore,
      realSavings.averageDaily
    )
  };

  // Consumo reciente: media de los últimos 7 registros (o el último valor conocido)
  const recentConsumption = realSavings.daysTracked > 0
    ? getMovingAverage(userData.dailyLog, 7)
    : getCurrentConsumption(userData);
  const reductionFactor = getReductionFactor(userData.cigarettesPerDayBefore, recentConsumption);
  const systems = getRecoverySystems(minutesSinceQuit, reductionFactor);

  const achievedCount = getAchievedBenefits(minutesSinceQuit).length;
  const nextBenefit = getNextBenefit(minutesSinceQuit);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Panel principal */}
      <motion.section
        id="panel"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-panel scroll-mt-24 grid lg:grid-cols-12 gap-4 sm:gap-5 p-3 sm:p-5"
        aria-label="Panel de progreso"
      >
        <div className="lg:col-span-5">
          <BodyPanel
            systems={systems}
            selected={selectedSystem}
            onSelect={setSelectedSystem}
            achievedCount={achievedCount}
            totalBenefits={healthBenefits.length}
            onShowBenefits={() => scrollToSection('beneficios')}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 min-w-0">
          <div className="px-1 pt-1">
            <OverviewHeader
              nextBenefit={nextBenefit}
              timeToNext={getTimeToNextBenefit(minutesSinceQuit)}
              progress={getNextBenefitProgress(minutesSinceQuit) ?? 100}
            />
          </div>
          <SummaryCards
            stats={stats}
            reductionPercent={Math.round(reductionFactor * 100)}
            achievedCount={achievedCount}
            totalBenefits={healthBenefits.length}
            onShowReport={() => scrollToSection('evolucion')}
          />
          <RecoveryAreas systems={systems} selected={selectedSystem} onSelect={setSelectedSystem} />
          <CarePlan userData={userData} onUpdateData={onUpdateData} minutesSinceQuit={minutesSinceQuit} />
          <GoalsBanner
            moneySaved={stats.moneySaved}
            dailySavings={stats.dailySavings}
            onShowGoals={() => scrollToSection('objetivos')}
          />
        </div>
      </motion.section>

      {/* Evolución del consumo diario */}
      <div id="evolucion" className="scroll-mt-24 mt-10">
        <Suspense fallback={<div className="card mb-12 h-80 animate-pulse" aria-hidden="true" />}>
          <ConsumptionChart userData={userData} />
        </Suspense>
      </div>

      {/* Timeline de beneficios de salud */}
      <div id="beneficios" className="scroll-mt-24">
        <HealthTimeline minutesSinceQuit={stats.minutesSinceQuit} />
      </div>

      {/* Objetivos de ahorro */}
      <div id="objetivos" className="scroll-mt-24">
        <SavingsGoals
          moneySaved={stats.moneySaved}
          dailySavings={stats.dailySavings}
        />
      </div>

      {/* AnimatePresence aquí para que el modal anime también al cerrarse */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            key="settings"
            onClose={onCloseSettings}
            userData={userData}
            onSave={onUpdateData}
            onReset={onReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
