import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getChartData, getTrendStats } from '../utils/dailyCalculations';
import { parseLocalDate } from '../utils/dates';

// Colores del tema (tailwind.config.cjs)
const COLORS = {
  free: '#22c55e',      // success-500: día sin fumar
  reduced: '#0ea5e9',   // primary-500: por debajo del consumo anterior
  above: '#f97316',     // orange-500: igual o por encima del consumo anterior
  before: '#f97316',
  grid: '#e2e8f0',
  axis: '#64748b'
};

const TREND_INFO = {
  improving: { icon: TrendingDown, text: 'Mejorando', className: 'bg-success-100 text-success-700' },
  worsening: { icon: TrendingUp, text: 'Empeorando', className: 'bg-orange-100 text-orange-700' },
  stable: { icon: Minus, text: 'Estable', className: 'bg-slate-100 text-slate-700' }
};

const getBarColor = (value, before) => {
  if (value === 0) return COLORS.free;
  return value < before ? COLORS.reduced : COLORS.above;
};

const formatShortDate = (date) => format(parseLocalDate(date), 'd MMM', { locale: es });

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { date, value } = payload[0].payload;
  if (value === null) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-sm">
      <p className="font-semibold text-slate-900">
        {format(parseLocalDate(date), "EEEE d 'de' MMMM", { locale: es })}
      </p>
      <p className="text-slate-600">
        {value === 0 ? '¡Sin fumar! 🎉' : `${value} ${value === 1 ? 'cigarrillo' : 'cigarrillos'}`}
      </p>
    </div>
  );
};

const ConsumptionChart = ({ userData }) => {
  const data = getChartData(userData.dailyLog, userData.quitDate, 30);
  const loggedDays = data.filter(d => d.value !== null).length;
  const trend = TREND_INFO[getTrendStats(userData.dailyLog).trend];
  const before = userData.cigarettesPerDayBefore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="card mb-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="!text-lg !font-normal text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          Tu consumo {data.length > 1 ? `de los últimos ${data.length} días` : 'de hoy'}
        </h3>
        {trend && (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${trend.className}`}>
            <trend.icon className="w-4 h-4" />
            {trend.text} (últimos 7 registros)
          </span>
        )}
      </div>

      {loggedDays === 0 ? (
        <p className="text-center text-slate-500 py-12">
          Registra tu consumo diario para ver aquí tu evolución
        </p>
      ) : (
        <>
          <div className="h-64" role="img" aria-label={`Gráfica de consumo diario con ${loggedDays} días registrados`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  tick={{ fontSize: 12, fill: COLORS.axis }}
                  tickLine={false}
                  axisLine={{ stroke: COLORS.grid }}
                  interval="preserveStartEnd"
                  minTickGap={16}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, (max) => Math.max(max, before)]}
                  tick={{ fontSize: 12, fill: COLORS.axis }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <ReferenceLine
                  y={before}
                  stroke={COLORS.before}
                  strokeDasharray="6 4"
                  label={{ value: `Antes: ${before}`, position: 'insideTopRight', fill: COLORS.before, fontSize: 12 }}
                />
                {/* minPointSize hace visibles los días con 0 cigarrillos (no los días sin registro) */}
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  minPointSize={(value) => (value === 0 ? 4 : 0)}
                  maxBarSize={32}
                >
                  {data.map((entry) => (
                    <Cell key={entry.date} fill={getBarColor(entry.value, before)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: COLORS.free }} /> Sin fumar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: COLORS.reduced }} /> Menos que antes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: COLORS.above }} /> Igual o más que antes
            </span>
            <span className="text-slate-400">Los días sin registro aparecen vacíos</span>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ConsumptionChart;
