import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { 
  getAchievedBenefits, 
  getNextBenefit, 
  getTimeToNextBenefit 
} from '../utils/healthBenefits';

const HealthTimeline = ({ minutesSinceQuit }) => {
  const achievedBenefits = getAchievedBenefits(minutesSinceQuit);
  const nextBenefit = getNextBenefit(minutesSinceQuit);
  const timeToNext = getTimeToNextBenefit(minutesSinceQuit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-12"
    >
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Beneficios para tu salud
        </h3>
        <p className="text-slate-600">
          Tu cuerpo se recupera día a día. Estos son los hitos que has alcanzado:
        </p>
      </div>

      {/* Siguiente beneficio */}
      {nextBenefit && timeToNext && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-600 mb-1">
                Próximo beneficio en {timeToNext.value} {timeToNext.unit}
              </p>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {nextBenefit.icon} {nextBenefit.title}
              </h4>
              <p className="text-slate-600">
                {nextBenefit.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de beneficios alcanzados */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievedBenefits.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 mb-2">
              Aún no has alcanzado ningún beneficio, pero el primero está muy cerca
            </p>
            <p className="text-sm text-slate-400">
              ¡Los primeros cambios positivos ocurren en solo 20 minutos!
            </p>
          </div>
        ) : (
          [...achievedBenefits].reverse().map((benefit, index) => (
            <motion.div
              key={benefit.minutes ?? `d${benefit.days}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-5 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{benefit.icon}</div>
                <CheckCircle className="w-5 h-5 text-success-500" />
              </div>
              
              <h4 className={`font-bold text-lg mb-2 ${benefit.color}`}>
                {benefit.title}
              </h4>
              
              <p className="text-sm text-slate-600 mb-3">
                {benefit.description}
              </p>
              
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {benefit.minutes 
                    ? `Alcanzado a los ${benefit.minutes} minutos`
                    : `Alcanzado a los ${benefit.days} ${benefit.days === 1 ? 'día' : 'días'}`
                  }
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Mensaje motivacional si alcanzó todos */}
      {!nextBenefit && achievedBenefits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 mt-8 text-center"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Felicidades!
          </h4>
          <p className="text-slate-600">
            Has alcanzado todos los hitos principales de recuperación. 
            Sigue así, tu cuerpo te lo agradece cada día.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HealthTimeline;