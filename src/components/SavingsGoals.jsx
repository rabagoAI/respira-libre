import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, Target } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDialog } from '../hooks/useDialog';
import { predefinedGoals, getCategories } from '../data/predefinedGoals';
import { calculateGoalProgress, formatCurrency } from '../utils/calculations';
import { getCategoryIcon } from '../utils/icons';
import RangeBar from './ui/RangeBar';
import StatusPill from './ui/StatusPill';

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
          <h3 className="!text-2xl md:!text-3xl !font-light text-slate-800 tracking-tight mb-2">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {goals.map((goal, index) => {
            const progress = calculateGoalProgress(
              moneySaved,
              goal.price,
              dailySavings
            );
            const percentage = parseFloat(progress.percentage);
            const isCompleted = percentage >= 100;
            const Icon = getCategoryIcon(goal.category);

            return (
              <motion.article
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(index, 6) * 0.05 }}
                className={`card !p-5 flex flex-col ${isCompleted ? '!border-success-300 ring-1 ring-success-200' : ''}`}
              >
                {/* Cabecera: categoría y eliminar */}
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center text-slate-700">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {goal.category}
                  </span>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    aria-label={`Eliminar objetivo ${goal.name}`}
                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Nombre y precio */}
                <h4 className="!text-lg font-semibold text-slate-800 mt-4">{goal.name}</h4>
                <p className="text-3xl font-light text-slate-900 tabular-nums mt-1">
                  {formatCurrency(goal.price)}
                </p>

                {/* Progreso */}
                <div className="mt-5">
                  <RangeBar
                    value={percentage}
                    startLabel={`${progress.percentage}%`}
                    endLabel={isCompleted ? 'Conseguido' : `faltan ${formatCurrency(progress.remaining)}`}
                  />
                </div>

                {/* Estado y estimación */}
                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-200/70">
                  <StatusPill variant={isCompleted ? 'done' : 'active'}>
                    {isCompleted ? 'Conseguido' : 'Ahorrando'}
                  </StatusPill>
                  {!isCompleted && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 text-right">
                      <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {progress.daysRemaining > 0
                        ? `~${progress.daysRemaining} ${progress.daysRemaining === 1 ? 'día' : 'días'}`
                        : 'Reduce tu consumo para estimarlo'}
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12 mb-12">
          <span className="mx-auto w-14 h-14 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center text-slate-600">
            <Target className="w-6 h-6" aria-hidden="true" />
          </span>
          <h4 className="!text-xl font-semibold text-slate-800 mt-4 mb-2">
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
                  {filteredPredefinedGoals.map((goal) => {
                    const Icon = getCategoryIcon(goal.category);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => addGoal(goal)}
                        className="text-left p-4 rounded-2xl border border-slate-200 bg-white/70 hover:border-primary-300 hover:bg-white hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-primary-600 transition-colors">
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </span>
                          {goal.popular && (
                            <span className="rounded-full border-[1.5px] border-amber-300 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              Popular
                            </span>
                          )}
                        </div>
                        <h5 className="font-semibold text-slate-900 mt-3 mb-1 group-hover:text-primary-700 transition-colors">
                          {goal.name}
                        </h5>
                        <p className="!text-sm !text-slate-500 mb-2">{goal.description}</p>
                        <p className="text-lg font-light text-slate-900 tabular-nums">
                          {formatCurrency(goal.price)}
                        </p>
                      </button>
                    );
                  })}
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