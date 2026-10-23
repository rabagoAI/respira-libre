import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Phone, ExternalLink, ShieldAlert } from 'lucide-react';
import { HEALTH_SOURCES } from '../utils/healthBenefits';
import PrivacyModal from './PrivacyModal';

// Línea gratuita de la Asociación Española Contra el Cáncer (verificada en octubre de 2026)
const HELP_LINE = {
  name: 'Infocáncer · Asociación Española Contra el Cáncer',
  phone: '900 100 036',
  tel: '+34900100036',
  hours: 'Gratuito, 24 horas',
  url: 'https://www.contraelcancer.es/es/todo-sobre-cancer/prevencion-cancer/no-fumes/dejar-fumar'
};

const ExternalLinkItem = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
  >
    {children}
    <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
    <span className="sr-only">(se abre en una pestaña nueva)</span>
  </a>
);

/**
 * Pie de página: ayuda profesional, fuentes sanitarias y aviso legal
 */
const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="mt-20 px-3 sm:px-6 lg:px-8 pb-24 sm:pb-24">
      <div className="theme-fixed max-w-7xl mx-auto rounded-[36px] bg-[#0b1d42] text-white overflow-hidden relative">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative grid md:grid-cols-3 gap-10 p-8 sm:p-10">
          <div>
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="w-8 h-8" />
              <span className="font-semibold">Respira <span className="text-success-300">Libre</span></span>
            </div>
            <p className="!text-sm !text-slate-300 mt-4 leading-relaxed">
              Tu compañero en el camino hacia una vida sin humo. Cada día cuenta, cada decisión importa.
            </p>
          </div>

          <div>
            <h4 className="!text-sm font-semibold uppercase tracking-wider text-slate-400">Fuentes sanitarias</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {Object.values(HEALTH_SOURCES).map(source => (
                <li key={source.url}>
                  <ExternalLinkItem href={source.url}>{source.name}</ExternalLinkItem>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="!text-sm font-semibold uppercase tracking-wider text-slate-400">¿Necesitas ayuda?</h4>
            <p className="!text-sm !text-slate-300 mt-4 leading-relaxed">
              Si quieres apoyo profesional, habla con tu médico, enfermera o farmacéutico, o llama a:
            </p>
            <a
              href={`tel:${HELP_LINE.tel}`}
              className="mt-3 inline-flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-3 transition-colors"
            >
              <Phone className="w-5 h-5 text-success-300" aria-hidden="true" />
              <span>
                <span className="block text-lg font-semibold tracking-wide">{HELP_LINE.phone}</span>
                <span className="block text-xs text-slate-300">{HELP_LINE.hours}</span>
              </span>
            </a>
            <p className="!text-xs !text-slate-400 mt-2">
              <ExternalLinkItem href={HELP_LINE.url}>{HELP_LINE.name}</ExternalLinkItem>
            </p>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="relative border-t border-white/10 px-8 sm:px-10 py-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 text-xs text-slate-400">
          <p className="flex gap-2 flex-1 leading-relaxed !text-xs !text-slate-400">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true" />
            <span>
              Respira Libre es un proyecto educativo. La información de salud procede de las fuentes indicadas y
              las puntuaciones de recuperación son estimaciones orientativas, no un diagnóstico. No sustituye el
              consejo, diagnóstico ni tratamiento de un profesional sanitario. En caso de urgencia, llama al 112.
            </span>
          </p>
          <div className="shrink-0 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              Privacidad
            </button>
            <p className="!text-xs !text-slate-400">&copy; {new Date().getFullYear()} Respira Libre</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
