import { useId } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Trash2, Download, Cookie, Server, Mail } from 'lucide-react';
import { useDialog } from '../hooks/useDialog';

// Responsable y contacto para cualquier consulta sobre privacidad
const CONTACT = {
  name: 'Francisco García Rábago',
  email: 'pacoalfair@hotmail.com'
};

const Section = ({ icon: Icon, title, children }) => (
  <section className="flex gap-3">
    <div className="w-9 h-9 shrink-0 rounded-xl bg-primary-50 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
    </div>
    <div>
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <div className="mt-1 text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  </section>
);

/**
 * Privacidad explicada al usuario: qué se guarda, dónde y cómo borrarlo.
 * Respira Libre no tiene servidor propio: los datos de salud nunca salen del dispositivo.
 * Si algún día se añade sincronización, cuentas o analítica, este texto debe revisarse
 * (los datos de salud pasarían a tratarse fuera del dispositivo: art. 9 RGPD).
 */
const PrivacyModal = ({ onClose }) => {
  const titleId = useId();
  const dialogRef = useDialog(onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 id={titleId} className="text-2xl font-bold text-slate-900">
            Tu privacidad
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-6">
          <Section icon={Smartphone} title="Tus datos se quedan en tu dispositivo">
            <p>
              Lo que introduces (fecha de inicio, cigarrillos al día, precio del paquete, tu registro diario,
              tus objetivos y el recordatorio) se guarda <strong>solo en el almacenamiento de este navegador</strong>.
              Respira Libre no tiene servidor ni base de datos: nadie, tampoco nosotros, puede ver esos datos.
            </p>
            <p>
              Por eso, si borras los datos del navegador o cambias de dispositivo, se pierden salvo que hayas
              descargado una copia.
            </p>
          </Section>

          <Section icon={Download} title="Llévate tus datos">
            <p>
              En <strong>Configuración → Copia de seguridad → Exportar datos</strong> descargas un archivo con todo
              tu progreso, que puedes importar en otro dispositivo.
            </p>
          </Section>

          <Section icon={Trash2} title="Borra tus datos">
            <p>
              En <strong>Configuración → Reiniciar mi camino desde cero</strong> se borra tu historial, tus objetivos
              y tus estadísticas. También puedes borrar los datos de este sitio desde los ajustes de tu navegador.
            </p>
          </Section>

          <Section icon={Cookie} title="Sin cookies ni analítica">
            <p>
              No usamos cookies, herramientas de analítica, publicidad ni rastreadores. Solo se guarda en el
              navegador lo necesario para que la app funcione: tus datos y tu preferencia de tema.
            </p>
          </Section>

          <Section icon={Server} title="Alojamiento">
            <p>
              La web se sirve desde Vercel, que, como cualquier servidor, registra datos técnicos de la conexión
              (como la dirección IP) para entregar la página y protegerla frente a ataques. Esos registros no
              incluyen tus datos de consumo. Las fuentes y los archivos de la app se sirven desde el mismo sitio,
              sin llamar a servicios de terceros.
            </p>
          </Section>

          <Section icon={Mail} title="Contacto">
            <p>
              Responsable: {CONTACT.name}. Para cualquier duda sobre privacidad, escribe a{' '}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold text-primary-600 underline">
                {CONTACT.email}
              </a>
              . Si crees que no se han respetado tus derechos, puedes reclamar ante la Agencia Española de
              Protección de Datos (
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 underline"
              >
                aepd.es
              </a>
              ).
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyModal;
