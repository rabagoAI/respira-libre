import { CircleCheck, LoaderCircle, Circle } from 'lucide-react';

const VARIANTS = {
  done: { icon: CircleCheck, className: 'border-success-400 text-success-700 bg-success-50/70' },
  active: { icon: LoaderCircle, className: 'border-sky-400 text-sky-700 bg-sky-50/70' },
  pending: { icon: Circle, className: 'border-slate-300 text-slate-500 bg-white/60' }
};

/**
 * Etiqueta de estado con borde (Conseguido / En curso / Pendiente)
 * @param {'done'|'active'|'pending'} variant - Estado
 * @param {string} children - Texto
 */
const StatusPill = ({ variant, children }) => {
  const { icon: Icon, className } = VARIANTS[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-2.5 py-1 text-xs font-semibold ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${variant === 'active' ? 'animate-spin [animation-duration:3s]' : ''}`} aria-hidden="true" />
      {children}
    </span>
  );
};

export default StatusPill;
