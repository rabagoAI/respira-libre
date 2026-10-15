import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDialog } from '../hooks/useDialog';
import { predefinedGoals, getCategories } from '../data/predefinedGoals';
import { calculateGoalProgress, formatCurrency } from '../utils/calculations';

const SavingsGoals = ({ moneySaved, dailySavings }) => {
  const [goals, setGoals] = useLocalStorage('respiraLibre_goals', []);
  const [showAddModal, setShowAddModal] = useState(false);
  const idPrefix = useId();
  const addDialogRef = useDialog(() => setShowAddModal(false), showAddModal);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customGoal, setCustomGoal] = useState({ name: '', price: '' });

  const categories = ['all', ...getCategories()];

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      addedAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    setCustomGoal({ name: '', price: '' });
  };

  const removeGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const addCustomGoal = () => {
    if (customGoal.name && customGoal.price > 0) {
      addGoal({
        name: customGoal.name,
        price: parseFloat(customGoal.price),
        image: '🎯',
        category: 'Personalizado'
      });
    }
  };

  const filteredPredefinedGoals = selectedCategory === 'all'
    ? predefinedGoals
    : predefinedGoals.filter(g => g.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Objetivos de ahorro
          </h3>
          <p className="text-slate-600">
            Define metas y ve cómo te acercas a ellas con tu ahorro
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Añadir objetivo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Añadir objetivo</span>
        </button>
      </div>

      {/* Objetivos activos */}
      {goals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {goals.map((goal) => {
            const progress = calculateGoalProgress(
              moneySaved,
              goal.price,
              dailySavings
            );
            const isCompleted = parseFloat(progress.percentage) >= 100;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`card relative overflow-hidden ${
                  isCompleted ? 'border-2 border-success-400 bg-gradient-to-br from-success-50 to-green-50' : ''
                }`}
              >
                {/* Botón eliminar */}
                <button
                  onClick={() => removeGoal(goal.id)}
                  aria-label={`Eliminar objetivo ${goal.name}`}
                  className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" aria-hidden="true" />
                </button>

                {/* Icono y título */}
                <div className="mb-4">
                  <div className="text-5xl mb-3">{goal.image}</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1 pr-8">
                    {goal.name}
                  </h4>
                  <p className="text-sm text-slate-500">{goal.category}</p>
                </div>

                {/* Precio objetivo */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">Objetivo</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(goal.price)}
                  </p>
                </div>

                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {progress.percentage}%
                    </span>
                    <span className="text-sm text-slate-500">
                      {isCompleted ? '¡Conseguido!' : formatCurrency(progress.remaining) + ' restantes'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-success-400 to-success-600' 
                          : 'bg-gradient-to-r from-primary-400 to-primary-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Días restantes */}
                {!isCompleted && progress.daysRemaining > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Llegarás en aproximadamente {progress.daysRemaining} {progress.daysRemaining === 1 ? 'día' : 'días'}
                    </span>
                  </div>
                )}

                {!isCompleted && progress.daysRemaining === null && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Reduce tu consumo para estimar cuándo llegarás
                    </span>
                  </div>
                )}

                {isCompleted && (
                  <div className="text-center py-2">
                    <span className="text-2xl">🎉</span>
                    <p className="text-success-600 font-semibold mt-1">
                      ¡Meta alcanzada!
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12 mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">
            Aún no tienes objetivos
          </h4>
          <p className="text-slate-600 mb-6">
            Define tus metas y visualiza cómo tu ahorro te acerca a ellas
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary mx-auto"
          >
            Añadir mi primer objetivo
          </button>
        </div>
      )}

      {/* Modal para añadir objetivos */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              ref={addDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${idPrefix}-title`}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header del modal */}
              <div className="p-6 border-b border-slate-200">
                <h3 id={`${idPrefix}-title`} className="text-2xl font-bold text-slate-900">
                  Añadir objetivo de ahorro
                </h3>
                <p className="text-slate-600 mt-1">
                  Elige un objetivo predefinido o crea uno personalizado
                </p>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 overflow-y-auto flex-1 min-h-0">
                {/* Objetivo personalizado */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h4 className="font-bold text-lg text-slate-900 mb-4">
                    Crear objetivo personalizado
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`${idPrefix}-name`} className="block text-sm font-semibold text-slate-700 mb-2">
                        Nombre del objetivo
                      </label>
                      <input
                        id={`${idPrefix}-name`}
                        type="text"
                        value={customGoal.name}
                        onChange={(e) => setCustomGoal({ ...customGoal, name: e.target.value })}
                        placeholder="Ej: Viaje a Japón"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${idPrefix}-price`} className="block text-sm font-semibold text-slate-700 mb-2">
                        Precio (€)
                      </label>
                      <input
                        id={`${idPrefix}-price`}
                        type="number"
                        value={customGoal.price}
                        onChange={(e) => setCustomGoal({ ...customGoal, price: e.target.value })}
                        placeholder="1500"
                        min="0"
                        step="0.01"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addCustomGoal}
                    disabled={!customGoal.name || !customGoal.price}
                    className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Añadir objetivo personalizado
                  </button>
                </div>

                {/* Filtro por categorías */}
                <div className="mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'Todos' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Objetivos predefinidos */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredPredefinedGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => addGoal(goal)}
                      className="text-left p-4 rounded-xl border-2 border-slate-200 hover:border-primary-400 hover:shadow-lg transition-all group"
                    >
                      <div className="text-4xl mb-2">{goal.image}</div>
                      <h5 className="font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {goal.name}
                      </h5>
                      <p className="text-sm text-slate-500 mb-2">{goal.description}</p>
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(goal.price)}
                      </p>
                      {goal.popular && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer del modal */}
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary w-full"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SavingsGoals;