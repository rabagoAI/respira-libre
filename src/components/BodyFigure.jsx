import { useId } from 'react';
import { motion } from 'framer-motion';
import { getHeatColor } from '../utils/recovery';

// Mitad izquierda del cuerpo (vista frontal); la derecha es su reflejo
const HALF_BODY =
  'M100 72 L91 73 L90 86 C78 88 64 90 56 98 C48 106 46 120 45 136 L40 190 ' +
  'C38 210 34 232 31 252 C29 262 27 272 30 279 C34 284 39 278 40 269 L45 240 ' +
  'C48 220 52 202 55 188 L59 130 C61 150 63 170 65 188 C63 206 59 224 61 246 ' +
  'C63 290 66 330 68 362 C70 386 70 400 70 414 C68 422 74 429 86 429 ' +
  'C93 429 93 420 90 412 C90 380 92 340 94 300 C95 286 97 274 100 270 Z';

// Recorrido de los vasos sanguíneos (mitad izquierda)
const HALF_VESSELS = [
  'M104 138 C96 124 84 106 66 102 C56 110 52 140 49 170 C46 200 40 230 36 262',
  'M104 146 C102 180 100 210 92 246 C86 280 84 320 82 360 C81 384 80 400 80 414'
];

// Posición de cada sistema en la figura (coordenadas del viewBox)
const ORGAN_SPOTS = {
  respiratory: { x: 100, y: 136, r: 42 },
  cardio: { x: 108, y: 140, r: 20 },
  circulation: { x: 46, y: 200, r: 26 },
  wellbeing: { x: 100, y: 36, r: 24 }
};

const mirror = 'translate(200 0) scale(-1 1)';

// Transición suave cuando cambia la puntuación (y con ella el color)
const COLOR_TRANSITION = { transition: 'stop-color 1.2s ease, fill 1.2s ease, stroke 1.2s ease' };

/**
 * Figura del cuerpo con los órganos coloreados según su recuperación
 * @param {Array} systems - Resultado de getRecoverySystems
 * @param {string|null} selected - Sistema seleccionado
 * @param {Function} onSelect - Se llama con el id del sistema pulsado
 * @param {boolean} interactive - false para usarla como ilustración (portada)
 */
const BodyFigure = ({ systems, selected = null, onSelect, interactive = true }) => {
  const id = useId().replace(/:/g, '');
  const byId = Object.fromEntries(systems.map(s => [s.id, s]));

  // Atributos comunes para que cada órgano funcione como botón accesible
  const organProps = (systemId) => {
    if (!interactive) return { style: { transformBox: 'fill-box', transformOrigin: 'center' } };
    const system = byId[systemId];
    return {
      role: 'button',
      tabIndex: 0,
      'aria-label': `${system.organ}: ${system.score} de 100, ${system.label}`,
      'aria-pressed': selected === systemId,
      onClick: () => onSelect(systemId),
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(systemId);
        }
      },
      className: 'cursor-pointer outline-none focus-visible:[&>*]:stroke-primary-500',
      style: { transformBox: 'fill-box', transformOrigin: 'center' }
    };
  };

  const selectedSpot = selected ? ORGAN_SPOTS[selected] : null;
  const selectedSystem = selected ? byId[selected] : null;

  return (
    <motion.svg
      viewBox="0 0 200 470"
      className="w-full h-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      role={interactive ? 'group' : 'img'}
      aria-label={interactive
        ? 'Figura del cuerpo con el estado de recuperación de cada sistema'
        : 'Ilustración de un cuerpo humano recuperándose al dejar de fumar'}
    >
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="35%" stopColor="#b8c6d8" />
          <stop offset="75%" stopColor="#7b8ca3" />
          <stop offset="100%" stopColor="#4b5b72" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.38" cy="0.22" r="0.45">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {systems.map(system => (
          <radialGradient key={system.id} id={`${id}-heat-${system.id}`}>
            {/* Núcleo más claro y cálido, como un mapa de calor */}
            <stop offset="0%" stopColor={getHeatColor(Math.min(system.score + 18, 100), 62)} stopOpacity="1" style={COLOR_TRANSITION} />
            <stop offset="45%" stopColor={getHeatColor(system.score, 54)} stopOpacity="0.8" style={COLOR_TRANSITION} />
            <stop offset="100%" stopColor={getHeatColor(system.score, 50)} stopOpacity="0" style={COLOR_TRANSITION} />
          </radialGradient>
        ))}
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}-shadow`} x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={HALF_BODY} />
          <path d={HALF_BODY} transform={mirror} />
          <ellipse cx="100" cy="42" rx="21" ry="27" />
        </clipPath>
      </defs>

      {/* Plataforma con anillos */}
      <g transform="translate(100 440)">
        <ellipse rx="70" ry="14" fill="#0f172a" opacity="0.08" />
        <motion.ellipse
          rx="62" ry="12" fill="none" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="4 6"
          animate={{ strokeDashoffset: [0, -40] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <ellipse rx="44" ry="8" fill="none" stroke="#94a3b8" strokeOpacity="0.5" strokeWidth="1" />
      </g>

      {/* Silueta */}
      <g filter={`url(#${id}-shadow)`}>
        <path d={HALF_BODY} fill={`url(#${id}-skin)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
        <path d={HALF_BODY} transform={mirror} fill={`url(#${id}-skin)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
        <ellipse cx="100" cy="42" rx="21" ry="27" fill={`url(#${id}-skin)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
      </g>

      <g clipPath={`url(#${id}-clip)`}>
        {/* Brillo y líneas anatómicas */}
        <rect x="0" y="0" width="200" height="440" fill={`url(#${id}-shine)`} opacity="0.35" />
        <g fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round">
          <path d="M70 104 C82 116 92 118 100 118 C108 118 118 116 130 104" />
          <path d="M100 120 L100 246" />
          <path d="M86 170 C92 172 108 172 114 170 M86 194 C92 196 108 196 114 194 M88 218 C94 220 106 220 112 218" />
          <path d="M76 252 C84 262 92 268 100 270 C108 268 116 262 124 252" />
          <path d="M80 330 C82 340 84 346 86 352 M120 330 C118 340 116 346 114 352" />
        </g>

        {/* Calor de cada sistema */}
        {systems.map(system => {
          const spot = ORGAN_SPOTS[system.id];
          return (
            <motion.circle
              key={system.id}
              cx={spot.x}
              cy={spot.y}
              r={spot.r}
              fill={`url(#${id}-heat-${system.id})`}
              filter={`url(#${id}-blur)`}
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.94, 1.06, 0.94] }}
              transition={{ duration: 3 + system.score / 50, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          );
        })}
        {/* La circulación se ve también en el otro brazo */}
        <motion.circle
          cx={200 - ORGAN_SPOTS.circulation.x}
          cy={ORGAN_SPOTS.circulation.y}
          r={ORGAN_SPOTS.circulation.r}
          fill={`url(#${id}-heat-circulation)`}
          filter={`url(#${id}-blur)`}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Vasos sanguíneos con flujo animado */}
        <g {...organProps('circulation')}>
          {[...HALF_VESSELS.map(d => ({ d })), ...HALF_VESSELS.map(d => ({ d, transform: mirror }))].map((vessel, i) => (
            <g key={i} transform={vessel.transform}>
              {/* Trazo ancho e invisible para que sea fácil pulsar */}
              <path d={vessel.d} fill="none" stroke="transparent" strokeWidth="10" />
              <motion.path
                d={vessel.d}
                fill="none"
                stroke={getHeatColor(byId.circulation.score, 50)}
                style={COLOR_TRANSITION}
                strokeWidth={selected === 'circulation' ? 2.4 : 1.6}
                strokeLinecap="round"
                strokeDasharray="3 7"
                strokeOpacity="0.85"
                animate={{ strokeDashoffset: [0, -40] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </g>
          ))}
        </g>

        {/* Pulmones que "respiran" */}
        <motion.g
          {...organProps('respiratory')}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M100 86 L100 104 M100 104 L92 112 M100 104 L108 112" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
          {['M96 106 C84 102 75 112 73 128 C71 146 73 160 80 165 C88 167 95 160 96 150 Z',
            'M104 106 C116 102 125 112 127 128 C129 146 127 160 120 165 C112 167 105 160 104 150 Z'].map(d => (
            <path
              key={d}
              d={d}
              fill={getHeatColor(byId.respiratory.score, 60)}
              style={COLOR_TRANSITION}
              fillOpacity="0.35"
              stroke="#ffffff"
              strokeOpacity={selected === 'respiratory' ? 0.95 : 0.6}
              strokeWidth={selected === 'respiratory' ? 1.8 : 1}
            />
          ))}
        </motion.g>

        {/* Corazón que late */}
        <motion.g
          {...organProps('cardio')}
          animate={{ scale: [1, 1.18, 1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M108 148 C99 141 97 134 101 131 C104 128 108 130 108 134 C108 130 112 128 115 131 C119 134 117 141 108 148 Z"
            fill={getHeatColor(byId.cardio.score, 55)}
            style={COLOR_TRANSITION}
            stroke="#ffffff"
            strokeOpacity={selected === 'cardio' ? 0.95 : 0.7}
            strokeWidth={selected === 'cardio' ? 1.6 : 0.8}
          />
        </motion.g>

        {/* Cerebro */}
        <g {...organProps('wellbeing')}>
          <ellipse
            cx="100" cy="34" rx="14" ry="11"
            fill={getHeatColor(byId.wellbeing.score, 62)}
            style={COLOR_TRANSITION}
            fillOpacity="0.35"
            stroke="#ffffff"
            strokeOpacity={selected === 'wellbeing' ? 0.95 : 0.6}
            strokeWidth={selected === 'wellbeing' ? 1.6 : 0.8}
          />
          <path d="M100 24 L100 44 M92 30 C95 33 95 37 92 40 M108 30 C105 33 105 37 108 40" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />
        </g>
      </g>

      {/* Marcador del sistema seleccionado */}
      {selectedSpot && selectedSystem && (
        <g pointerEvents="none">
          <motion.circle
            key={selected}
            cx={selectedSpot.x}
            cy={selectedSpot.y}
            r={selectedSpot.r * 0.75}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 }, rotate: { duration: 12, repeat: Infinity, ease: 'linear' } }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          {/* El transform va en un <g> aparte: framer-motion sobrescribe el del elemento animado */}
          <g transform={`translate(${selectedSpot.x + selectedSpot.r * 0.6} ${selectedSpot.y - 6})`}>
            <motion.g
              key={`${selected}-label`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <rect x="0" y="-11" width="74" height="22" rx="11" fill="#0f172a" fillOpacity="0.8" />
              <circle cx="11" cy="0" r="4" fill={getHeatColor(selectedSystem.score)} />
              <text x="20" y="4" fontSize="10" fontWeight="600" fill="#ffffff">
                {selectedSystem.score}/100
              </text>
            </motion.g>
          </g>
        </g>
      )}
    </motion.svg>
  );
};

export default BodyFigure;
