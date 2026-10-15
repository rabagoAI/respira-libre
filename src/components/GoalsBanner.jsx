import { motion } from 'framer-motion';
import { ChevronRight, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

/**
 * Banner inferior que lleva a los objetivos de ahorro
 */
const GoalsBanner = ({ moneySaved, dailySavings, onShowGoals }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="theme-fixed relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-primary-800 to-primary-700 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="absolute -right-10 -top-16 w-48 h-48 rounded-full bg-primary-400/30 blur-2xl" aria-hidden="true" />
      <motion.div
        className="relative shrink-0 w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <PiggyBank className="w-7 h-7 text-success-300" />
      </motion.div>
      <div className="relative flex-1">
        <p className="font-semibold">Convierte tu ahorro en recompensas</p>
        <p className="text-sm text-primary-100 mt-0.5">
          {dailySavings > 0
            ? <>Llevas {formatCurrency(moneySaved)} y sumas {formatCurrency(dailySavings)} cada día. Ponle un objetivo.</>
            : <>Llevas {formatCurrency(moneySaved)} ahorrados. Ponle un objetivo para motivarte.</>}
        </p>
      </div>
      <button
        type="button"
        onClick={onShowGoals}
        className="relative self-start sm:self-auto inline-flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 px-4 py-2 text-sm font-medium transition-colors"
      >
        Ver mis objetivos
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default GoalsBanner;
