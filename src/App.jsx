import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import Hero from './components/Hero';
import TopBar from './components/TopBar';
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

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Respira Libre</h3>
                <p className="text-slate-400">
                  Tu compañero en el camino hacia una vida sin humo. 
                  Cada día cuenta, cada decisión importa.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Recursos</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="https://www.who.int/es" target="_blank" rel="noopener noreferrer" 
                       className="hover:text-white transition-colors">
                      Organización Mundial de la Salud
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cdc.gov/tobacco/quit_smoking/index.htm" target="_blank" rel="noopener noreferrer"
                       className="hover:text-white transition-colors">
                      CDC - Dejar de fumar
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Ayuda</h4>
                <p className="text-slate-400 text-sm mb-2">
                  Si necesitas apoyo profesional, contacta con tu médico o llama a:
                </p>
                <p className="text-white font-semibold">
                  Teléfono Nacional de Ayuda: 900 850 000
                </p>
              </div>
            </div>
            
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; {new Date().getFullYear()} Respira Libre. Proyecto educativo para ayudar a dejar de fumar.</p>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;