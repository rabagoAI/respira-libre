import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import Hero from './components/Hero';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import { toLocalDateString } from './utils/dates';

function App() {
  // Estado principal de la aplicación
  const [userData, setUserData] = useLocalStorage('respiraLibre_userData', null);
  const [showSettings, setShowSettings] = useState(false);

  // Maneja el envío del formulario de inicio
  const handleStartJourney = (formData) => {
    const today = toLocalDateString();
    const journeyData = {
      ...formData,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      dailyLog: {
        [today]: formData.cigarettesPerDayNow
      }
    };
    
    setUserData(journeyData);
    // El formulario está más abajo que la portada: empezar el panel desde arriba
    window.scrollTo({ top: 0 });
  };

  // Reinicia completamente la aplicación
  const handleReset = () => {
    // Borrar datos de usuario
    setUserData(null);
    
    // Borrar objetivos guardados
    localStorage.removeItem('respiraLibre_goals');
    
    // Mostrar formulario inicial
    setShowSettings(false);
  };

  return (
    // reducedMotion="user": sin animaciones si el sistema pide reducir movimiento
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        {/* Fondo decorativo común (la portada pone encima su propio fondo oscuro) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-[#e6edf7] to-[#d5e1f0]" />
          <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary-300/30 blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-indigo-300/25 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-success-200/30 blur-3xl" />
        </div>

        {/* Con datos: barra del panel; sin datos: portada */}
        {userData ? (
          <TopBar userData={userData} onOpenSettings={() => setShowSettings(true)} />
        ) : (
          <Hero />
        )}

        {/* Sin datos se muestra el formulario (también si se borran desde otra pestaña) */}
        {!userData ? (
          <OnboardingForm onSubmit={handleStartJourney} />
        ) : (
          <Dashboard
            userData={userData}
            onUpdateData={setUserData}
            onReset={handleReset}
            showSettings={showSettings}
            onCloseSettings={() => setShowSettings(false)}
          />
        )}

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;